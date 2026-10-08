"use client";

/**
 * CONTACT FORM — /contact's one form container, two tabs: Request a Quote
 * and General Enquiry. Only the active tab is shown; both stay mounted (the
 * inactive one `hidden`) so switching tabs never throws away what a visitor
 * has typed.
 *
 * Reuses the homepage RequestQuote form's field style, required/optional
 * markers and crane taxonomy (exported from RequestQuote.tsx), so the two
 * forms read as one system. Both tabs submit through the single
 * submitContact() seam — one submission path, not two.
 *
 * ⚠ PENDING INTEGRATION: submitContact() has no destination yet and returns
 * "not-configured". The form says so up front, and after submit it states
 * that nothing was sent and offers the phone line plus an email fallback
 * (the visitor's own mail app, pre-filled for the published info@ inbox).
 * There is deliberately no path that shows a success message today.
 *
 * Validation is custom (noValidate) so errors are written messages next to
 * each field, linked by aria-describedby, flagged aria-invalid, summarised
 * in an alert, with focus moved to the first problem — never colour alone.
 */

import {
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AlertCircle, Info } from "lucide-react";
import Button from "@/components/site/Button";
import { CRANE_TYPES, field, label, Opt, Req } from "@/components/site/RequestQuote";
import { submitContact, type ContactKind, type SubmitResult } from "./submitContact";
import { TAB_ID, useContactTabs, type ContactTab } from "./ContactTabs";

/* ── Options ──────────────────────────────────────────────────────────── */

// The site's approved service terms — the nav's Services column and
// CoreServices.tsx, in the same journey order (approved 2026-10-08).
const SERVICES = [
  "Crane Rental",
  "Lift Planning & Engineering",
  "Specialized Rigging",
  "Machinery Moving",
  "Industrial Storage",
  "Wind Energy",
  "Other / Not Sure",
];

// Services where crane specifics are worth asking for. Everything else
// skips the lifting fieldset entirely (progressive disclosure).
const LIFT_SERVICES = new Set([
  "Crane Rental",
  "Lift Planning & Engineering",
  "Wind Energy",
  "Other / Not Sure",
]);

const QUOTE_CRANE_TYPES = [
  ...CRANE_TYPES.filter((t) => !t.startsWith("Not sure")),
  "Not sure — need assistance",
];

// Kept neutral: nothing here claims billing or sales enquiries reach a
// dedicated department — that routing hasn't been confirmed.
const ENQUIRY_TYPES = [
  "General Information",
  "Existing Project",
  "Equipment Sales",
  "Billing / Accounts",
  "Other",
];

const FILE_EXTENSIONS = [".pdf", ".dwg", ".dxf", ".jpg", ".jpeg", ".png"];
const MAX_FILE_MB = 10;

const MAIN_PHONE = { display: "1-800-799-2505", href: "tel:+18007992505" };
const MAIN_EMAIL = "info@tntcrane.com";

/* ── Validation ───────────────────────────────────────────────────────── */

type Rule = {
  name: string;
  label: string;
  required?: string;
  kind?: "email" | "phone";
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const QUOTE_RULES: Rule[] = [
  { name: "fullName", label: "Full name", required: "Enter your full name." },
  { name: "company", label: "Company name", required: "Enter your company name." },
  { name: "email", label: "Email address", required: "Enter your email address.", kind: "email" },
  { name: "phone", label: "Phone number", required: "Enter your phone number.", kind: "phone" },
  { name: "projectName", label: "Project name" },
  { name: "projectLocation", label: "Project location", required: "Tell us where the project is." },
  { name: "service", label: "Service required", required: "Select the service you need." },
  { name: "startDate", label: "Project start date" },
  { name: "duration", label: "Estimated duration" },
  { name: "craneType", label: "Crane type" },
  { name: "loadWeight", label: "Load weight (tons)" },
  { name: "liftRadius", label: "Lift radius (ft)" },
  { name: "description", label: "Project description", required: "Describe the project." },
];

const ENQUIRY_RULES: Rule[] = [
  { name: "fullName", label: "Full name", required: "Enter your full name." },
  { name: "email", label: "Email address", required: "Enter your email address.", kind: "email" },
  { name: "phone", label: "Phone number", kind: "phone" },
  { name: "company", label: "Company name" },
  { name: "enquiryType", label: "Enquiry type", required: "Choose an enquiry type." },
  { name: "message", label: "Message", required: "Enter your message." },
];

function checkValue(rule: Rule, raw: string): string | null {
  const v = raw.trim();
  if (!v) return rule.required ?? null;
  if (rule.kind === "email" && !EMAIL_RE.test(v)) {
    return "Enter a valid email address, like name@company.com.";
  }
  if (rule.kind === "phone") {
    const digits = v.replace(/\D/g, "").length;
    if (digits < 10 || digits > 15) return "Enter a phone number with at least 10 digits.";
  }
  return null;
}

function checkFile(file: File | null): string | null {
  if (!file || file.size === 0) return null;
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!FILE_EXTENSIONS.includes(ext)) return "Attach a PDF, DWG, DXF, JPG or PNG file.";
  if (file.size > MAX_FILE_MB * 1024 * 1024) return `Attach a file of ${MAX_FILE_MB} MB or smaller.`;
  return null;
}

type Errors = Record<string, string>;

function validateForm(form: HTMLFormElement, rules: Rule[]): Errors {
  const data = new FormData(form);
  const errors: Errors = {};
  for (const rule of rules) {
    // Fields that aren't rendered (e.g. the lifting fieldset when hidden)
    // simply aren't in the FormData — skip rather than flag.
    if (!form.elements.namedItem(rule.name)) continue;
    const msg = checkValue(rule, String(data.get(rule.name) ?? ""));
    if (msg) errors[rule.name] = msg;
  }
  const file = data.get("attachment");
  const fileMsg = checkFile(file instanceof File ? file : null);
  if (fileMsg) errors.attachment = fileMsg;
  return errors;
}

/* ── Shared hook: one submit path for both tabs ───────────────────────── */

type Status = { state: "idle" } | { state: "submitting" } | SubmitResult;

function useContactForm(kind: ContactKind, rules: Rule[], idPrefix: string) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [mailto, setMailto] = useState<string | null>(null);
  // A ref, not state: a double-click lands before React re-renders, so only
  // a synchronous flag reliably blocks the second submit.
  const busy = useRef(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy.current) return;
    const form = e.currentTarget;
    const found = validateForm(form, rules);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      setStatus({ state: "idle" });
      document.getElementById(`${idPrefix}-${first}`)?.focus();
      return;
    }

    busy.current = true;
    setStatus({ state: "submitting" });
    const fd = new FormData(form);
    const data: Record<string, string> = {};
    for (const [k, v] of fd.entries()) {
      if (v instanceof File) {
        if (v.size > 0) data[k] = v.name; // name only — no file is transmitted
      } else if (v.trim()) {
        data[k] = v.trim();
      }
    }
    const result = await submitContact(kind, data);
    busy.current = false;
    setStatus(result);
    setMailto(result.status === "sent" ? null : buildMailto(kind, rules, data));
  };

  // Re-check a field the moment it's fixed, but don't nag about fields the
  // visitor hasn't attempted yet — only fields already flagged re-validate.
  const recheck = (e: FocusEvent<HTMLFormElement> | FormEvent<HTMLFormElement>) => {
    const el = e.target as HTMLInputElement;
    if (!el.name || !(el.name in errors)) return;
    const msg =
      el.name === "attachment"
        ? checkFile(el.files?.[0] ?? null)
        : checkValue(rules.find((r) => r.name === el.name) ?? { name: el.name, label: "" }, el.value);
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) next[el.name] = msg;
      else delete next[el.name];
      return next;
    });
  };

  /** aria wiring for one control. */
  const a11y = (name: string, hint?: boolean) => {
    const id = `${idPrefix}-${name}`;
    const describedBy = [hint && `${id}-hint`, errors[name] && `${id}-error`]
      .filter(Boolean)
      .join(" ");
    return {
      id,
      name,
      "aria-invalid": errors[name] ? true : undefined,
      "aria-describedby": describedBy || undefined,
    } as const;
  };

  return { errors, status, mailto, onSubmit, recheck, a11y };
}

function buildMailto(kind: ContactKind, rules: Rule[], data: Record<string, string>): string {
  const lines = rules
    .filter((r) => data[r.name])
    .map((r) => `${r.label}: ${data[r.name]}`);
  if (data.attachment) lines.push(`Attachment (please attach to this email): ${data.attachment}`);
  const subject =
    kind === "quote"
      ? `Quote request: ${data.service ?? ""}${data.projectLocation ? `, ${data.projectLocation}` : ""}`
      : `Enquiry: ${data.enquiryType ?? ""}`;
  // Mail clients truncate very long mailto: URLs; keep the body comfortably short.
  const body = lines.join("\n").slice(0, 1800);
  return `mailto:${MAIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ── Presentational pieces ────────────────────────────────────────────── */

function Field({
  id,
  text,
  required,
  optional,
  error,
  hint,
  className = "",
  children,
}: {
  id: string;
  text: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={label}>
        {text}
        {required ? <Req /> : optional ? <Opt /> : null}
      </label>
      <div className="mt-2">{children}</div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 font-body text-xs text-tnt-meta">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-start gap-1.5 font-body text-[13px] font-semibold text-tnt-maroon"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// Error state: a maroon border via an aria-attribute variant, so it can't
// lose a specificity fight with `field`'s own border-black/15.
const control = `${field} aria-[invalid=true]:border-tnt-maroon`;

const legendCls = "font-display text-xl tracking-wide text-black uppercase";

function ErrorSummary({ errors, rules, idPrefix }: { errors: Errors; rules: Rule[]; idPrefix: string }) {
  const keys = Object.keys(errors);
  if (keys.length === 0) return null;
  const labelFor = (k: string) =>
    k === "attachment" ? "File attachment" : (rules.find((r) => r.name === k)?.label ?? k);
  return (
    <div role="alert" className="mb-6 rounded-lg border border-tnt-maroon/40 bg-tnt-maroon/[0.04] p-4">
      <p className="flex items-center gap-2 font-body text-sm font-bold text-tnt-maroon">
        <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
        {keys.length === 1 ? "1 field needs attention" : `${keys.length} fields need attention`}
      </p>
      <ul className="mt-2 space-y-1 pl-6">
        {keys.map((k) => (
          <li key={k} className="list-disc font-body text-[13px] text-tnt-maroon">
            <a
              href={`#${idPrefix}-${k}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`${idPrefix}-${k}`)?.focus();
              }}
              className="underline underline-offset-2 hover:no-underline"
            >
              {labelFor(k)}: {errors[k]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PendingNotice() {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-tnt-amber/60 bg-tnt-amber/10 px-4 py-3 font-body text-[13px] leading-relaxed text-black/80">
      <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-black/70" />
      <span>
        <strong className="font-semibold text-black">Online submission is being connected.</strong>{" "}
        Until it is, this form can&rsquo;t deliver your details to our team. For anything you need
        now, call{" "}
        <a href={MAIN_PHONE.href} className="font-semibold text-black underline underline-offset-2">
          {MAIN_PHONE.display}
        </a>{" "}
        or email{" "}
        <a href={`mailto:${MAIN_EMAIL}`} className="font-semibold text-black underline underline-offset-2">
          {MAIN_EMAIL}
        </a>
        .
      </span>
    </p>
  );
}

function ResultPanel({ status, mailto }: { status: Status; mailto: string | null }) {
  if ("state" in status) return null; // idle / submitting
  if (status.status === "sent") {
    return (
      <div role="status" className="mt-6 rounded-lg border border-black/15 bg-black/[0.03] p-5">
        <p className="font-display text-2xl tracking-wide text-black uppercase">Request sent</p>
        <p className="mt-2 font-body text-sm text-tnt-body">
          Thanks, we&rsquo;ve received your details. For anything urgent, call{" "}
          <a href={MAIN_PHONE.href} className="font-semibold text-black underline">
            {MAIN_PHONE.display}
          </a>
          .
        </p>
      </div>
    );
  }
  const failed = status.status === "failed";
  return (
    <div
      role={failed ? "alert" : "status"}
      className="mt-6 rounded-lg border border-tnt-maroon/40 bg-tnt-maroon/[0.04] p-5"
    >
      <p className="flex items-center gap-2 font-body text-base font-bold text-tnt-maroon">
        <AlertCircle aria-hidden="true" className="h-5 w-5 shrink-0" />
        Your request was not sent
      </p>
      <p className="mt-2 font-body text-sm leading-relaxed text-black/75">
        {failed
          ? "Something went wrong on our side. Your details are still in the form, so you can try again, or reach us directly:"
          : "Online submissions aren’t connected yet, so nothing has been delivered to our team. Your details are still in the form. Please reach us directly:"}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button href={MAIN_PHONE.href} variant="primary" arrow={false}>
          Call {MAIN_PHONE.display}
        </Button>
        {mailto && (
          <Button href={mailto} variant="secondary" arrow={false}>
            Email these details
          </Button>
        )}
      </div>
      {mailto && (
        <p className="mt-3 font-body text-xs text-tnt-meta">
          &ldquo;Email these details&rdquo; opens your own email app with this form pre-filled,
          addressed to {MAIN_EMAIL}.
        </p>
      )}
    </div>
  );
}

function SubmitRow({ status, children }: { status: Status; children: string }) {
  const submitting = "state" in status && status.state === "submitting";
  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <Button type="submit" variant="primary">
        {submitting ? "Submitting…" : children}
      </Button>
      <span aria-live="polite" className="sr-only">
        {submitting ? "Submitting your request" : ""}
      </span>
    </div>
  );
}

/* ── Tab 01 — Request a Quote ─────────────────────────────────────────── */

function QuoteForm() {
  const p = "cq";
  const { errors, status, mailto, onSubmit, recheck, a11y } = useContactForm("quote", QUOTE_RULES, p);
  const [service, setService] = useState("");
  const showLift = LIFT_SERVICES.has(service);
  const submitting = "state" in status && status.state === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} onBlur={recheck} onChange={recheck} aria-busy={submitting}>
      <ErrorSummary errors={errors} rules={QUOTE_RULES} idPrefix={p} />
      <p className="mb-6 font-body text-[13px] text-tnt-body">
        <span aria-hidden="true" className="text-tnt-maroon">*</span> Required field
      </p>

      <fieldset>
        <legend className={legendCls}>Your details</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field id={`${p}-fullName`} text="Full name" required error={errors.fullName}>
            <input {...a11y("fullName")} required autoComplete="name" className={control} />
          </Field>
          <Field id={`${p}-company`} text="Company name" required error={errors.company}>
            <input {...a11y("company")} required autoComplete="organization" className={control} />
          </Field>
          <Field id={`${p}-email`} text="Email address" required error={errors.email}>
            <input {...a11y("email")} type="email" required autoComplete="email" className={control} />
          </Field>
          <Field id={`${p}-phone`} text="Phone number" required error={errors.phone}>
            <input {...a11y("phone")} type="tel" required autoComplete="tel" className={control} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-10">
        <legend className={legendCls}>Your project</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field id={`${p}-service`} text="Service required" required error={errors.service}>
            <select
              {...a11y("service")}
              required
              value={service}
              onChange={(e) => setService(e.target.value)}
              className={control}
            >
              <option value="" disabled>
                Select a service
              </option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field
            id={`${p}-projectLocation`}
            text="Project location"
            required
            error={errors.projectLocation}
            hint="City and state/province, or ZIP/postal code"
          >
            <input
              {...a11y("projectLocation", true)}
              required
              placeholder="e.g. Houston, TX"
              className={control}
            />
          </Field>
          <Field id={`${p}-projectName`} text="Project name" optional>
            <input {...a11y("projectName")} className={control} />
          </Field>
          <Field id={`${p}-startDate`} text="Project start date" optional>
            <input {...a11y("startDate")} type="date" className={control} />
          </Field>
          <Field id={`${p}-duration`} text="Estimated duration" optional>
            <input {...a11y("duration")} placeholder="e.g. 3 days, 6 weeks" className={control} />
          </Field>
        </div>
      </fieldset>

      {/* Progressive disclosure: crane specifics only for lifting work, and
          every one optional — a visitor who doesn't know them isn't blocked. */}
      {showLift && (
        <fieldset className="mt-10">
          <legend className={legendCls}>
            Lifting details <span className="font-body text-sm tracking-normal text-tnt-meta normal-case">(optional)</span>
          </legend>
          <p className="mt-2 font-body text-[13px] text-tnt-body">
            If you know them, these help us match the right crane. If not, leave them blank and our
            team will work it out with you.
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            <Field id={`${p}-craneType`} text="Crane type">
              <select {...a11y("craneType")} defaultValue="" className={control}>
                <option value="">Select a crane type</option>
                {QUOTE_CRANE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field id={`${p}-loadWeight`} text="Load weight (tons)">
              <input
                {...a11y("loadWeight")}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="e.g. 40"
                className={control}
              />
            </Field>
            <Field id={`${p}-liftRadius`} text="Lift radius (ft)">
              <input
                {...a11y("liftRadius")}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="e.g. 80"
                className={control}
              />
            </Field>
          </div>
        </fieldset>
      )}

      <div className="mt-10 grid gap-5">
        <Field id={`${p}-description`} text="Project description" required error={errors.description}>
          <textarea
            {...a11y("description")}
            required
            rows={5}
            placeholder="Scope, site conditions, access, lift height, anything else we should know…"
            className={`${control} resize-y`}
          />
        </Field>
        <Field
          id={`${p}-attachment`}
          text="File attachment"
          optional
          error={errors.attachment}
          hint={`Drawings or specs: PDF, DWG, DXF, JPG or PNG, up to ${MAX_FILE_MB} MB.`}
        >
          <input
            {...a11y("attachment", true)}
            type="file"
            accept={FILE_EXTENSIONS.join(",")}
            className="block w-full font-body text-sm text-tnt-body file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-tnt-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tnt-amber"
          />
        </Field>
      </div>

      {/* SMS consent — separate, optional, never pre-checked. Wording copied
          verbatim from the homepage RequestQuote form; ⚠ NOT YET APPROVED by
          TNT legal — confirm before launch (see the delivery report). */}
      <label className="mt-6 flex items-start gap-3 font-body text-[13px] leading-relaxed text-tnt-body">
        <input type="checkbox" name="smsConsent" value="yes" className="mt-1 h-4 w-4 shrink-0 accent-tnt-amber" />
        <span>
          I agree to receive text messages from TNT Crane &amp; Rigging about my request. Reply STOP
          to opt out. Message &amp; data rates may apply.
        </span>
      </label>

      <div className="mt-8">
        <PendingNotice />
      </div>
      <SubmitRow status={status}>Submit Project Request</SubmitRow>
      <ResultPanel status={status} mailto={mailto} />
    </form>
  );
}

/* ── Tab 02 — General Enquiry ─────────────────────────────────────────── */

function EnquiryForm() {
  const p = "ce";
  const { errors, status, mailto, onSubmit, recheck, a11y } = useContactForm("enquiry", ENQUIRY_RULES, p);
  const submitting = "state" in status && status.state === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} onBlur={recheck} onChange={recheck} aria-busy={submitting}>
      <ErrorSummary errors={errors} rules={ENQUIRY_RULES} idPrefix={p} />
      <p className="mb-6 font-body text-[13px] text-tnt-body">
        <span aria-hidden="true" className="text-tnt-maroon">*</span> Required field
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${p}-fullName`} text="Full name" required error={errors.fullName}>
          <input {...a11y("fullName")} required autoComplete="name" className={control} />
        </Field>
        <Field id={`${p}-email`} text="Email address" required error={errors.email}>
          <input {...a11y("email")} type="email" required autoComplete="email" className={control} />
        </Field>
        <Field id={`${p}-phone`} text="Phone number" optional error={errors.phone}>
          <input {...a11y("phone")} type="tel" autoComplete="tel" className={control} />
        </Field>
        <Field id={`${p}-company`} text="Company name" optional>
          <input {...a11y("company")} autoComplete="organization" className={control} />
        </Field>
        <Field id={`${p}-enquiryType`} text="Enquiry type" required error={errors.enquiryType} className="sm:col-span-2">
          <select {...a11y("enquiryType")} required defaultValue="" className={control}>
            <option value="" disabled>
              Select an enquiry type
            </option>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${p}-message`} text="Message" required error={errors.message} className="sm:col-span-2">
          <textarea {...a11y("message")} required rows={6} className={`${control} resize-y`} />
        </Field>
      </div>

      <div className="mt-8">
        <PendingNotice />
      </div>
      <SubmitRow status={status}>Send Enquiry</SubmitRow>
      <ResultPanel status={status} mailto={mailto} />
    </form>
  );
}

/* ── Container: tabs ──────────────────────────────────────────────────── */

const TABS: { id: ContactTab; label: string }[] = [
  { id: "quote", label: "Request a Quote" },
  { id: "enquiry", label: "General Enquiry" },
];

export default function ContactForm() {
  const { tab, setTab } = useContactTabs();

  // WAI-ARIA tabs pattern: arrows/Home/End move between tabs and activate
  // them (automatic activation — there are only two, both instant).
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = TABS.findIndex((t) => t.id === tab);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    setTab(TABS[next].id);
    document.getElementById(TAB_ID[TABS[next].id])?.focus();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div role="tablist" aria-label="Contact form type" className="grid grid-cols-2 border-b border-black/10">
        {TABS.map((t) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              id={TAB_ID[t.id]}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${TAB_ID[t.id]}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={onKeyDown}
              className={`px-3 py-4 font-display text-base tracking-wide uppercase transition-colors focus-visible:ring-2 focus-visible:ring-tnt-amber focus-visible:outline-none focus-visible:ring-inset sm:px-6 sm:py-5 sm:text-xl ${
                on
                  ? "bg-white text-black shadow-[inset_0_-3px_0_var(--color-tnt-amber)]"
                  : "bg-black/[0.03] text-black/50 hover:text-black"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {TABS.map((t) => (
        <div
          key={t.id}
          id={`${TAB_ID[t.id]}-panel`}
          role="tabpanel"
          aria-labelledby={TAB_ID[t.id]}
          hidden={tab !== t.id}
          className="p-6 sm:p-8"
        >
          {t.id === "quote" ? <QuoteForm /> : <EnquiryForm />}
        </div>
      ))}
    </div>
  );
}

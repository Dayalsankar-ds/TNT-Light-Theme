"use client";

/**
 * CONTACT TABS — the one piece of state /contact shares across sections.
 *
 * The hero CTA, the three "How can we help?" cards and the form's own tab
 * list all need to agree on which form tab is open, so the state lives in a
 * provider wrapping the page rather than inside ContactForm.
 *
 * <ContactTrigger> is how a CTA elsewhere on the page opens a tab: it commits
 * the tab change synchronously (flushSync) BEFORE scrolling, so the visitor
 * never lands on the wrong form and nothing waits on a timeout. It then moves
 * focus to the target (the active tab, or the branch search), so keyboard
 * and screen-reader users arrive where sighted users are looking.
 *
 * Rendered as the shared Button with no href, a real <button>, for the same
 * reason as /about's ScrollButton: the browser's own instant hash jump would
 * fight the smooth scroll.
 */

import { createContext, useContext, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import Button from "@/components/site/Button";
import { scrollToElement } from "@/components/site/scrollToElement";

export type ContactTab = "quote" | "enquiry";

/** DOM ids, shared by the tab list and the triggers that focus into it. */
export const TAB_ID: Record<ContactTab, string> = {
  quote: "contact-tab-quote",
  enquiry: "contact-tab-enquiry",
};

type Ctx = { tab: ContactTab; setTab: (t: ContactTab) => void };

const ContactTabsContext = createContext<Ctx | null>(null);

export function ContactTabsProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<ContactTab>("quote");
  return (
    <ContactTabsContext.Provider value={{ tab, setTab }}>{children}</ContactTabsContext.Provider>
  );
}

export function useContactTabs(): Ctx {
  const ctx = useContext(ContactTabsContext);
  if (!ctx) throw new Error("useContactTabs must be used inside <ContactTabsProvider>");
  return ctx;
}

export function ContactTrigger({
  targetId,
  tab,
  focusId,
  children,
  variant = "primary",
  className = "",
}: {
  /** Section to scroll to. */
  targetId: string;
  /** Form tab to open first, if any. */
  tab?: ContactTab;
  /** Element to focus after scrolling. Defaults to the opened tab. */
  focusId?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "link";
  className?: string;
}) {
  const { setTab } = useContactTabs();
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => {
        if (tab) flushSync(() => setTab(tab));
        const el = document.getElementById(targetId);
        if (!el) return;
        scrollToElement(el, { smooth: true });
        history.replaceState(null, "", `#${targetId}`);
        const focusTarget = document.getElementById(focusId ?? (tab ? TAB_ID[tab] : ""));
        focusTarget?.focus({ preventScroll: true });
      }}
    >
      {children}
    </Button>
  );
}

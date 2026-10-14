/**
 * AVAILABILITY BADGE — one services.ts status as a labelled pill. Shared by
 * the regional availability tabs and the Crane Rental focus view. No client
 * state, so it renders in server and client components alike.
 */

import { Check, CircleHelp, Network, Minus } from "lucide-react";
import { AVAILABILITY_LABEL, type Availability } from "@/components/site/services";

const STATUS_STYLE: Record<Availability, { icon: typeof Check; cls: string }> = {
  direct: { icon: Check, cls: "bg-tnt-amber text-black" },
  network: { icon: Network, cls: "bg-black text-tnt-amber" },
  unconfirmed: { icon: CircleHelp, cls: "border border-black/20 text-black/55" },
  not_offered: { icon: Minus, cls: "bg-black/5 text-black/40" },
};

export default function StatusBadge({ status }: { status: Availability }) {
  const { icon: Glyph, cls } = STATUS_STYLE[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-[11px] font-semibold whitespace-nowrap ${cls}`}
    >
      <Glyph aria-hidden="true" className="h-3.5 w-3.5" />
      {AVAILABILITY_LABEL[status]}
    </span>
  );
}


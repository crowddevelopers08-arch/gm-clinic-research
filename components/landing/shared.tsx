import type { ReactNode } from "react";

/* ---------- layout ---------- */
export const WRAP = "relative z-[1] mx-auto w-full max-w-[1160px] px-6";

/* blueprint grid backdrop used behind hero + form */
export const GRID_BG =
  "relative before:pointer-events-none before:absolute before:inset-0 before:z-0 before:content-[''] " +
  "before:[background-image:linear-gradient(to_right,rgba(12,46,51,.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(12,46,51,.045)_1px,transparent_1px)] " +
  "before:[background-size:34px_34px] " +
  "before:[-webkit-mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000_40%,transparent_100%)] " +
  "before:[mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000_40%,transparent_100%)]";

/* ---------- buttons ---------- */
export const BTN =
  "inline-flex cursor-pointer items-center justify-center gap-[9px] whitespace-nowrap rounded-full border-0 text-[15px] font-semibold transition-all duration-150";
export const BTN_PRIMARY =
  "bg-[var(--accent)] px-6 py-[14px] text-white shadow-[0_10px_22px_-10px_rgba(10,124,174,.65)] hover:-translate-y-[2px] hover:bg-[var(--accent-600)]";
export const BTN_DARK =
  "bg-[var(--ink)] px-6 py-[14px] text-white hover:-translate-y-[2px] hover:bg-[var(--ink-2)]";
export const BTN_GHOST =
  "border-[1.5px] border-[var(--line-2)] bg-transparent px-6 py-[14px] text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand-600)]";
export const BTN_WA =
  "bg-[#25D366] px-6 py-[14px] text-[#0a2e14] hover:-translate-y-[2px] hover:bg-[#1FBE5A]";
export const BTN_LG = "!px-[30px] !py-[17px] !text-[16px]";
export const BTN_BLOCK = "w-full";

/* ---------- eyebrow ---------- */
export function Eyebrow({
  children,
  className = "",
  tone = "brand",
  barClassName = "",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "light";
  barClassName?: string;
}) {
  const color = tone === "light" ? "text-[#5FD6C0]" : "text-[var(--brand-600)]";
  const bar = tone === "light" ? "bg-[#5FD6C0]" : "bg-[var(--brand)]";
  return (
    <span
      className={`inline-flex items-center gap-[9px] font-[family-name:var(--font-mono)] text-[12px] font-semibold uppercase tracking-[.14em] ${color} ${className}`}
    >
      <span className={`inline-block h-px w-[22px] ${bar} ${barClassName}`} />
      {children}
    </span>
  );
}

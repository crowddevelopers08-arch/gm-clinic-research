"use client";

import type { ReactNode } from "react";

export const OPEN_FORM_EVENT = "open-lead-form";

export function OpenFormButton({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_FORM_EVENT))}
    >
      {children}
    </button>
  );
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CONFIG } from "./config";
import { OPEN_FORM_EVENT } from "./OpenFormButton";
import { BTN, BTN_DARK, BTN_GHOST, BTN_LG, BTN_PRIMARY } from "./shared";

/* =====================================================================
   Questions sourced verbatim from the "Clinic Startup Research 2026"
   Google Form — grouped into its 4 sections.
   ===================================================================== */
type Field =
  | {
      type: "short" | "paragraph";
      name: string;
      label: string;
      required: boolean;
      placeholder?: string;
      minLength?: number;
      maxLength?: number;
      mustIncludeDigit?: boolean;
      format?: "email" | "tel";
    }
  | {
      type: "radio" | "checkbox";
      name: string;
      label: string;
      required: boolean;
      options: string[];
      note?: string;
      max?: number;
      cols?: 1 | 2;
    }
  | {
      type: "scale";
      name: string;
      label: string;
      required: boolean;
      min: number;
      max: number;
      minLabel?: string;
      maxLabel?: string;
    };

type Step = { name: string; title: string; subtitle?: string; fields: Field[] };

const STEPS: Step[] = [
  {
    name: "Your Details",
    title: "Your details",
    subtitle: "So we can send you the template and keep you updated.",
    fields: [
      {
        type: "short",
        name: "name",
        label: "Full name",
        required: true,
        placeholder: "Dr. Your Name",
        minLength: 2,
        maxLength: 60,
      },
      {
        type: "short",
        name: "email",
        label: "Email address",
        required: true,
        placeholder: "you@example.com",
        format: "email",
        maxLength: 80,
      },
      {
        type: "short",
        name: "phone",
        label: "Phone number (WhatsApp)",
        required: true,
        placeholder: "10-digit mobile number",
        format: "tel",
      },
    ],
  },
  {
    name: "Doctor Profile",
    title: "Doctor Profile",
    subtitle: "A little about you and your practice.",
    fields: [
      {
        type: "short",
        name: "speciality",
        label: "What is your medical speciality?",
        required: true,
        placeholder: "e.g. Dermatology, Dental, Orthopaedics, Ayurveda",
        minLength: 2,
        maxLength: 60,
      },
      {
        type: "short",
        name: "city",
        label: "Which city or district are you practising in?",
        required: true,
        placeholder: "e.g. Chennai, Coimbatore, Madurai",
        minLength: 2,
        maxLength: 60,
      },
      {
        type: "short",
        name: "years",
        label: "How many years have you been practising?",
        required: true,
        placeholder: "e.g. 6",
        mustIncludeDigit: true,
        maxLength: 20,
      },
      {
        type: "radio",
        name: "stage",
        label: "Which best describes you?",
        required: true,
        options: [
          "Planning to start my first clinic",
          "Starting within the next six months",
          "Started my clinic within the last two years",
          "Running a clinic for more than two years",
          "Planning a second branch",
        ],
      },
    ],
  },
  {
    name: "Clinic Plans",
    title: "Clinic Plans",
    subtitle: "Where you are in your clinic journey.",
    fields: [
      {
        type: "radio",
        name: "timeline",
        label: "When are you planning to start or expand your clinic?",
        required: true,
        options: [
          "Within the next 3 months",
          "Within 3-6 months",
          "Within 6-12 months",
          "More than 12 months from now",
          "Already started or expanded",
          "Not yet decided",
        ],
      },
      {
        type: "radio",
        name: "investment",
        label: "What approximate investment are you considering?",
        required: true,
        options: [
          "Below 5 lakh",
          "5-10 lakh",
          "10-20 lakh",
          "20-50 lakh",
          "Above 50 lakh",
          "Not yet decided",
          "Prefer not to say",
        ],
      },
      {
        type: "radio",
        name: "location_status",
        label: "Have you already selected a location?",
        required: true,
        options: [
          "Yes, location finalised",
          "I have shortlisted a few locations",
          "Still searching",
          "Not started looking yet",
        ],
      },
      {
        type: "scale",
        name: "location_confidence",
        label: "How confident are you about selecting the right location?",
        required: true,
        min: 1,
        max: 5,
        minLabel: "Not confident",
        maxLabel: "Very confident",
      },
    ],
  },
  {
    name: "Problems",
    title: "Problems",
    subtitle: "The challenges on your mind.",
    fields: [
      {
        type: "checkbox",
        name: "concerns",
        label:
          "Select up to five of your biggest concerns while starting or growing a clinic.",
        required: true,
        note: "(pick up to 5)",
        max: 5,
        cols: 2,
        options: [
          "Selecting the right location",
          "Calculating the required investment",
          "Understanding monthly expenses",
          "Setting consultation pricing",
          "Hiring and managing staff",
          "Clinic branding and positioning",
          "Getting initial patients",
          "Google and social media presence",
          "Patient follow-up and retention",
          "Creating systems and SOPs",
          "Legal registrations and compliance",
          "Reaching break-even",
          "Managing the clinic while practising",
          "Competing with established clinics",
        ],
      },
      {
        type: "paragraph",
        name: "top_problem",
        label: "Which one problem worries you the most?",
        required: true,
        placeholder: "Tell us in a line or two…",
      },
      {
        type: "paragraph",
        name: "mistake",
        label:
          "What clinic-starting mistake have you made or are most afraid of making?",
        required: false,
        placeholder: "Optional",
      },
      {
        type: "paragraph",
        name: "missing_support",
        label: "What information or support do you feel is currently missing?",
        required: false,
        placeholder: "Optional",
      },
    ],
  },
  {
    name: "Learning Preference",
    title: "Learning Preference",
    subtitle: "How you'd like us to support you.",
    fields: [
      {
        type: "checkbox",
        name: "learning_pref",
        label: "How would you prefer to learn?",
        required: true,
        cols: 1,
        options: [
          "Live Tamil workshop",
          "Recorded course",
          "Templates and checklists",
          "One-to-one consultation",
          "Doctor community and group mentoring",
        ],
      },
      {
        type: "checkbox",
        name: "paid_before",
        label:
          "Have you previously paid for any support to help you plan, start, manage, or grow a clinic?",
        required: true,
        cols: 1,
        options: [
          "Recorded course or online program",
          "Live workshop or training",
          "Templates and checklists",
          "One-to-one mentorship or consultation",
          "Branding, marketing or clinic setup agency",
          "No, I have never paid for this type of support",
        ],
      },
      {
        type: "radio",
        name: "attend_workshop",
        label:
          "Would you attend a free 90-minute workshop where we build a clinic's Business Model Canvas live?",
        required: true,
        options: [
          "Yes, I would attend",
          "Maybe, depending on the timing",
          "No, not currently",
        ],
      },
      {
        type: "radio",
        name: "post_workshop_support",
        label: "After the workshop, what kind of support would you consider?",
        required: true,
        options: [
          "Self-learning only",
          "Group mentoring",
          "One-to-one consultation",
          "Complete clinic setup assistance",
        ],
      },
    ],
  },
];

type AnswerValue = string | string[];

const inputClass =
  "w-full rounded-[11px] border-[1.5px] border-[var(--line-2)] bg-[var(--bg)] px-[15px] py-[13px] text-[15px] text-[var(--text)] transition-all duration-150 placeholder:text-[#9AAAA7] focus:border-[var(--brand)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,115,95,.16)] focus:outline-none";

const errorRing =
  "!border-[#c0392b] focus:!border-[#c0392b] focus:!shadow-[0_0_0_4px_rgba(192,57,43,.14)]";

function Pill({
  active,
  onClick,
  type,
  children,
}: {
  active: boolean;
  onClick: () => void;
  type: "radio" | "checkbox";
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex cursor-pointer items-center gap-3 rounded-[12px] border-[1.5px] px-[15px] py-[13px] text-left text-[.93rem] font-medium text-[var(--text)] transition-all duration-150 ${
        active
          ? "border-[var(--brand)] bg-[var(--brand-050)] shadow-[0_0_0_3px_rgba(0,115,95,.12)]"
          : "border-[var(--line-2)] bg-[var(--surface)] hover:border-[var(--brand)] hover:bg-[var(--brand-050)]"
      }`}
    >
      <span
        className={`grid h-5 w-5 flex-none place-items-center border-2 transition-all duration-150 ${
          type === "radio" ? "rounded-full" : "rounded-[6px]"
        } ${active ? "border-[var(--brand)] bg-[var(--brand)]" : "border-[var(--line-2)]"}`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          className={`text-white transition-all duration-150 ${
            active ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span>{children}</span>
    </button>
  );
}

export function LeadFormModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  /* open / close wiring */
  useEffect(() => {
    const openHandler = () => {
      setOpen(true);
      setCur(0);
      setErrors({});
    };
    window.addEventListener(OPEN_FORM_EVENT, openHandler);
    return () => window.removeEventListener(OPEN_FORM_EVENT, openHandler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const setAnswer = (name: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleCheckbox = (name: string, value: string, max?: number) => {
    setAnswers((prev) => {
      const list = Array.isArray(prev[name]) ? [...(prev[name] as string[])] : [];
      const idx = list.indexOf(value);
      if (idx >= 0) list.splice(idx, 1);
      else if (!max || list.length < max) list.push(value);
      return { ...prev, [name]: list };
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /** Returns an error message for a field, or "" when it's valid. */
  function fieldError(f: Field): string {
    const v = answers[f.name];

    if (Array.isArray(v)) {
      if (f.required && v.length === 0) return "Please select at least one option.";
      return "";
    }

    const s = (v ?? "").toString().trim();

    if (f.required && !s) {
      if (f.type === "radio" || f.type === "scale")
        return "Please select an option.";
      return "Please fill in this field.";
    }
    if (!s) return ""; // optional & empty → fine

    if (f.type === "short" || f.type === "paragraph") {
      if (f.format === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))
        return "Please enter a valid email address.";
      if (f.format === "tel" && !/^\d{10}$/.test(s.replace(/\D/g, "")))
        return "Please enter a valid 10-digit phone number.";
      if (f.minLength && s.length < f.minLength)
        return `Please enter at least ${f.minLength} characters.`;
      if (f.maxLength && s.length > f.maxLength)
        return `Please keep this under ${f.maxLength} characters.`;
      if (f.mustIncludeDigit && !/\d/.test(s))
        return "Please enter a number (e.g. 6).";
    }
    return "";
  }

  function validateStep(index: number): boolean {
    const next: Record<string, string> = {};
    let ok = true;
    STEPS[index].fields.forEach((f) => {
      const msg = fieldError(f);
      next[f.name] = msg;
      if (msg) ok = false;
    });
    setErrors((prev) => ({ ...prev, ...next }));
    return ok;
  }

  const next = () => {
    if (validateStep(cur)) setCur((c) => Math.min(c + 1, STEPS.length - 1));
  };
  const back = () => setCur((c) => Math.max(c - 1, 0));

  async function handleSubmit() {
    if (!validateStep(cur)) return;
    setSending(true);

    const payload: Record<string, unknown> = {
      ...answers,
      submitted_at: new Date().toISOString(),
      source: "Clinic Startup Research 2026 — Landing Popup",
    };

    try {
      if (CONFIG.submitEndpoint) {
        await fetch(CONFIG.submitEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      // eslint-disable-next-line no-console
      console.log("Survey captured:", payload);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Survey submit failed (showing success anyway):", err);
    }

    setSending(false);
    setOpen(false);
    // Show the dedicated thank-you page (with the PDF + WhatsApp CTAs).
    router.push("/thank-you");
  }

  if (!open) return null;

  const step = STEPS[cur];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[rgba(10,35,40,.55)] p-3 backdrop-blur-sm motion-safe:animate-[fade_.2s_ease] sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Clinic Startup Research 2026 survey"
    >
      <div className="relative my-auto w-full max-w-[680px] overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_34px_70px_-30px_rgba(10,35,40,.55)] motion-safe:animate-[pop-in_.42s_cubic-bezier(.16,.84,.44,1)_both] sm:rounded-[22px]">
        {/* close */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-[var(--line-2)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <>
          {/* header + progress */}
          <div className="px-5 pt-6 sm:px-[30px] sm:pt-[26px]">
              <div className="font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[.1em] text-[var(--brand-600)]">
                Clinic Startup Research 2026
              </div>
              <div className="mt-[14px] h-[6px] overflow-hidden rounded-full bg-[var(--line)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--brand),var(--accent))] transition-[width] duration-[400ms] ease-[cubic-bezier(.4,0,.2,1)]"
                  style={{ width: `${((cur + 1) / STEPS.length) * 100}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[.06em] text-[var(--muted)]">
                <span className="font-semibold text-[var(--brand-600)]">
                  Step {cur + 1} · {step.name}
                </span>
                <span>
                  {cur + 1} / {STEPS.length}
                </span>
              </div>
            </div>

            {/* body */}
            <div className="max-h-[calc(100vh-240px)] overflow-y-auto px-5 pb-8 pt-[22px] sm:px-[30px]">
              <div key={cur} className="animate-[fade_.35s_ease]">
                <div className="font-[family-name:var(--font-bricolage)] text-[1.35rem] font-bold text-[var(--ink)]">
                  {step.title}
                </div>
                {step.subtitle && (
                  <div className="mb-[22px] text-[.93rem] text-[var(--muted)]">
                    {step.subtitle}
                  </div>
                )}

                {step.fields.map((f) => {
                  const err = errors[f.name];
                  return (
                    <div key={f.name} className="mb-6">
                      <label className="mb-2 block text-[.93rem] font-semibold text-[var(--ink)]">
                        {f.label}
                        {f.required && (
                          <span className="ml-[2px] text-[var(--accent)]">*</span>
                        )}
                        {"note" in f && f.note && (
                          <span className="ml-[6px] text-[.82rem] font-normal text-[var(--muted)]">
                            {f.note}
                          </span>
                        )}
                      </label>

                      {f.type === "short" && (
                        <input
                          className={`${inputClass} ${err ? errorRing : ""}`}
                          type={
                            f.format === "email"
                              ? "email"
                              : f.format === "tel"
                                ? "tel"
                                : "text"
                          }
                          inputMode={
                            f.format === "email"
                              ? "email"
                              : f.format === "tel"
                                ? "tel"
                                : undefined
                          }
                          autoComplete={
                            f.format === "email"
                              ? "email"
                              : f.format === "tel"
                                ? "tel"
                                : f.name === "name"
                                  ? "name"
                                  : undefined
                          }
                          value={(answers[f.name] as string) || ""}
                          placeholder={f.placeholder}
                          maxLength={f.maxLength}
                          aria-invalid={!!err}
                          onChange={(e) => setAnswer(f.name, e.target.value)}
                        />
                      )}

                      {f.type === "paragraph" && (
                        <textarea
                          className={`${inputClass} min-h-[92px] resize-y ${
                            err ? errorRing : ""
                          }`}
                          value={(answers[f.name] as string) || ""}
                          placeholder={f.placeholder}
                          maxLength={f.maxLength}
                          aria-invalid={!!err}
                          onChange={(e) => setAnswer(f.name, e.target.value)}
                        />
                      )}

                      {(f.type === "radio" || f.type === "checkbox") && (
                        <div
                          className={`grid gap-[10px] ${
                            f.cols === 2 ? "sm:grid-cols-2" : "grid-cols-1"
                          }`}
                        >
                          {f.options.map((opt) => {
                            const selected =
                              f.type === "radio"
                                ? answers[f.name] === opt
                                : Array.isArray(answers[f.name]) &&
                                  (answers[f.name] as string[]).includes(opt);
                            return (
                              <Pill
                                key={opt}
                                type={f.type}
                                active={!!selected}
                                onClick={() =>
                                  f.type === "radio"
                                    ? setAnswer(f.name, opt)
                                    : toggleCheckbox(f.name, opt, f.max)
                                }
                              >
                                {opt}
                              </Pill>
                            );
                          })}
                        </div>
                      )}

                      {f.type === "scale" && (
                        <div>
                          <div className="flex gap-2 sm:gap-[10px]">
                            {Array.from(
                              { length: f.max - f.min + 1 },
                              (_, i) => f.min + i
                            ).map((n) => {
                              const selected = answers[f.name] === String(n);
                              return (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => setAnswer(f.name, String(n))}
                                  className={`grid h-12 flex-1 place-items-center rounded-[11px] border-[1.5px] text-[1rem] font-semibold transition-all duration-150 ${
                                    selected
                                      ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-[0_0_0_3px_rgba(0,115,95,.18)]"
                                      : "border-[var(--line-2)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--brand)]"
                                  }`}
                                >
                                  {n}
                                </button>
                              );
                            })}
                          </div>
                          {(f.minLabel || f.maxLabel) && (
                            <div className="mt-2 flex justify-between text-[.78rem] text-[var(--muted)]">
                              <span>{f.minLabel}</span>
                              <span>{f.maxLabel}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {err && (
                        <div className="mt-[7px] flex items-center gap-[6px] text-[.82rem] font-medium text-[#c0392b]">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            className="flex-none"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 8v4M12 16h.01" />
                          </svg>
                          {err}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* nav */}
            <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] px-5 py-4 sm:px-[30px] sm:py-5">
              {cur > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  className={`${BTN} ${BTN_GHOST}`}
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}
              {cur < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className={`${BTN} ${BTN_DARK}`}
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={sending}
                  className={`${BTN} ${BTN_PRIMARY} ${BTN_LG} !px-5 disabled:opacity-70 sm:!px-[30px]`}
                >
                  {sending ? (
                    "Submitting…"
                  ) : (
                    <>
                      <span className="sm:hidden">Submit →</span>
                      <span className="hidden sm:inline">
                        Submit &amp; get template →
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </>
      </div>
    </div>
  );
}

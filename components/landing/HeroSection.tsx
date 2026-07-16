import { BTN, BTN_LG, BTN_PRIMARY, Eyebrow, WRAP } from "./shared";
import { OpenFormButton } from "./OpenFormButton";
import { Reveal } from "./Reveal";

const chips = [
  {
    label: "Built for Tamil Nadu clinics",
    icon: <path d="M20 6 9 17l-5-5" />,
  },
  {
    label: "Takes 3–4 minutes",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    label: "Instant download",
    icon: <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />,
  },
];

export function HeroSection() {
  return (
    <header
      id="top"
      className="relative isolate overflow-hidden pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pb-[76px]"
    >
      {/* background image with slow ken-burns drift — portrait on mobile, wide on larger screens */}
      <div className="absolute inset-0 -z-20 bg-[url('https://res.cloudinary.com/duq66ybkd/image/upload/v1784177235/mob_hliih4.png')] bg-cover bg-center will-change-transform motion-safe:animate-[ken-burns_28s_ease-in-out_infinite_alternate] sm:bg-[url('https://res.cloudinary.com/duq66ybkd/image/upload/v1784177235/bgd_cal3kd.png')]" />
      {/* dark overlay for text legibility */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,34,42,.68)_0%,rgba(5,34,42,.9)_100%)]" />

      <div
        className={`${WRAP} flex max-w-full flex-col items-center px-4 text-center sm:px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-48`}
      >
        <div className="w-full max-w-6xl">
          <Reveal delay={0} y={18}>
            <Eyebrow tone="light" barClassName="hidden sm:inline-block">
              For doctors &amp; clinic owners · Tamil Nadu
            </Eyebrow>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="my-4 mt-5 font-[family-name:var(--font-bricolage)] text-[clamp(1.5rem,6vw,5rem)] font-extrabold leading-[1.12] tracking-[-.03em] text-white min-[360px]:text-[clamp(1.6rem,7vw,5rem)] min-[375px]:text-[clamp(1.72rem,7vw,5rem)] min-[400px]:text-[clamp(2rem,7vw,5rem)] sm:text-[clamp(2.35rem,6vw,5rem)] sm:leading-[1.05] sm:tracking-[-.02em]">
              Build your clinic on a{" "}
              <br className="sm:hidden" />
              <span className="whitespace-nowrap bg-[linear-gradient(100deg,#5fe0c9,#4fb8ea,#5fe0c9)] bg-[length:200%_auto] bg-clip-text text-transparent motion-safe:animate-[sheen_6s_linear_infinite]">
                real business plan
              </span>
              ,{" "}
              <br className="sm:hidden" />
              not guesswork.
            </h1>
          </Reveal>

          <Reveal delay={180} y={20}>
            <p className="mx-auto mb-[26px] max-w-[65ch] text-[clamp(1rem,1.6vw,1.35rem)] text-[#aec7c2]">
              Most new clinics don&apos;t struggle for lack of medical skill —
              they struggle without a clear business framework. Get our free
              Business Model Canvas starter, made for clinic owners, and map
              your whole practice on one page.
            </p>
          </Reveal>

          <Reveal delay={270} y={16}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <OpenFormButton
                className={`${BTN} ${BTN_PRIMARY} ${BTN_LG} w-full sm:w-auto`}
              >
                Claim your free template
              </OpenFormButton>
            </div>
          </Reveal>

          <Reveal delay={380} y={14} blur={false}>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5 sm:gap-3">
              {chips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-[7px] rounded-full border border-white/[.14] bg-white/[.08] px-[14px] py-[8px] text-[12.5px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,.15)] backdrop-blur-sm sm:px-[18px] sm:py-[9px] sm:text-[13.5px]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    className="flex-none text-[#5fe0c9]"
                  >
                    {chip.icon}
                  </svg>
                  {chip.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </header>
  );
}

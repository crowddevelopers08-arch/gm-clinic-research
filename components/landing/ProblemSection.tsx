import { Eyebrow, WRAP } from "./shared";
import { Reveal } from "./Reveal";

const pains = [
  {
    n: "01",
    title: "No clarity on the numbers",
    body: "Fees, footfall, running costs and break-even are decided on gut feel — so profit stays a mystery.",
  },
  {
    n: "02",
    title: "Marketing as an afterthought",
    body: "Patients are expected to \"just come.\" There's no plan for who to reach, where, or how to convert them.",
  },
  {
    n: "03",
    title: "Everything lives in your head",
    body: "Without one clear framework, decisions get reactive and the team has nothing solid to align around.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-[var(--ink)] py-16 max-[470px]:py-10 text-[#DDE9E7] sm:py-20">
      <div className={WRAP}>
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
          <div className="flex flex-col">
            <Reveal y={20}>
              <Eyebrow tone="light">The real reason</Eyebrow>
              <h2 className="mt-4 max-w-[20ch] font-[family-name:var(--font-bricolage)] text-[clamp(1.6rem,3.4vw,2.35rem)] font-bold leading-[1.05] tracking-[-.02em] text-white">
                Great doctors, but the clinic still struggles.
              </h2>
            </Reveal>
            <Reveal delay={120} className="mt-6 flex-1">
              <div className="h-full overflow-hidden rounded-[14px] bg-white/[.05]">
                <img
                  src="/doc.png"
                  alt="Clinic business planning illustration"
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
          <div className="grid gap-[14px]">
            {pains.map((pain, i) => (
              <Reveal key={pain.n} delay={i * 120} y={22}>
                <div className="flex gap-4 rounded-[14px] border border-white/[.09] bg-white/[.04] px-5 py-[18px] transition-colors duration-300 hover:border-white/[.18] hover:bg-white/[.06]">
                  <span className="flex-none pt-[2px] font-[family-name:var(--font-mono)] text-[14px] font-semibold text-[var(--brand-pulse)]">
                    {pain.n}
                  </span>
                  <div>
                    <h3 className="mb-[3px] text-[1.02rem] font-semibold text-white">
                      {pain.title}
                    </h3>
                    <p className="m-0 text-[.92rem] text-[#AEC4C1]">
                      {pain.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

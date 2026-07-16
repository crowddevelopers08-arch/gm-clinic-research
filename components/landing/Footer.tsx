import Image from "next/image";
import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer className="bg-[var(--ink-2)] py-8 text-[#9FB6B3] sm:py-6">
      <Reveal y={18} className="relative z-[1] mx-auto flex w-full max-w-[1160px] flex-col items-start justify-between gap-5 px-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-[11px]">
          <span className="inline-flex items-center rounded-[12px] px-2 py-1 sm:px-[18px] sm:py-[10px]">
            <Image
              src="https://res.cloudinary.com/duq66ybkd/image/upload/v1784177234/gmlogo1_v1yo66.png"
              alt="Grow Medico"
              width={160}
              height={60}
              unoptimized
              className="h-12 w-auto object-contain sm:h-14"
            />
          </span>
        </div>
        <p className="max-w-full text-[.8rem] leading-[1.55] sm:max-w-[52ch] sm:text-[.82rem]">
          This is a free business research &amp; education resource for clinic
          owners. Please do not share any patient or confidential clinical
          information. © {new Date().getFullYear()} Grow Medico.
        </p>
      </Reveal>
    </footer>
  );
}
import Image from "next/image";
import { BTN, BTN_PRIMARY } from "./shared";
import { OpenFormButton } from "./OpenFormButton";
import { Reveal } from "./Reveal";

// TODO: confirm the official Instagram handle
const INSTAGRAM_URL = "https://www.instagram.com/growmedico/";
const INSTAGRAM_HANDLE = "@growmedico";

const locations = ["Chennai", "Mumbai", "Nagpur"];

export function Footer() {
  return (
    <footer className="bg-[var(--ink-2)] pb-8 pt-12 text-[#9FB6B3] sm:pb-6 sm:pt-14">
      <Reveal y={18} className="relative z-[1] mx-auto w-full max-w-[1160px] px-6">
        {/* CTA strip */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-[18px] border border-white/[.1] bg-white/[.04] px-5 py-6 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-[family-name:var(--font-bricolage)] text-[1.2rem] font-bold leading-tight text-white sm:text-[1.4rem]">
              Ready to plan your clinic the right way?
            </p>
            <p className="mt-1 text-[.88rem]">
              Download the free Business Model Canvas starter in minutes.
            </p>
          </div>
          <OpenFormButton className={`${BTN} ${BTN_PRIMARY} w-full sm:w-auto`}>
            Get the free template
          </OpenFormButton>
        </div>

        {/* Brand, locations, social */}
        <div className="mt-10 grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr] sm:gap-10">
          <div>
            <Image
              src="https://res.cloudinary.com/duq66ybkd/image/upload/v1784177234/gmlogo1_v1yo66.png"
              alt="Grow Medico"
              width={160}
              height={60}
              unoptimized
              className="h-12 w-auto object-contain sm:h-14"
            />
            <p className="mt-3 max-w-[40ch] text-[.84rem] leading-[1.55]">
              Business research &amp; growth support for clinic and hospital
              owners.
            </p>
          </div>

          <div>
            <p className="text-[.75rem] font-semibold uppercase tracking-[.12em] text-white">
              Our locations
            </p>
            <ul className="mt-3 space-y-2 text-[.9rem]">
              {locations.map((city) => (
                <li key={city} className="flex items-center gap-2">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    className="flex-none text-[#5fe0c9]"
                    aria-hidden="true"
                  >
                    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
                    <circle cx="12" cy="9.5" r="2.5" />
                  </svg>
                  {city}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[.75rem] font-semibold uppercase tracking-[.12em] text-white">
              Visit us on
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-[.9rem] transition-colors duration-200 hover:text-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="flex-none text-[#5fe0c9]"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              Instagram · {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>

        <p className="mt-10 border-t border-white/[.08] pt-5 text-[.8rem] leading-[1.55] sm:text-[.82rem]">
          This is a free business research &amp; education resource for clinic
          owners. Please do not share any patient or confidential clinical
          information. © {new Date().getFullYear()} Grow Medico.
        </p>
      </Reveal>
    </footer>
  );
}

import Image from "next/image";
import { BTN, BTN_PRIMARY } from "./shared";
import { OpenFormButton } from "./OpenFormButton";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(243,247,245,.92)] shadow-[0_1px_3px_rgba(7,43,48,.06)] backdrop-blur-[12px] backdrop-saturate-[180%] motion-safe:animate-[drop-in_.6s_cubic-bezier(.16,.84,.44,1)_both]">
      <div className="relative z-[1] mx-auto flex h-[58px] w-full max-w-[1160px] items-center justify-between px-4 sm:h-[68px] sm:px-6">
        <a
          className="flex items-center transition-transform duration-200 hover:scale-[1.03]"
          href="#top"
          aria-label="Grow Medico home"
        >
          <Image
            src="/navlogo.png"
            alt="Grow Medico"
            width={160}
            height={80}
            priority
            className="h-9 w-auto object-contain sm:h-11"
          />
        </a>
        <OpenFormButton
          className={`${BTN} ${BTN_PRIMARY} !px-4 !py-[9px] !text-[13px] sm:!px-5 sm:!py-[11px] sm:!text-[14px]`}
        >
          <span className="sm:hidden">Free template</span>
          <span className="hidden sm:inline">Get the free template</span>
        </OpenFormButton>
      </div>
    </nav>
  );
}

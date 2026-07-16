"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CONFIG } from "./config";
import { BTN, BTN_BLOCK, BTN_LG, BTN_PRIMARY, BTN_WA } from "./shared";

export function ThankYou() {
  useEffect(() => {
    // Fire the Meta Pixel conversion event if the pixel is loaded.
    const w = window as unknown as { fbq?: (...args: unknown[]) => void };
    if (w.fbq) {
      w.fbq("track", "SubmitApplication");
    }
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-4 py-10">
      <div className="w-full max-w-[560px] rounded-[22px] border border-[var(--line)] bg-white p-6 text-center shadow-[0_34px_70px_-30px_rgba(10,35,40,.4)] motion-safe:animate-[pop-in_.45s_cubic-bezier(.16,.84,.44,1)_both] sm:p-10">
        <Link href="/" aria-label="Grow Medico home" className="inline-flex">
          <Image
            src="https://res.cloudinary.com/duq66ybkd/image/upload/v1784177234/navlogo_ywntk5.png"
            alt="Grow Medico"
            width={160}
            height={80}
            priority
            unoptimized
            className="mx-auto h-10 w-auto object-contain"
          />
        </Link>

        <div className="mx-auto mb-[22px] mt-8 grid h-[78px] w-[78px] place-items-center rounded-full border-2 border-[var(--brand)] bg-[var(--brand-050)]">
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            className="text-[var(--brand-600)]"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="mb-[10px] font-[family-name:var(--font-bricolage)] text-[clamp(1.6rem,6vw,2rem)] font-extrabold text-[var(--ink)]">
          Thank you! 🎉
        </h1>
        <p className="mx-auto mb-[26px] max-w-[42ch] text-[var(--muted)]">
          Your responses have been recorded. Download your Clinic Business Model
          Canvas below and join the community to get your doubts cleared.
        </p>

        <div className="mx-auto flex max-w-[380px] flex-col gap-3">
          <a
            href={CONFIG.pdfUrl}
            download
            className={`${BTN} ${BTN_PRIMARY} ${BTN_LG} ${BTN_BLOCK}`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
            </svg>
            Download BMC Starter Template (PDF)
          </a>
          <a
            href={CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN} ${BTN_WA} ${BTN_LG} ${BTN_BLOCK}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.1.2.7 1.1 1.5 1.7 1 .9 1.9 1.2 2.1 1.3.2.1.4.1.5-.1.1-.2.6-.7.8-.9.1-.2.3-.2.5-.1.2.1 1.4.7 1.6.8.2.1.4.2.4.3.1.1.1.5-.1 1Z" />
            </svg>
            Join the WhatsApp community
          </a>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-[.85rem] text-[var(--muted)] underline underline-offset-2 hover:text-[var(--ink)]"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
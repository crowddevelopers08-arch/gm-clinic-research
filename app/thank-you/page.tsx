import type { Metadata } from "next";
import { ThankYou } from "@/components/landing/ThankYou";

export const metadata: Metadata = {
  title: "Thank You | Grow Medico",
  description:
    "Your responses have been recorded. Download your Clinic Business Model Canvas and join the community.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return <ThankYou />;
}

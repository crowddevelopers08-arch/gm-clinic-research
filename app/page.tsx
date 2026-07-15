import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { Footer } from "@/components/landing/Footer";
import { LeadFormModal } from "@/components/landing/LeadFormModal";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <Footer />
      <LeadFormModal />
    </>
  );
}

import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import HowSection from "@/components/sections/HowSection";
import TrustSection from "@/components/sections/TrustSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ContactSection from "@/components/sections/ContactSection";
import MapSection from "@/components/sections/MapSection";
import ScrollReveal from "@/components/ui/ScrollReveal";

const ConfirmationHandler = dynamic(
  () => import("@/components/sections/ConfirmationHandler"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <ConfirmationHandler />
      <Navbar />
      <main>
        <ScrollReveal>
          <HeroSection />
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <ServicesSection />
        </ScrollReveal>
        <ScrollReveal delay={120}>
          <AboutSection />
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <HowSection />
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <TrustSection />
        </ScrollReveal>
        <ScrollReveal delay={220}>
          <ReviewsSection />
        </ScrollReveal>
        <ScrollReveal delay={240}>
          <ContactSection />
        </ScrollReveal>
        <ScrollReveal delay={280}>
          <MapSection />
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}

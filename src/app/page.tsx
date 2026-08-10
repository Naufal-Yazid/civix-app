import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EcosystemSection from "@/components/EcosystemSection";
import ValiditySection from "@/components/ValiditySection"; // <-- Import baru
import LevelsSection from "@/components/LevelsSection";
import HowItWorks from "@/components/HowItWorks";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <EcosystemSection />
      <ValiditySection /> {/* <-- Ditambahkan di sini */}
      <LevelsSection />
      <HowItWorks />
      <CtaBanner />
      <Footer />
    </main>
  );
}

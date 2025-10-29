import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import CoursesSection from "@/components/sections/CoursesSection";
import ResearchSection from "@/components/sections/ResearchSection";
import CampusLifeSection from "@/components/sections/CampusLifeSection";
import PlacementsSection from "@/components/sections/PlacementsSection";
import ChatBot from "@/components/ai/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <CoursesSection />
        <ResearchSection />
        <PlacementsSection />
        <CampusLifeSection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;

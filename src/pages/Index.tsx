import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import BranchesSection from "@/components/sections/BranchesSection";
import CoursesSection from "@/components/sections/CoursesSection";
import ResearchSection from "@/components/sections/ResearchSection";
import ChatBot from "@/components/ai/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <BranchesSection />
        <CoursesSection />
        <ResearchSection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;

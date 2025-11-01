import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CampusLifeSection from "@/components/sections/CampusLifeSection";
import ChatBot from "@/components/ai/ChatBot";

const CampusLife = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CampusLifeSection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default CampusLife;

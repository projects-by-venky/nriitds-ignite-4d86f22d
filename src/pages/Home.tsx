import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ChatBot from "@/components/ai/ChatBot";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Home;

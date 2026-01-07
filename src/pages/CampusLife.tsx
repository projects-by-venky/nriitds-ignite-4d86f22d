import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CampusLifeSection from "@/components/sections/CampusLifeSection";

const CampusLife = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CampusLifeSection />
      </main>
      <Footer />
    </div>
  );
};

export default CampusLife;

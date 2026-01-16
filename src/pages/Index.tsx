import { Suspense, lazy } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Lazy load sections to prevent blocking
const HeroSection = lazy(() => import("@/components/sections/HeroSection"));
const BranchesSection = lazy(() => import("@/components/sections/BranchesSection"));
const CoursesSection = lazy(() => import("@/components/sections/CoursesSection"));
const ResearchSection = lazy(() => import("@/components/sections/ResearchSection"));

// Loading fallback
const SectionLoading = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  console.log("Index component rendering");
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Suspense fallback={<SectionLoading />}>
          <HeroSection />
        </Suspense>
        <Suspense fallback={<SectionLoading />}>
          <BranchesSection />
        </Suspense>
        <Suspense fallback={<SectionLoading />}>
          <CoursesSection />
        </Suspense>
        <Suspense fallback={<SectionLoading />}>
          <ResearchSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

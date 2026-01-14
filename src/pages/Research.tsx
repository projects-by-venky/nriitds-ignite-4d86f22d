import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ResearchHero from '@/components/research/ResearchHero';
import CategoryTabs from '@/components/research/CategoryTabs';
import ResearchGrid from '@/components/research/ResearchGrid';
import UploadButton from '@/components/research/UploadButton';
import { ContributorType } from '@/types/research';

const Research = () => {
  const [activeTab, setActiveTab] = useState<ContributorType | 'all'>('all');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ResearchHero />
        
        <section className="py-16 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-[100px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Upload Button */}
            <UploadButton />
            
            {/* Category Tabs */}
            <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            {/* Research Grid */}
            <ResearchGrid activeTab={activeTab} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Research;

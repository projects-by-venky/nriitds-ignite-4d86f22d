import { motion } from 'framer-motion';
import { GraduationCap, UserCircle, Users } from 'lucide-react';
import { ContributorType } from '@/types/research';

interface CategoryTabsProps {
  activeTab: ContributorType | 'all';
  onTabChange: (tab: ContributorType | 'all') => void;
}

const CategoryTabs = ({ activeTab, onTabChange }: CategoryTabsProps) => {
  const tabs = [
    { id: 'all' as const, label: 'All', icon: Users },
    { id: 'student' as const, label: 'Students', icon: GraduationCap },
    { id: 'faculty' as const, label: 'Faculty', icon: UserCircle },
  ];

  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-2 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? 'text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;

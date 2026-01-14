import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, Inbox } from 'lucide-react';
import ResearchCard from './ResearchCard';
import { ResearchProject, ContributorType } from '@/types/research';
import { useResearchProjects } from '@/hooks/useResearchProjects';

interface ResearchGridProps {
  activeTab: ContributorType | 'all';
}

const ResearchGrid = ({ activeTab }: ResearchGridProps) => {
  const contributorType = activeTab === 'all' ? undefined : activeTab;
  const { data: projects, isLoading, error } = useResearchProjects(contributorType);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-destructive" />
        </div>
        <p className="text-destructive font-medium">Failed to load projects</p>
        <p className="text-muted-foreground text-sm">Please try again later</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
          <Inbox className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold mb-2">No Projects Yet</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {activeTab === 'all' 
            ? "Be the first to showcase your research or project!"
            : `No ${activeTab} submissions yet. Be the first to contribute!`
          }
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((project, index) => (
          <ResearchCard key={project.id} project={project} index={index} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default ResearchGrid;

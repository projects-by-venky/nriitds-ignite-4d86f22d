import { Button } from "@/components/ui/button";
import { LayoutGrid, Calendar } from "lucide-react";
import { motion } from "framer-motion";

type ViewType = 'card' | 'calendar';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border/50"
    >
      <Button
        variant={currentView === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('card')}
        className={`gap-2 transition-all ${
          currentView === 'card' 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : 'hover:bg-muted'
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Card View</span>
      </Button>
      
      <Button
        variant={currentView === 'calendar' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('calendar')}
        className={`gap-2 transition-all ${
          currentView === 'calendar' 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : 'hover:bg-muted'
        }`}
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">Calendar View</span>
      </Button>
    </motion.div>
  );
};

export default ViewToggle;

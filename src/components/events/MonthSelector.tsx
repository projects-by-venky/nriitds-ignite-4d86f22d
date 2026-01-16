import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { motion } from "framer-motion";

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

const MonthSelector = ({ selectedMonth, onMonthChange }: MonthSelectorProps) => {
  const goToPreviousMonth = () => {
    onMonthChange(subMonths(selectedMonth, 1));
  };

  const goToNextMonth = () => {
    onMonthChange(addMonths(selectedMonth, 1));
  };

  const goToCurrentMonth = () => {
    onMonthChange(new Date());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousMonth}
        className="h-9 w-9 border-border/50 hover:border-primary/50 hover:bg-primary/10"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        onClick={goToCurrentMonth}
        className="min-w-[180px] border-border/50 hover:border-primary/50 hover:bg-primary/10"
      >
        <CalendarDays className="mr-2 h-4 w-4" />
        {format(selectedMonth, 'MMMM yyyy')}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={goToNextMonth}
        className="h-9 w-9 border-border/50 hover:border-primary/50 hover:bg-primary/10"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default MonthSelector;

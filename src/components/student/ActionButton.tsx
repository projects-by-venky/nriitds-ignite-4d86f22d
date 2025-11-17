import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export const ActionButton = ({ 
  label, 
  onClick, 
  icon: Icon, 
  variant = "secondary",
  fullWidth = false 
}: ActionButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        ${fullWidth ? 'w-full' : 'flex-1 min-w-[200px]'}
        ${variant === 'primary' 
          ? 'bg-gradient-cyber text-white shadow-[0_0_20px_hsl(217_91%_60%_/_0.4)] hover:shadow-[0_0_30px_hsl(217_91%_60%_/_0.6)]' 
          : 'bg-card border-2 border-[#1E3A8A] hover:border-[#1E3A8A] text-foreground hover:bg-primary/5'
        }
        px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </motion.button>
  );
};

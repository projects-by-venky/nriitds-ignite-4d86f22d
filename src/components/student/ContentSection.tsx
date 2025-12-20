import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ContentSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  delay?: number;
}

export const ContentSection = ({ title, icon, children, delay = 0 }: ContentSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-card/50 backdrop-blur-sm border-2 border-[#1E3A8A] rounded-2xl p-6 hover:border-[#1E3A8A] transition-all duration-300 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && <div className="text-primary">{icon}</div>}
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="w-full">
        {children}
      </div>
    </motion.div>
  );
};

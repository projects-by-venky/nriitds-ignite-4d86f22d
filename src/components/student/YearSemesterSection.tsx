import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ActionButton } from "./ActionButton";

interface SemesterItem {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
}

interface YearData {
  year: string;
  semesters: {
    semester: string;
    items: SemesterItem[];
  }[];
}

interface YearSemesterSectionProps {
  years: YearData[];
  deptId?: string;
}

export const YearSemesterSection = ({ years }: YearSemesterSectionProps) => {
  const [expandedYear, setExpandedYear] = useState<string | null>(null);
  const [expandedSemester, setExpandedSemester] = useState<string | null>(null);

  const toggleYear = (year: string) => {
    if (expandedYear === year) {
      setExpandedYear(null);
      setExpandedSemester(null);
    } else {
      setExpandedYear(year);
      setExpandedSemester(null);
    }
  };

  const toggleSemester = (semester: string) => {
    setExpandedSemester(expandedSemester === semester ? null : semester);
  };

  return (
    <div className="space-y-3">
      {years.map((yearData) => (
        <div key={yearData.year} className="border border-border/30 rounded-xl overflow-hidden">
          <motion.button
            onClick={() => toggleYear(yearData.year)}
            className="w-full flex items-center justify-between p-4 bg-card/30 hover:bg-card/50 transition-colors"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            <span className="text-lg font-semibold text-foreground">{yearData.year}</span>
            {expandedYear === yearData.year ? (
              <ChevronDown className="w-5 h-5 text-primary" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </motion.button>

          <AnimatePresence>
            {expandedYear === yearData.year && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-3 space-y-2 bg-background/30">
                  {yearData.semesters.map((semData) => (
                    <div key={semData.semester} className="border border-border/20 rounded-lg overflow-hidden">
                      <motion.button
                        onClick={() => toggleSemester(semData.semester)}
                        className="w-full flex items-center justify-between p-3 bg-card/20 hover:bg-card/40 transition-colors"
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                      >
                        <span className="text-md font-medium text-foreground/90">{semData.semester}</span>
                        {expandedSemester === semData.semester ? (
                          <ChevronDown className="w-4 h-4 text-primary" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </motion.button>

                      <AnimatePresence>
                        {expandedSemester === semData.semester && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 flex flex-wrap gap-2 bg-background/20">
                              {semData.items.map((item, idx) => (
                                item.href ? (
                                  <a key={idx} href={item.href} download className="flex-1 min-w-[200px]">
                                    <ActionButton 
                                      label={item.label} 
                                      variant={item.variant || "secondary"}
                                      fullWidth
                                    />
                                  </a>
                                ) : (
                                  <ActionButton 
                                    key={idx}
                                    label={item.label} 
                                    onClick={item.onClick}
                                    variant={item.variant || "secondary"}
                                  />
                                )
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

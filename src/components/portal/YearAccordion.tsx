import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PortalButton } from "./PortalButton";

interface SemesterItem {
  label: string;
  onClick?: () => void;
  href?: string;
  to?: string;
  variant?: "primary" | "secondary";
  download?: boolean;
}

interface SemesterData {
  semester: string;
  items: SemesterItem[];
}

interface YearData {
  year: string;
  semesters: SemesterData[];
}

interface YearAccordionProps {
  years: YearData[];
}

export const YearAccordion = ({ years }: YearAccordionProps) => {
  const [expandedYear, setExpandedYear] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {years.map((yearData) => (
        <div key={yearData.year} className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedYear(expandedYear === yearData.year ? null : yearData.year)}
            className="w-full px-4 py-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium text-sm text-foreground">{yearData.year}</span>
            {expandedYear === yearData.year ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          {expandedYear === yearData.year && (
            <div className="p-4 space-y-4 bg-background">
              {yearData.semesters.map((sem) => (
                <div key={sem.semester}>
                  <h5 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                    {sem.semester}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {sem.items.map((item, idx) => (
                      <PortalButton 
                        key={idx} 
                        label={item.label} 
                        onClick={item.onClick}
                        href={item.href}
                        to={item.to}
                        variant={item.variant || "secondary"}
                        download={item.download}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

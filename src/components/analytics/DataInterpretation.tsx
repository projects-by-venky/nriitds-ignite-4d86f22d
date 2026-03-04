import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface DataInterpretationProps {
  type: "attendance" | "results";
  data: Record<string, number>;
}

const MONTHS_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generateInterpretation(type: string, data: Record<string, number>): string {
  const months = MONTHS_ORDER.filter(m => data[m] !== undefined);
  if (months.length === 0) return "No data available yet.";

  const values = months.map(m => data[m]);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const maxMonth = months[values.indexOf(max)];
  const minMonth = months[values.indexOf(min)];
  const isImproving = values.length >= 2 && values[values.length - 1] > values[values.length - 2];
  const isDeclining = values.length >= 2 && values[values.length - 1] < values[values.length - 2];

  const label = type === "attendance" ? "attendance" : "performance";

  let text = "";

  if (avg >= 85) {
    text = `Outstanding ${label}! Your average of ${avg}${type === "attendance" ? "%" : " marks"} shows excellent consistency. `;
  } else if (avg >= 70) {
    text = `Good ${label} overall with an average of ${avg}${type === "attendance" ? "%" : " marks"}. `;
  } else {
    text = `Your ${label} needs attention — average is ${avg}${type === "attendance" ? "%" : " marks"}. `;
  }

  if (months.length > 1) {
    text += `Your best month was ${maxMonth} (${max}${type === "attendance" ? "%" : ""}) and the lowest was ${minMonth} (${min}${type === "attendance" ? "%" : ""}). `;
  }

  if (isImproving) {
    text += "Great news — your recent trend shows improvement! Keep up the momentum.";
  } else if (isDeclining) {
    text += "There's a slight dip recently. Consider reviewing your study habits to get back on track.";
  } else {
    text += "Your performance has been stable — aim to push it even higher!";
  }

  return text;
}

const DataInterpretation = ({ type, data }: DataInterpretationProps) => {
  const interpretation = generateInterpretation(type, data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-5 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              {type === "attendance" ? "Attendance" : "Results"} Insight
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{interpretation}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DataInterpretation;

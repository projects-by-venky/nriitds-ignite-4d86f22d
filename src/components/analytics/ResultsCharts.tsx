import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ComposedChart, Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResultsChartsProps {
  data: Record<string, number>;
}

const MONTHS_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getPerformanceBadge = (avg: number) => {
  if (avg >= 85) return { label: "Excellent", variant: "default" as const, color: "hsl(142, 76%, 36%)" };
  if (avg >= 70) return { label: "Good", variant: "secondary" as const, color: "hsl(217, 91%, 60%)" };
  return { label: "Needs Improvement", variant: "destructive" as const, color: "hsl(0, 84%, 60%)" };
};

const getBarColor = (value: number) => {
  if (value >= 85) return "hsl(142, 76%, 36%)";
  if (value >= 70) return "hsl(217, 91%, 60%)";
  return "hsl(0, 84%, 60%)";
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-sm font-medium" style={{ color: getBarColor(value) }}>{value} marks</p>
    </div>
  );
};

const ResultsCharts = ({ data }: ResultsChartsProps) => {
  const chartData = MONTHS_ORDER
    .filter(m => data[m] !== undefined)
    .map(m => ({ month: m, score: data[m] }));

  if (chartData.length === 0) return null;

  const avg = Math.round(chartData.reduce((s, d) => s + d.score, 0) / chartData.length);
  const badge = getPerformanceBadge(avg);
  const trend = chartData.length >= 2 ? chartData[chartData.length - 1].score - chartData[chartData.length - 2].score : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-l-4" style={{ borderLeftColor: badge.color }}>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Performance</p>
              <p className="text-3xl font-bold text-foreground">{avg}</p>
              <p className="text-sm text-muted-foreground">
                Average Score · {trend > 0 ? `↑ ${trend} from last month` : trend < 0 ? `↓ ${Math.abs(trend)} from last month` : "Stable"}
              </p>
            </div>
            <Badge variant={badge.variant} className="text-sm px-4 py-1.5">
              {badge.label}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-foreground">Monthly Scores</CardTitle>
            <p className="text-xs text-muted-foreground">Marks scored each month</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={getBarColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Line */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-foreground">Performance Trend</CardTitle>
            <p className="text-xs text-muted-foreground">Score progression over months</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="score" fill="hsl(217, 91%, 60%, 0.1)" stroke="none" />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "hsl(217, 91%, 60%)", strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ResultsCharts;

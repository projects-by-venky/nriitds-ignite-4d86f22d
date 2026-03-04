import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceChartsProps {
  data: Record<string, number>;
}

const MONTHS_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getColor = (value: number) => {
  if (value >= 90) return "hsl(142, 76%, 36%)";
  if (value >= 75) return "hsl(217, 91%, 60%)";
  return "hsl(0, 84%, 60%)";
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const interpretation = value >= 90 ? "Excellent attendance!" : value >= 75 ? "Good, keep it up!" : "Needs improvement";
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-sm" style={{ color: getColor(value) }}>{value}%</p>
      <p className="text-xs text-muted-foreground mt-1">{interpretation}</p>
    </div>
  );
};

const AttendanceCharts = ({ data }: AttendanceChartsProps) => {
  const chartData = MONTHS_ORDER
    .filter(m => data[m] !== undefined)
    .map(m => ({ month: m, attendance: data[m] }));

  if (chartData.length === 0) return null;

  const currentMonth = chartData[chartData.length - 1];
  const currentPercent = currentMonth.attendance;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (currentPercent / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-foreground">Attendance Trend</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly attendance percentage over time</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "hsl(217, 91%, 60%)", strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Circular Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-foreground">Current Month</CardTitle>
            <p className="text-xs text-muted-foreground">{currentMonth.month} attendance</p>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <svg width="130" height="130" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke={getColor(currentPercent)}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{currentPercent}%</span>
                <span className="text-xs text-muted-foreground">Attendance</span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Monthly Comparison</CardTitle>
          <p className="text-xs text-muted-foreground">Attendance percentage by month — bars are color-coded by performance</p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="attendance" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={getColor(entry.attendance)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AttendanceCharts;

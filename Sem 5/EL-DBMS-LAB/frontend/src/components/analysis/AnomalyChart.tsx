import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
  Scatter,
} from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";
import type { AnalysisResult, AnomalyPoint } from "@/types";

interface AnomalyChartProps {
  result: AnalysisResult;
}

interface ChartDataPoint {
  timestamp: string;
  displayTime: string;
  value: number;
  predicted: number;
  upper: number;
  lower: number;
  anomaly: boolean;
  anomalyValue: number | null;
}

export function AnomalyChart({ result }: AnomalyChartProps) {
  const { points, summary } = result;

  // Transform data for the chart
  const chartData: ChartDataPoint[] = useMemo(() => {
    return points.map((point: AnomalyPoint) => {
      const date = new Date(point.timestamp);
      return {
        timestamp: point.timestamp,
        displayTime: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        value: point.value,
        predicted: point.predicted,
        upper: point.upper,
        lower: point.lower,
        anomaly: point.anomaly,
        anomalyValue: point.anomaly ? point.value : null,
      };
    });
  }, [points]);

  // Calculate chart bounds
  const { minValue, maxValue } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    chartData.forEach((d) => {
      min = Math.min(min, d.value, d.lower, d.predicted);
      max = Math.max(max, d.value, d.upper, d.predicted);
    });

    // Add some padding
    const padding = (max - min) * 0.1;
    return {
      minValue: Math.floor(min - padding),
      maxValue: Math.ceil(max + padding),
    };
  }, [chartData]);

  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: ChartDataPoint;
    }>;
  }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const date = new Date(data.timestamp);

    return (
      <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-4 min-w-[200px]">
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-sm font-medium">
              {date.toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            {data.anomaly && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-500/20 text-red-500">
                Anomaly
              </span>
            )}
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actual:</span>
              <span className="font-mono font-medium">
                {data.value.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Predicted:</span>
              <span className="font-mono text-blue-500">
                {data.predicted.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bounds:</span>
              <span className="font-mono text-muted-foreground">
                {data.lower.toFixed(0)} - {data.upper.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Downsample data for performance if too many points
  const displayData = useMemo(() => {
    if (chartData.length <= 500) return chartData;

    const step = Math.ceil(chartData.length / 500);
    const sampled: ChartDataPoint[] = [];

    for (let i = 0; i < chartData.length; i += step) {
      sampled.push(chartData[i]);
    }

    // Always include anomaly points
    chartData.forEach((point) => {
      if (point.anomaly && !sampled.includes(point)) {
        sampled.push(point);
      }
    });

    // Sort by timestamp
    sampled.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    return sampled;
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChartIcon className="h-5 w-5" />
          Traffic Analysis Chart
        </CardTitle>
        <CardDescription>
          Time-series visualization of network traffic with anomaly detection •{" "}
          {summary.total_points.toLocaleString()} data points analyzed
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-6 mb-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary" />
            <span className="text-sm text-muted-foreground">
              Actual Traffic
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-0.5 bg-blue-500 opacity-70"
              style={{ borderStyle: "dashed" }}
            />
            <span className="text-sm text-muted-foreground">Predicted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-blue-500/20 rounded" />
            <span className="text-sm text-muted-foreground">
              Confidence Band
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-muted-foreground">Anomaly</span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={displayData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient
                  id="confidenceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="rgb(59, 130, 246)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="rgb(59, 130, 246)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />

              <XAxis
                dataKey="displayTime"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                interval="preserveStartEnd"
                minTickGap={50}
              />

              <YAxis
                domain={[minValue, maxValue]}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value) =>
                  value >= 1000
                    ? `${(value / 1000).toFixed(1)}k`
                    : value.toString()
                }
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Confidence band (upper bound) */}
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="url(#confidenceGradient)"
                fillOpacity={1}
              />

              {/* Confidence band (lower bound) - creates the band effect */}
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="hsl(var(--background))"
                fillOpacity={1}
              />

              {/* Lower bound line */}
              <Line
                type="monotone"
                dataKey="lower"
                stroke="rgb(59, 130, 246)"
                strokeWidth={1}
                strokeOpacity={0.3}
                dot={false}
                strokeDasharray="3 3"
              />

              {/* Upper bound line */}
              <Line
                type="monotone"
                dataKey="upper"
                stroke="rgb(59, 130, 246)"
                strokeWidth={1}
                strokeOpacity={0.3}
                dot={false}
                strokeDasharray="3 3"
              />

              {/* Predicted line */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="rgb(100, 100, 100)"
                strokeWidth={2}
                strokeOpacity={0.7}
                dot={false}
                strokeDasharray="5 5"
              />

              {/* Actual value line */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />

              {/* Anomaly points */}
              <Scatter
                dataKey="anomalyValue"
                fill="rgb(239, 68, 68)"
                stroke="rgb(220, 38, 38)"
                strokeWidth={2}
                shape={(props: unknown) => {
                  const { cx, cy } = props as { cx: number; cy: number };
                  if (!cy || isNaN(cy)) return <g />;
                  return (
                    <g>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={8}
                        fill="rgb(255, 255, 255)"
                        fillOpacity={0.4}
                      />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill="rgb(239, 68, 68)"
                        stroke="white"
                        strokeWidth={1.5}
                      />
                    </g>
                  );
                }}
              />

              {/* Zero reference line */}
              <ReferenceLine
                y={0}
                stroke="hsl(var(--border))"
                strokeOpacity={0.5}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Footer */}
        <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
          <span>
            Time range:{" "}
            {new Date(points[0]?.timestamp || "").toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(
              points[points.length - 1]?.timestamp || "",
            ).toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span>
            {displayData.length < chartData.length
              ? `Showing ${displayData.length} of ${chartData.length} points (sampled)`
              : `${chartData.length} points`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default AnomalyChart;

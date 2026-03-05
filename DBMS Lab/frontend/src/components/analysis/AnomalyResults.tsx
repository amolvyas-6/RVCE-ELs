import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  CheckCircle2,
  Activity,
  TrendingUp,
  TrendingDown,
  Percent,
  Hash,
} from "lucide-react";
import type { AnalysisResult, AnomalyPoint } from "@/types";

interface AnomalyResultsProps {
  result: AnalysisResult;
}

export function AnomalyResults({ result }: AnomalyResultsProps) {
  const { summary, points } = result;

  // Get only anomaly points for the table
  const anomalyPoints = points.filter((p) => p.anomaly);

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Calculate deviation from predicted
  const getDeviation = (point: AnomalyPoint) => {
    const deviation = ((point.value - point.predicted) / point.predicted) * 100;
    return deviation;
  };

  // Determine if value is above or below bounds
  const getDeviationStatus = (point: AnomalyPoint) => {
    if (point.value > point.upper) return "above";
    if (point.value < point.lower) return "below";
    return "normal";
  };

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Analysis Summary
          </CardTitle>
          <CardDescription>
            Overview of the anomaly detection results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Alert based on anomaly detection */}
          {summary.anomaly_detected ? (
            <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <AlertTitle className="text-amber-700 dark:text-amber-400">
                Anomalies Detected
              </AlertTitle>
              <AlertDescription className="text-amber-600 dark:text-amber-300">
                {summary.anomalies} anomalous data points were detected in the
                network traffic data. Review the details below for more
                information.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-6 border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-green-700 dark:text-green-400">
                No Anomalies Detected
              </AlertTitle>
              <AlertDescription className="text-green-600 dark:text-green-300">
                The network traffic appears to be normal. No suspicious patterns
                were identified.
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span className="text-sm">Total Points</span>
              </div>
              <p className="text-2xl font-bold">
                {summary.total_points.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Anomalies</span>
              </div>
              <p className="text-2xl font-bold text-amber-500">
                {summary.anomalies.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Percent className="h-4 w-4" />
                <span className="text-sm">Anomaly Ratio</span>
              </div>
              <p className="text-2xl font-bold">
                {(summary.anomaly_ratio * 100).toFixed(2)}%
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span className="text-sm">Confidence</span>
              </div>
              <p className="text-2xl font-bold">{summary.confidence_level}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Points Table */}
      {anomalyPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Anomaly Details
            </CardTitle>
            <CardDescription>
              Detailed breakdown of all detected anomalies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto max-h-[500px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted/95 backdrop-blur-sm z-10">
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Actual Value</TableHead>
                      <TableHead className="text-right">Predicted</TableHead>
                      <TableHead className="text-right">Lower Bound</TableHead>
                      <TableHead className="text-right">Upper Bound</TableHead>
                      <TableHead className="text-right">Deviation</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {anomalyPoints.map((point, index) => {
                      const deviation = getDeviation(point);
                      const status = getDeviationStatus(point);

                      return (
                        <TableRow key={index} className="hover:bg-muted/50">
                          <TableCell className="text-center text-muted-foreground font-mono text-sm">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatTimestamp(point.timestamp)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm font-medium">
                            {point.value.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm text-muted-foreground">
                            {point.predicted.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm text-muted-foreground">
                            {point.lower.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm text-muted-foreground">
                            {point.upper.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {deviation > 0 ? (
                                <TrendingUp className="h-4 w-4 text-red-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-blue-500" />
                              )}
                              <span
                                className={`font-mono text-sm font-medium ${
                                  deviation > 0
                                    ? "text-red-500"
                                    : "text-blue-500"
                                }`}
                              >
                                {deviation > 0 ? "+" : ""}
                                {deviation.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                status === "above" ? "destructive" : "secondary"
                              }
                              className={
                                status === "below"
                                  ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                  : ""
                              }
                            >
                              {status === "above"
                                ? "Above Limit"
                                : "Below Limit"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Showing {anomalyPoints.length} anomalous points •{" "}
              {((anomalyPoints.length / summary.total_points) * 100).toFixed(2)}
              % of total data
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AnomalyResults;

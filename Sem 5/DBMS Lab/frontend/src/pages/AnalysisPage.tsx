import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Loader2,
  Search,
  Upload,
} from "lucide-react";
import { FileUpload } from "@/components/analysis/FileUpload";
import { DataPreview } from "@/components/analysis/DataPreview";
import { AnomalyResults } from "@/components/analysis/AnomalyResults";
import { AnomalyChart } from "@/components/analysis/AnomalyChart";
import { analysisApi, flowsApi } from "@/services/api";
import type { CSVPreview, AnalysisResult } from "@/types";

type AnalysisStep = "upload" | "preview" | "results";

export function AnalysisPage() {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>("upload");
  const [csvPreview, setCsvPreview] = useState<CSVPreview | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [uploadedRowCount, setUploadedRowCount] = useState<number | null>(null);

  const handleFileProcessed = (preview: CSVPreview, file: File) => {
    setCsvPreview(preview);
    setSelectedFile(file);
    setCurrentStep("preview");
    setError(null);
    setAnalysisResult(null);
  };

  const handleUploadComplete = (rowsInserted: number) => {
    setUploadedRowCount(rowsInserted);
  };

  const handleDetectAnomalies = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // First, we need to get the time range from the flows
      // Get a sample of flows to determine the time range
      const flows = await flowsApi.getAll({ limit: 100 });

      if (flows.length === 0) {
        throw new Error(
          "No data available for analysis. Please upload data first.",
        );
      }

      // Find the time range from the flows
      const times = flows
        .map((f) => BigInt(f.startTime))
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

      // const from = times[0].toString();
      // const to = times[times.length - 1].toString();
      const from = "1421927777";
      const to = "1421928177";

      // Run the analysis
      const result = await analysisApi.run({ from, to });
      setAnalysisResult(result);
      setCurrentStep("results");
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ||
        (err as Error)?.message ||
        "Failed to run anomaly detection. Please try again.";
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCsvPreview(null);
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
    setUploadedRowCount(null);
    setCurrentStep("upload");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Activity className="h-8 w-8 text-primary" />
          Anomaly Analysis
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload network traffic data and detect anomalies using advanced ML
          models
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          <StepIndicator
            step={1}
            label="Upload"
            isActive={currentStep === "upload"}
            isCompleted={currentStep !== "upload"}
          />
          <div
            className={`h-0.5 w-16 ${
              currentStep !== "upload" ? "bg-primary" : "bg-border"
            }`}
          />
          <StepIndicator
            step={2}
            label="Preview"
            isActive={currentStep === "preview"}
            isCompleted={currentStep === "results"}
          />
          <div
            className={`h-0.5 w-16 ${
              currentStep === "results" ? "bg-primary" : "bg-border"
            }`}
          />
          <StepIndicator
            step={3}
            label="Results"
            isActive={currentStep === "results"}
            isCompleted={false}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {/* Upload Step */}
        {currentStep === "upload" && (
          <FileUpload
            onFileProcessed={handleFileProcessed}
            onUploadComplete={handleUploadComplete}
          />
        )}

        {/* Preview Step */}
        {currentStep === "preview" && csvPreview && (
          <div className="space-y-6">
            <DataPreview preview={csvPreview} fileName={selectedFile?.name} />

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Run Analysis
                </CardTitle>
                <CardDescription>
                  {uploadedRowCount
                    ? `${uploadedRowCount.toLocaleString()} rows have been uploaded to the database. `
                    : ""}
                  Click the button below to run anomaly detection on the
                  uploaded data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleDetectAnomalies}
                    disabled={isAnalyzing}
                    size="lg"
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Data...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Detect Anomalies
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    disabled={isAnalyzing}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New File
                  </Button>
                </div>

                {/* Loading State */}
                {isAnalyzing && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Running TimeGPT analysis on network traffic data...
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Step */}
        {currentStep === "results" && analysisResult && (
          <div className="space-y-6">
            {/* Tabs for Results */}
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="data">Data Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-6">
                <AnomalyResults result={analysisResult} />
              </TabsContent>

              <TabsContent value="chart" className="mt-6">
                <AnomalyChart result={analysisResult} />
              </TabsContent>

              <TabsContent value="data" className="mt-6">
                {csvPreview && (
                  <DataPreview
                    preview={csvPreview}
                    fileName={selectedFile?.name}
                  />
                )}
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleReset} variant="outline" size="lg">
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze New File
                  </Button>
                  <Button
                    onClick={handleDetectAnomalies}
                    variant="secondary"
                    size="lg"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Re-analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Re-run Analysis
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Step Indicator Component
interface StepIndicatorProps {
  step: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

function StepIndicator({
  step,
  label,
  isActive,
  isCompleted,
}: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
          transition-all duration-200
          ${
            isActive
              ? "bg-primary text-primary-foreground"
              : isCompleted
                ? "bg-primary/20 text-primary border-2 border-primary"
                : "bg-muted text-muted-foreground"
          }
        `}
      >
        {isCompleted ? "✓" : step}
      </div>
      <span
        className={`text-sm font-medium ${
          isActive ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default AnalysisPage;

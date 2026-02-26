// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Health Check
export interface HealthResponse {
  status: "ok" | "error";
  db: "connected" | "disconnected";
}

// Host and Protocol types
export interface Host {
  id: number;
  ip: string;
}

export interface Protocol {
  id: number;
  name: string;
}

export interface Service {
  id: number;
  name: string;
}

// Flow Types
export interface FlowMetrics {
  id: number;
  flowId: number;
  sbytes: number;
  dbytes: number;
  spkts: number;
  dpkts: number;
  sload: number;
  dload: number;
  sjit: number | null;
  djit: number | null;
  tcprtt: number | null;
  synack: number | null;
  ackdat: number | null;
}

export interface AttackLabel {
  id: number;
  flowId: number;
  category: string | null;
  label: number;
}

export interface Flow {
  id: number;
  srcHostId: number;
  dstHostId: number;
  protocolId: number;
  serviceId: number | null;
  srcPort: number;
  dstPort: number;
  state: string;
  startTime: string;
  endTime: string;
  srcHost: Host;
  dstHost: Host;
  protocol: Protocol;
  service: Service | null;
  metrics?: FlowMetrics;
  attackLabel?: AttackLabel;
}

export interface FlowFilters {
  srcIp?: string;
  dstIp?: string;
  protocol?: string;
  limit?: number;
}

// Metrics Timeseries
export interface MetricsTimeseries {
  sbytes: number;
  dbytes: number;
  spkts: number;
  dpkts: number;
  sload: number;
  dload: number;
  flow: {
    startTime: string;
    protocol: {
      name: string;
    };
  };
}

// Ingest Response
export interface IngestResponse {
  status: "success";
  rowsInserted: number;
}

// Analysis Types (FastAPI)
export interface AnomalyPoint {
  timestamp: string;
  value: number;
  predicted: number;
  upper: number;
  lower: number;
  anomaly: boolean;
}

export interface AnalysisSummary {
  anomaly_detected: boolean;
  total_points: number;
  anomalies: number;
  anomaly_ratio: number;
  confidence_level: number;
}

export interface AnalysisResult {
  summary: AnalysisSummary;
  points: AnomalyPoint[];
}

export interface AnalysisRequest {
  from: string;
  to: string;
  srcIp?: string;
}

// CSV Preview Types
export interface CSVPreview {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

// API Error
export interface ApiError {
  error: string;
}

import axios, { AxiosError } from "axios";
import type {
  HealthResponse,
  Flow,
  FlowFilters,
  MetricsTimeseries,
  IngestResponse,
  AnalysisResult,
  AnalysisRequest,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  ApiError,
} from "@/types";

const AUTH_TOKEN_KEY = "authToken";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem(AUTH_TOKEN_KEY);
      // Only redirect if not already on login/register page
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// ============ Auth API ============
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  clearToken: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};

// ============ Health API ============
export const healthApi = {
  check: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>("/health");
    return response.data;
  },
};

// ============ Flows API ============
export const flowsApi = {
  getAll: async (filters?: FlowFilters): Promise<Flow[]> => {
    const params = new URLSearchParams();
    if (filters?.srcIp) params.append("srcIp", filters.srcIp);
    if (filters?.dstIp) params.append("dstIp", filters.dstIp);
    if (filters?.protocol) params.append("protocol", filters.protocol);
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await api.get<Flow[]>(`/flows?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Flow> => {
    const response = await api.get<Flow>(`/flows/${id}`);
    return response.data;
  },

  getMetricsTimeseries: async (
    from: string,
    to: string,
    srcIp?: string,
  ): Promise<MetricsTimeseries[]> => {
    const params = new URLSearchParams({ from, to });
    if (srcIp) params.append("srcIp", srcIp);

    const response = await api.get<MetricsTimeseries[]>(
      `/flows/metrics/timeseries?${params.toString()}`,
    );
    return response.data;
  },
};

// ============ Ingest API ============
export const ingestApi = {
  uploadCSV: async (
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<IngestResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<IngestResponse>("/ingest/csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(progress);
        }
      },
    });
    return response.data;
  },
};

// ============ Analysis API ============
export const analysisApi = {
  run: async (request: AnalysisRequest): Promise<AnalysisResult> => {
    const response = await api.post<AnalysisResult>("/analysis/run", request);
    return response.data;
  },
};

export default api;

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class AnalysisRequest(BaseModel):
    from_ts: str
    to_ts: str
    srcIp: Optional[str] = None


# -----------------------------
# Individual time-series point
# -----------------------------
class AnomalyPoint(BaseModel):
    timestamp: datetime     # corresponds to `ds`
    value: float            # actual observed value (y)
    predicted: float        # TimeGPT prediction
    upper: float            # TimeGPT upper confidence bound
    lower: float            # TimeGPT lower confidence bound
    anomaly: bool           # anomaly flag


# -----------------------------
# Summary / metadata
# -----------------------------
class AnalysisSummary(BaseModel):
    anomaly_detected: bool
    total_points: int
    anomalies: int
    anomaly_ratio: float
    confidence_level: float


# -----------------------------
# Final API response
# -----------------------------
class AnalysisResult(BaseModel):
    summary: AnalysisSummary
    points: List[AnomalyPoint]

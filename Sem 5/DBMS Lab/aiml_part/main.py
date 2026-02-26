import os

import httpx
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from nixtla import NixtlaClient

from schemas import AnalysisRequest, AnalysisResult, AnalysisSummary, AnomalyPoint

load_dotenv()
EXPRESS_BASE_URL = os.getenv("EXPRESS_BASE_URL")
NIXTLA_API_KEY = os.environ.get("NIXTLA_API_KEY")
CONFIDENCE_LEVEL = 85

app = FastAPI()

# Initialize Nixtla client once
nixtla_client = NixtlaClient(api_key=NIXTLA_API_KEY)


@app.post("/analyze", response_model=AnalysisResult)
async def analyze(req: AnalysisRequest):
    # 1️⃣ Fetch historical data from Express
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{EXPRESS_BASE_URL}/flows/metrics/timeseries",
            params={
                "from": req.from_ts,
                "to": req.to_ts,
                "srcIp": req.srcIp,
            },
        )

    if resp.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch metrics from backend",
        )

    raw = resp.json()

    # Build raw dataframe
    df = pd.DataFrame(
        [
            {
                "unique_id": "traffic",
                "ds": pd.to_datetime(int(r["flow"]["startTime"]), unit="s"),
                "y": r["sbytes"],
            }
            for r in raw
        ]
    )

    # Aggregate duplicates (multiple events in same second)
    # df = df.groupby(["unique_id", "ds"], as_index=False).agg({"y": "sum"})

    # Floor timestamps to minute
    df["ds"] = df["ds"].dt.floor("1S")

    # Aggregate per minute
    df = df.groupby(["unique_id", "ds"], as_index=False).agg({"y": "sum"})
    # Build a strict continuous time index
    FREQ = "1S"
    full_range = pd.date_range(
        start=df["ds"].min(), end=df["ds"].max(), freq=FREQ, name="ds"
    )

    # Reindex to guarantee NO missing timestamps
    df = df.set_index("ds").reindex(full_range).reset_index()

    df.rename(columns={"index": "ds"}, inplace=True)
    df["unique_id"] = "traffic"

    # Fill missing values
    df["y"] = df["y"].interpolate(method="linear")

    # Final sort
    df = df.sort_values("ds")

    # Call Nixtla detect_anomalies (STANDARD)
    result = nixtla_client.detect_anomalies(
        df=df,
        freq=FREQ,
        level=CONFIDENCE_LEVEL,
    )

    # Nixtla result already contains 'anomaly'
    required_cols = [
        "ds",
        "y",
        "TimeGPT",
        f"TimeGPT-hi-{CONFIDENCE_LEVEL}",
        f"TimeGPT-lo-{CONFIDENCE_LEVEL}",
        "anomaly",
    ]
    # Ensure all required columns exist
    missing = [c for c in required_cols if c not in result.columns]
    if missing:
        raise ValueError(f"Missing expected columns from Nixtla output: {missing}")
    result_view = result[required_cols].copy()

    points = [
        {
            "timestamp": row["ds"].isoformat(),
            "value": float(row["y"]),
            "predicted": float(row["TimeGPT"]),
            "upper": float(row[f"TimeGPT-hi-{CONFIDENCE_LEVEL}"]),
            "lower": float(row[f"TimeGPT-lo-{CONFIDENCE_LEVEL}"]),
            "anomaly": bool(row["anomaly"]),
        }
        for _, row in result_view.iterrows()
    ]

    anomaly_points = [p for p in points if p["anomaly"]]

    return AnalysisResult(
        summary=AnalysisSummary(
            anomaly_detected=len(anomaly_points) > 0,
            total_points=len(points),
            anomalies=len(anomaly_points),
            anomaly_ratio=round(len(anomaly_points) / len(points), 3),
            confidence_level=CONFIDENCE_LEVEL,
        ),
        points=[
            AnomalyPoint(
                timestamp=p["timestamp"],
                value=p["value"],
                predicted=p["predicted"],
                upper=p["upper"],
                lower=p["lower"],
                anomaly=p["anomaly"],
            )
            for p in points
        ],
    )

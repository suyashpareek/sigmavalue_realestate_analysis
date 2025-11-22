import os
import pandas as pd
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

SAMPLE_EXCEL_PATH = '/mnt/data/Sample_data.xlsx'

def _load_excel(f):
    return pd.read_excel(f, engine='openpyxl')

def _normalize_cols(df):
    df = df.rename(columns=lambda c: c.strip().lower().replace(" ", "_"))
    return df

def _clean_colnames(df):
    df.columns = [c.replace("__", "_") for c in df.columns]
    return df

def _build_summary(area, df):
    if df.empty:
        return f"No records found for {area}"

    summary = []

    if "flat_weighted_average_rate" in df.columns:
        summary.append(f"Avg flat rate: ₹{df['flat_weighted_average_rate'].mean():.0f}")

    if "total_sales_-_igr" in df.columns:
        summary.append(f"Total sales value: ₹{df['total_sales_-_igr'].sum():,}")

    if "total_units" in df.columns:
        summary.append(f"Total units sold: {df['total_units'].sum():,}")

    years = sorted(df["year"].unique())
    summary.append(f"Data years: {years[0]} – {years[-1]}")

    return " | ".join(summary)

def _chart(df):
    charts = {"price_trend": [], "demand_trend": []}

    if "year" in df.columns and "flat_weighted_average_rate" in df.columns:
        charts["price_trend"] = (
            df.groupby("year")["flat_weighted_average_rate"]
            .mean()
            .reset_index()
            .to_dict("records")
        )

    if "year" in df.columns and "total_units" in df.columns:
        charts["demand_trend"] = (
            df.groupby("year")["total_units"]
            .sum()
            .reset_index()
            .to_dict("records")
        )

    return charts

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def analyze_view(request):
    q = request.data.get("query", "").strip()
    file = request.FILES.get("file")

    if not q:
        return Response({"error": "Query missing"}, status=400)

    try:
        df = _load_excel(file) if file else _load_excel(SAMPLE_EXCEL_PATH)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

    df = _normalize_cols(df)
    df = _clean_colnames(df)

    # identify locality column
    locality_keys = ["location", "locality", "area", "region", "place", "final_location"]
    area_cols = [c for c in df.columns if any(k in c for k in locality_keys)]

    area_col = area_cols[0] if area_cols else df.columns[0]
    df[area_col] = df[area_col].astype(str).str.lower()

    filtered = df[df[area_col].str.contains(q.lower(), na=False)]

    summary = _build_summary(q, filtered)
    charts = _chart(filtered)

    return Response({
        "summary": summary,
        "chart": charts,
        "filtered_table": filtered.fillna("").to_dict("records"),
        "meta": {"rows_found": len(filtered)},
    })

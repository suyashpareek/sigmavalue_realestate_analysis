import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ChatUI() {
    const [query, setQuery] = useState("");
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState("");
    const [chart, setChart] = useState({ price_trend: [], demand_trend: [] });
    const [filtered, setFiltered] = useState([]);

    const handleAnalyze = async () => {
        const formData = new FormData();
        formData.append("query", query);
        if (file) formData.append("file", file);

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/analyze/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSummary(res.data.summary || "");
            setChart(res.data.chart || { price_trend: [], demand_trend: [] });
            setFiltered(res.data.filtered_table || []);

            console.log("DEBUG BACKEND RESPONSE:", res.data);

        } catch (err) {
            console.error("ERROR:", err);
            alert("Backend error. Check console.");
        }
    };

    return (
        <div>
            <input
                className="form-control mb-2"
                placeholder="Enter locality…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <input className="form-control mb-2" type="file" onChange={(e) => setFile(e.target.files[0])} />

            <button className="btn btn-primary mb-3" onClick={handleAnalyze}>
                Analyze
            </button>

            {/* Summary */}
            {summary && (
                <div className="alert alert-info">
                    <strong>Summary</strong>
                    <div>{summary}</div>
                </div>
            )}

            {/* PRICE TREND CHART */}
            {chart.price_trend && chart.price_trend.length > 0 && (
                <div className="mb-4">
                    <h5>Price Trend</h5>
                    <Line
                        data={{
                            labels: chart.price_trend.map((d) => d.year),
                            datasets: [
                                {
                                    label: "Avg Price",
                                    data: chart.price_trend.map((d) => d.flat_weighted_average_rate),
                                    borderColor: "blue",
                                    borderWidth: 3,
                                    tension: 0.3,
                                },
                            ],
                        }}
                    />
                </div>
            )}

            {/* DEMAND TREND CHART */}
            {chart.demand_trend && chart.demand_trend.length > 0 && (
                <div className="mb-4">
                    <h5>Demand Trend</h5>
                    <Line
                        data={{
                            labels: chart.demand_trend.map((d) => d.year),
                            datasets: [
                                {
                                    label: "Total Units",
                                    data: chart.demand_trend.map((d) => d.total_units),
                                    borderColor: "green",
                                    borderWidth: 3,
                                    tension: 0.3,
                                },
                            ],
                        }}
                    />
                </div>
            )}

            {/* FILTERED TABLE */}
            {filtered.length > 0 && (
                <div>
                    <h5>Filtered Data</h5>
                    <div>Rows found: {filtered.length}</div>
                    <table className="table table-striped table-bordered mt-2">
                        <thead>
                            <tr>
                                {Object.keys(filtered[0]).map((col) => (
                                    <th key={col}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((row, idx) => (
                                <tr key={idx}>
                                    {Object.values(row).map((v, i) => (
                                        <td key={i}>{v}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

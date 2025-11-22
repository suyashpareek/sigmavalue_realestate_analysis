import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function ResultView({ data }) {
    const { summary, chart, filtered_table, meta } = data;

    const priceTrend = chart.price_trend || [];
    const demandTrend = chart.demand_trend || [];

    const priceData = {
        labels: priceTrend.map((p) => p.year),
        datasets: [
            {
                label: "Price Trend",
                data: priceTrend.map((p) => p.price),
                borderColor: "blue",
            },
        ],
    };

    const demandData = {
        labels: demandTrend.map((p) => p.year),
        datasets: [
            {
                label: "Demand Trend",
                data: demandTrend.map((p) => p.demand),
                borderColor: "green",
            },
        ],
    };

    return (
        <div className="mt-4">
            <div className="card p-3 mb-4">
                <h5>Summary</h5>
                <p style={{ whiteSpace: "pre-wrap" }}>{summary}</p>
            </div>

            {priceTrend.length > 0 && (
                <div className="card p-3 mb-4">
                    <h5>Price Trend</h5>
                    <Line data={priceData} />
                </div>
            )}

            {demandTrend.length > 0 && (
                <div className="card p-3 mb-4">
                    <h5>Demand Trend</h5>
                    <Line data={demandData} />
                </div>
            )}

            <div className="card p-3 mb-3">
                <h5>Filtered Data</h5>
                <small className="text-muted">
                    Rows found: {meta?.rows_found || 0}
                </small>

                <div className="table-responsive mt-3">
                    <table className="table table-sm table-striped">
                        <thead>
                            <tr>
                                {filtered_table.length > 0 &&
                                    Object.keys(filtered_table[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered_table.map((row, i) => (
                                <tr key={i}>
                                    {Object.values(row).map((val, j) => (
                                        <td key={j}>{val ? val.toString() : ""}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

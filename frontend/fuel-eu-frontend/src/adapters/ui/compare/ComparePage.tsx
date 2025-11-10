import { useEffect } from "react";
import { useCompareService } from "../../../core/application/useCompareService";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaChartBar } from "react-icons/fa"; // Icon added

export function ComparePage() {
  const { comparison, loading, loadComparison } = useCompareService();

  useEffect(() => {
    loadComparison();
  }, []);

  return (
    <div className="space-y-10 p-6 bg-gradient-to-b from-[#fef7ee] to-[#fffaf5] min-h-screen">
      <h2 className="text-3xl font-extrabold text-orange-600 mb-6 flex items-center gap-3">
        <FaChartBar className="text-orange-500" /> Compare Routes Against Baseline
      </h2>

      {/* Table Card */}
      <div className="bg-white border border-orange-200 rounded-2xl shadow-lg p-6">
        {loading ? (
          <p className="text-gray-500">Loading comparison...</p>
        ) : comparison.length === 0 ? (
          <p className="text-gray-500">No comparison data found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-orange-100 text-orange-700 uppercase text-xs font-semibold border-b">
                  <th className="p-3">Route ID</th>
                  <th className="p-3">Baseline Intensity</th>
                  <th className="p-3">Actual Intensity</th>
                  <th className="p-3">% Difference</th>
                  <th className="p-3">Compliant</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((c, idx) => (
                  <tr
                    key={c.routeId}
                    className={`border-b hover:bg-orange-50 transition cursor-pointer ${
                      idx % 2 === 0 ? "bg-orange-50/50" : "bg-white"
                    }`}
                  >
                    <td className="p-3 font-medium">{c.routeId}</td>
                    <td className="p-3">{c.baselineIntensity}</td>
                    <td className="p-3">{c.comparisonIntensity}</td>
                    <td className="p-3">{c.percentDiff.toFixed(2)}%</td>
                    <td className="p-3">
                      {c.compliant ? (
                        <span className="text-green-600 font-semibold">✅ Yes</span>
                      ) : (
                        <span className="text-red-600 font-semibold">❌ No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chart Card */}
      <div className="bg-white border border-orange-200 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
          <FaChartBar className="text-orange-500" /> GHG Intensity Comparison Chart
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparison} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="routeId" tick={{ fill: "#374151", fontWeight: 500 }} />
            <YAxis tick={{ fill: "#374151", fontWeight: 500 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF7ED",
                borderRadius: "8px",
                borderColor: "#F97316",
              }}
            />
            <Legend />

            {/* Thicker, rounded bars */}
            <Bar
              dataKey="baselineIntensity"
              fill="#F97316"
              name="Baseline"
              radius={[6, 6, 0, 0]}
              barSize={50}
            />
            <Bar
              dataKey="comparisonIntensity"
              fill="#9CA3AF"
              name="Actual"
              radius={[6, 6, 0, 0]}
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

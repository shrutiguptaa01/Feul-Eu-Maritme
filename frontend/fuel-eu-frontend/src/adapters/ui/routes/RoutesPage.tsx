import { useEffect, useMemo, useState } from "react";
import { useRoutesService } from "../../../core/application/useRoutesService";
import type { Route } from "../../../core/domain/Route";
import { FaCheckCircle, FaStar, FaRoute } from "react-icons/fa";

export function RoutesPage() {
  const { routes, loading, loadRoutes, setBaseline } = useRoutesService();

  const [filters, setFilters] = useState({
    vesselType: "",
    fuelType: "",
    year: "",
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const safeRoutes = Array.isArray(routes) ? routes : [];

  const filteredRoutes = useMemo(() => {
    return safeRoutes.filter((r: Route) => {
      return (
        (filters.vesselType === "" || r.vesselType === filters.vesselType) &&
        (filters.fuelType === "" || r.fuelType === filters.fuelType) &&
        (filters.year === "" || r.year === Number(filters.year))
      );
    });
  }, [safeRoutes, filters]);

  const vesselTypes = [...new Set(safeRoutes.map((r) => r.vesselType))];
  const fuelTypes = [...new Set(safeRoutes.map((r) => r.fuelType))];
  const years = [...new Set(safeRoutes.map((r) => r.year))];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-b from-[#fef7ee] to-[#fffaf5] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-orange-600 flex items-center gap-3">
          <FaRoute /> Routes Dashboard
        </h2>
        <button
          onClick={loadRoutes}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-md font-semibold transition"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-md border border-orange-200 flex flex-wrap gap-4 justify-center">
        <select
          className="border border-orange-300 px-4 py-2 rounded focus:ring-2 focus:ring-orange-300"
          value={filters.vesselType}
          onChange={(e) => setFilters({ ...filters, vesselType: e.target.value })}
        >
          <option value="">All Vessel Types</option>
          {vesselTypes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select
          className="border border-orange-300 px-4 py-2 rounded focus:ring-2 focus:ring-orange-300"
          value={filters.fuelType}
          onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
        >
          <option value="">All Fuel Types</option>
          {fuelTypes.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="border border-orange-300 px-4 py-2 rounded focus:ring-2 focus:ring-orange-300"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-200">
        {loading ? (
          <p className="text-gray-600 text-center">Loading routes...</p>
        ) : safeRoutes.length === 0 ? (
          <p className="text-gray-600 text-center">
            ⚠️ No routes found or API error.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-50 border-b border-orange-200 text-orange-800 uppercase text-sm font-bold">
                  <th className="p-3">Route ID</th>
                  <th className="p-3">Vessel Type</th>
                  <th className="p-3">Fuel Type</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">GHG Intensity</th>
                  <th className="p-3">Fuel Consumption</th>
                  <th className="p-3">Distance</th>
                  <th className="p-3">Total Emissions</th>
                  <th className="p-3">Baseline</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((r) => (
                  <tr
                    key={r.routeId}
                    className="border-b hover:bg-orange-50 transition cursor-pointer"
                  >
                    <td className="p-3 font-medium flex items-center gap-2">
                      {r.routeId}
                      {r.isBaseline && <FaStar className="text-yellow-500" />}
                    </td>
                    <td className="p-3">{r.vesselType}</td>
                    <td className="p-3">{r.fuelType}</td>
                    <td className="p-3">{r.year}</td>
                    <td className="p-3">{r.ghgIntensity}</td>
                    <td className="p-3">{r.fuelConsumption}</td>
                    <td className="p-3">{r.distance}</td>
                    <td className="p-3">{r.totalEmissions}</td>
                    <td className="p-3">
                      {r.isBaseline ? (
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <FaCheckCircle /> Baseline
                        </span>
                      ) : (
                        <button
                          className="bg-orange-400 text-white px-4 py-1 rounded hover:bg-orange-500 shadow-sm transition flex items-center gap-1"
                          onClick={() => setBaseline(r.routeId)}
                        >
                          <FaCheckCircle /> Set Baseline
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

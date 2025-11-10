import { useState, useEffect } from "react";
import { useComplianceService } from "../../../core/application/useComplianceService";
import { useBankingService } from "../../../core/application/useBankingService";
import { toast } from "react-toastify";
import {
  FaCoins,
  FaChartLine,
  FaDatabase,
  FaSyncAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

export function BankingPage() {
  const { cb, loadCB, loading: loadingCB, error: cbError } = useComplianceService();
  const {
    records,
    loadRecords,
    bankSurplus,
    applyBank,
    loading: loadingRecords,
    error: bankingError,
  } = useBankingService();

  const [shipId, setShipId] = useState("");
  const [year, setYear] = useState("");
  const [applyAmount, setApplyAmount] = useState("");

  // Show toast notifications for errors
  useEffect(() => {
    if (cbError) toast.error(cbError);
    if (bankingError) toast.error(bankingError);
  }, [cbError, bankingError]);

  // Load CB and records
  async function handleLoadCB() {
    if (!shipId || !year) return toast.warn("Please enter Ship ID and Year");
    try {
      await loadCB(shipId, Number(year));
      await loadRecords(shipId, Number(year));
    } catch (err: any) {
      toast.error(err.message || "Failed to load CB data");
    }
  }

  // Bank surplus CB
  async function handleBank() {
    if (!shipId || !year) return toast.warn("Please enter Ship ID and Year");
    try {
      const res = await bankSurplus(shipId, Number(year));
      if (res) {
        toast.success("Surplus banked successfully!");
        await handleLoadCB();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to bank surplus");
    }
  }

  // Apply banked CB
  async function handleApply() {
    if (!shipId || !year || !applyAmount)
      return toast.warn("Please enter all details");
    try {
      const res = await applyBank(shipId, Number(year), Number(applyAmount));
      if (res) {
        toast.success("Bank amount applied successfully!");
        await handleLoadCB();
        setApplyAmount("");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to apply banked CB");
    }
  }

  return (
    <div className="min-h-screen bg-gradient from-[#fef7ee] to-[#fffaf5] p-8 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-orange-600 flex items-center gap-3">
          <FaDatabase className="text-orange-500" /> Banking & Compliance
        </h2>
        <button
          onClick={handleLoadCB}
          disabled={loadingCB}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow transition-all disabled:opacity-50"
        >
          <FaSyncAlt className={`${loadingCB ? "animate-spin" : ""}`} />
          {loadingCB ? "Loading..." : "Load Data"}
        </button>
      </div>

      {/* Input Section */}
      <div className="bg-white border border-orange-200 p-6 rounded-xl shadow-md">
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-orange-700 mb-1">
              Ship / Route ID
            </label>
            <input
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 transition-all"
              placeholder="e.g., R001"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-semibold text-orange-700 mb-1">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 transition-all"
              placeholder="2025"
            />
          </div>

          <button
            onClick={handleLoadCB}
            disabled={loadingCB}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow transition disabled:opacity-50"
          >
            <FaSyncAlt className={`${loadingCB ? "animate-spin" : ""}`} />
            {loadingCB ? "Loading…" : "Fetch Data"}
          </button>
        </div>
      </div>

      {/* Compliance Balance Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-lg font-semibold text-orange-700 mb-2">
            <FaCoins /> Compliance Balance
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {loadingCB
              ? "Loading..."
              : cb && cb.cb != null
              ? (
                <span className={`${cb.cb >= 0 ? "text-green-700" : "text-red-600"} font-extrabold`}>
                  {cb.cb.toFixed(2)} gCO₂e
                </span>
              )
              : "—"}
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-lg font-semibold text-orange-700 mb-2">
            <FaChartLine /> Adjusted CB
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {loadingCB
              ? "Loading..."
              : cb && cb.adjustedCB != null
              ? (
                <span className={`${cb.adjustedCB >= 0 ? "text-green-700" : "text-red-600"} font-extrabold`}>
                  {cb.adjustedCB.toFixed(2)} gCO₂e
                </span>
              )
              : "—"}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-lg font-semibold text-green-700 mb-2">
            <FaDatabase /> Target
          </div>
          <div className="text-2xl font-bold text-green-800">89.3368 gCO₂e/MJ</div>
        </div>
      </div>

      {/* Banking Actions */}
      {cb && (
        <div className="bg-white border border-orange-200 p-6 rounded-xl shadow-lg space-y-6">
          <h3 className="text-xl font-bold text-orange-700 flex items-center gap-2">
            <FaCoins className="text-orange-500" /> Banking Actions
          </h3>

          {/* Bank Surplus */}
          {cb.cb && cb.cb > 0 ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={handleBank}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition-all"
              >
                <FaCoins /> Bank Surplus CB
              </button>
              <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded-md flex items-center gap-2">
                <FaCheckCircle /> This ship has positive CB available for banking.
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-md flex items-center gap-2">
              <FaExclamationTriangle /> No positive CB available to bank.
            </div>
          )}

          {/* Apply Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="Amount to apply"
                value={applyAmount}
                onChange={(e) => setApplyAmount(e.target.value)}
                className="border border-orange-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 w-56"
              />
              <button
                onClick={handleApply}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition-all"
              >
                <FaChartLine /> Apply Banked Surplus
              </button>
            </div>

            {records.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-2 rounded-md flex items-center gap-2">
                <FaExclamationTriangle /> No previously banked CB found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Banking Records */}
      <div className="bg-white border border-orange-200 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
          <FaDatabase className="text-orange-500" /> Banking Records
        </h3>

        {loadingRecords ? (
          <p className="text-gray-600">Loading records...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-600">No banking records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-100 text-orange-800 text-sm font-semibold border-b">
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount (gCO₂e)</th>
                  <th className="p-3">Year</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-orange-50 transition">
                    <td className="p-3 font-semibold">
                      {record.amountGco2eq > 0 ? (
                        <span className="text-green-700 flex items-center gap-1">
                          <FaCoins /> Banked
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <FaChartLine /> Applied
                        </span>
                      )}
                    </td>
                    <td className="p-3">{record.amountGco2eq.toLocaleString()}</td>
                    <td className="p-3">{record.year}</td>
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

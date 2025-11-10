import { useEffect, useState } from "react";
import { usePoolingService } from "../../../core/application/usePoolingService";
import { API_BASE_URL } from "../../../shared/config";
import { toast } from "react-toastify";
import { FaProjectDiagram, FaCheckCircle } from "react-icons/fa";

type Member = { shipId: string; year: number; cb?: number };

export function PoolingPage() {
  const { pool, loading, createPool } = usePoolingService();

  const [members, setMembers] = useState<Member[]>([
    { shipId: "R001", year: 2024 },
    { shipId: "R002", year: 2024 },
  ]);

  const [err, setErr] = useState<string>("");

  // Load CBs
  async function loadCBs() {
    setErr("");
    const next: Member[] = [];
    for (const m of members) {
      try {
        const res = await fetch(
          `${API_BASE_URL}/compliance/adjusted-cb?shipId=${m.shipId}&year=${m.year}`
        );
        if (!res.ok) throw new Error("Failed to fetch CB");
        const data = await res.json();
        next.push({ ...m, cb: data.cb });
      } catch (e: any) {
        setErr(e.message);
        return;
      }
    }
    setMembers(next);
  }

  function updateMember(idx: number, patch: Partial<Member>) {
    setMembers((m) => m.map((x, i) => (i === idx ? { ...x, ...patch } : x)));
  }

  async function handleCreatePool() {
    setErr("");
    try {
      await createPool(members.map(({ shipId, year }) => ({ shipId, year })));
      toast.success("Pool created successfully!");
    } catch (e: any) {
      setErr(e.message);
    }
  }

  const poolSum = members.reduce((s, m) => s + (m.cb ?? 0), 0);
  const valid = poolSum >= 0;

  return (
    <div className="space-y-10 p-6 bg-gradient-to-b from-[#fef7ee] to-[#fffaf5] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-orange-600 flex items-center gap-3">
          <FaProjectDiagram /> Pooling
        </h2>
        <button
          onClick={loadCBs}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-md font-semibold transition"
        >
          Load CBs
        </button>
      </div>

      {/* Actions / Pool Summary */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-200 flex flex-wrap gap-4 items-center">
        <button
          onClick={() => setMembers((m) => [...m, { shipId: "", year: 2024 }])}
          className="px-5 py-2 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition"
        >
          + Add Member
        </button>

        <div
          className={`px-5 py-2 rounded-lg font-semibold border ${
            valid
              ? "bg-green-50 border-green-400 text-green-800"
              : "bg-red-50 border-red-400 text-red-800"
          }`}
        >
          Pool Sum: {poolSum.toFixed(2)}
        </div>

        <button
          disabled={!valid}
          onClick={handleCreatePool}
          className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <FaCheckCircle /> Create Pool
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-orange-200 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-orange-50 border-b border-orange-200">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-orange-700">
                Ship ID
              </th>
              <th className="p-3 text-left text-sm font-semibold text-orange-700">
                Year
              </th>
              <th className="p-3 text-right text-sm font-semibold text-orange-700">
                CB
              </th>
              <th className="p-3 text-center text-sm font-semibold text-orange-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i} className="hover:bg-orange-50 transition">
                <td className="p-3">
                  <input
                    value={m.shipId}
                    onChange={(e) => updateMember(i, { shipId: e.target.value })}
                    placeholder="Enter Ship ID"
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={m.year}
                    onChange={(e) => updateMember(i, { year: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                  />
                </td>
                <td className="p-3 text-right font-medium text-orange-600">
                  {m.cb === undefined ? "—" : m.cb.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => setMembers((x) => x.filter((_, j) => j !== i))}
                    className="px-4 py-2 bg-red-700 hover:bg-red-500 text-white rounded-lg font-semibold transition"
                  >
                    ✕ Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pool Result */}
      {pool && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-200">
          <h3 className="text-xl font-bold text-orange-600 flex items-center gap-2">
            <FaCheckCircle /> Pool Result
          </h3>

          <p className="mt-2 mb-4">
            <strong>Total CB:</strong>{" "}
            <span className={pool.totalCB >= 0 ? "text-green-600" : "text-red-600"}>
              {pool.totalCB.toLocaleString()}
            </span>
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-orange-50 border-b border-orange-200">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-orange-700">Ship ID</th>
                  <th className="p-3 text-right text-sm font-semibold text-orange-700">CB Before</th>
                  <th className="p-3 text-right text-sm font-semibold text-orange-700">CB After</th>
                </tr>
              </thead>
              <tbody>
                {pool.members.map((m) => (
                  <tr key={m.shipId} className="hover:bg-orange-50 transition">
                    <td className="p-3 font-medium">{m.shipId}</td>
                    <td className="p-3 text-right">{m.cbBefore.toLocaleString()}</td>
                    <td
                      className={`p-3 font-semibold ${
                        m.cbAfter >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {m.cbAfter.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Error Message */}
      {err && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <p className="text-red-600 font-semibold">{err}</p>
        </div>
      )}
    </div>
  );
}

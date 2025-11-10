import { useState } from "react";
import { HttpRouteAdapter } from "../../adapters/infrastructure/HttpRouteAdapter";
import type { ComparisonResult } from "../domain/Comparison";

export function useCompareService() {
  const api = new HttpRouteAdapter();

  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult[]>([]);

  async function loadComparison() {
    setLoading(true);
    const data = await api.getComparison();
    setComparison(data);
    setLoading(false);
  }

  return {
    loading,
    comparison,
    loadComparison,
  };
}

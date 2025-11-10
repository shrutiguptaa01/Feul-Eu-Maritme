import type { RoutePort } from "../../core/ports/RoutePort";
import type { Route } from "../../core/domain/Route";
import type { ComparisonResult } from "../../core/domain/Comparison";
import { API_BASE_URL } from "../../shared/config";

export class HttpRouteAdapter implements RoutePort {
  async getRoutes(): Promise<Route[]> {
    const res = await fetch(`${API_BASE_URL}/routes`);
    return res.json();
  }

  async setBaseline(routeId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/routes/${routeId}/baseline`, {
      method: "POST",
    });
  }

  async getComparison(): Promise<ComparisonResult[]> {
    const res = await fetch(`${API_BASE_URL}/routes/comparison`);
    return res.json();
  }
}

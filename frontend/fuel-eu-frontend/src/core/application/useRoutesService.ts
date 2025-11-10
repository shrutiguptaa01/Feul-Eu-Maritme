import { useState } from "react";
import { HttpRouteAdapter } from "../../adapters/infrastructure/HttpRouteAdapter";
import type { Route } from "../domain/Route";

export function useRoutesService() {
  const api = new HttpRouteAdapter();

  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);

  async function loadRoutes() {
    setLoading(true);
    const data = await api.getRoutes();
    setRoutes(data);
    setLoading(false);
  }

  async function setBaseline(routeId: string) {
    await api.setBaseline(routeId);
    await loadRoutes(); 
  }

  return {
    loading,
    routes,
    loadRoutes,
    setBaseline
  };
}

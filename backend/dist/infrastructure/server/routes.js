"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoutesRouter = createRoutesRouter;
const express_1 = require("express");
function createRoutesRouter(routesController) {
    const router = (0, express_1.Router)();
    router.get("/routes", routesController.getAllRoutes);
    router.post("/routes/:id/baseline", routesController.setBaselineRoute);
    router.get("/routes/comparison", routesController.getComparisonRoutes);
    return router;
}

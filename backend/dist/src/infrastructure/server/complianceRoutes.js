"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComplianceRouter = createComplianceRouter;
const express_1 = require("express");
function createComplianceRouter(controller) {
    const router = (0, express_1.Router)();
    router.get("/compliance/cb", controller.getComplianceBalance);
    router.get("/compliance/cb/stored", controller.getStoredComplianceRecord);
    router.get("/compliance/adjusted-cb", controller.getAdjustedCompliance);
    return router;
}

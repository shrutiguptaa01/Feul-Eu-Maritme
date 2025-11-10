"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBankingRouter = createBankingRouter;
const express_1 = require("express");
function createBankingRouter(controller) {
    const router = (0, express_1.Router)();
    router.post("/banking/bank", controller.bank);
    router.post("/banking/apply", controller.apply);
    router.get("/banking/records", controller.getRecords);
    return router;
}

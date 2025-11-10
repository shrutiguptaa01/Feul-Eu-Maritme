"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoolingRouter = createPoolingRouter;
const express_1 = require("express");
function createPoolingRouter(controller) {
    const router = (0, express_1.Router)();
    router.post("/pools", controller.createPool);
    return router;
}

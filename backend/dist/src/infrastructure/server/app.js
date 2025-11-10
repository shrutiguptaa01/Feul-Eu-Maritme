"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("../db/client");
const RouteRepositoryPostgres_1 = require("../../adapters/outbound/postgres/RouteRepositoryPostgres");
const ComplianceRepositoryPostgres_1 = require("../../adapters/outbound/postgres/ComplianceRepositoryPostgres");
const BankingRepositoryPostgres_1 = require("../../adapters/outbound/postgres/BankingRepositoryPostgres");
const PoolingRepositoryPostgres_1 = require("../../adapters/outbound/postgres/PoolingRepositoryPostgres");
const GetRoutesUseCase_1 = require("../../core/application/GetRoutesUseCase");
const SetBaselineUseCase_1 = require("../../core/application/SetBaselineUseCase");
const GetComparisonUseCase_1 = require("../../core/application/GetComparisonUseCase");
const ComputeCBUseCase_1 = require("../../core/application/ComputeCBUseCase");
const BankSurplusUseCase_1 = require("../../core/application/BankSurplusUseCase");
const ApplyBankedUseCase_1 = require("../../core/application/ApplyBankedUseCase");
const CreatePoolUseCase_1 = require("../../core/application/CreatePoolUseCase");
const GetAdjustedComplianceUseCase_1 = require("../../core/application/GetAdjustedComplianceUseCase");
const RoutesController_1 = require("../../adapters/inbound/http/RoutesController");
const ComplianceController_1 = require("../../adapters/inbound/http/ComplianceController");
const BankingController_1 = require("../../adapters/inbound/http/BankingController");
const PoolingController_1 = require("../../adapters/inbound/http/PoolingController");
const routes_1 = require("./routes");
const complianceRoutes_1 = require("./complianceRoutes");
const bankingRoutes_1 = require("./bankingRoutes");
const poolingRoutes_1 = require("./poolingRoutes");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: false
    }));
    app.use(express_1.default.json());
    // Repositories
    const routeRepo = new RouteRepositoryPostgres_1.RouteRepositoryPostgres(client_1.db);
    const complianceRepo = new ComplianceRepositoryPostgres_1.ComplianceRepositoryPostgres(client_1.db);
    const bankingRepo = new BankingRepositoryPostgres_1.BankingRepositoryPostgres(client_1.db);
    const poolingRepo = new PoolingRepositoryPostgres_1.PoolingRepositoryPostgres(client_1.db);
    // Use Cases
    const getRoutesUC = new GetRoutesUseCase_1.GetRoutesUseCase(routeRepo);
    const setBaselineUC = new SetBaselineUseCase_1.SetBaselineUseCase(routeRepo);
    const getComparisonUC = new GetComparisonUseCase_1.GetComparisonUseCase(routeRepo);
    const createPoolUC = new CreatePoolUseCase_1.CreatePoolUseCase(complianceRepo, poolingRepo);
    const computeCBUC = new ComputeCBUseCase_1.ComputeCBUseCase(routeRepo, complianceRepo);
    const bankSurplusUC = new BankSurplusUseCase_1.BankSurplusUseCase(bankingRepo, complianceRepo);
    const applyBankedUC = new ApplyBankedUseCase_1.ApplyBankedUseCase(bankingRepo, complianceRepo);
    const getAdjustedComplianceUC = new GetAdjustedComplianceUseCase_1.GetAdjustedComplianceUseCase(complianceRepo, bankingRepo);
    // Controllers
    const routesController = new RoutesController_1.RoutesController(getRoutesUC, setBaselineUC, getComparisonUC);
    const complianceController = new ComplianceController_1.ComplianceController(computeCBUC, complianceRepo, getAdjustedComplianceUC);
    const bankingController = new BankingController_1.BankingController(bankSurplusUC, applyBankedUC, bankingRepo);
    const poolingController = new PoolingController_1.PoolingController(createPoolUC);
    // Routes
    app.use((0, routes_1.createRoutesRouter)(routesController));
    app.use((0, complianceRoutes_1.createComplianceRouter)(complianceController));
    app.use((0, bankingRoutes_1.createBankingRouter)(bankingController));
    app.use((0, poolingRoutes_1.createPoolingRouter)(poolingController));
    return app;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputeCBUseCase = void 0;
const ComplianceCalculation_1 = require("../domain/ComplianceCalculation");
class ComputeCBUseCase {
    constructor(routeRepo, complianceRepo) {
        this.routeRepo = routeRepo;
        this.complianceRepo = complianceRepo;
    }
    async execute(shipId, year) {
        // 1. Fetch the route for this ship/year
        const route = await this.routeRepo.findByRouteId(shipId);
        if (!route || route.year !== year) {
            throw new Error(`No route data found for shipId=${shipId} and year=${year}`);
        }
        // 2. Compute compliance balance using domain logic
        const cbValue = (0, ComplianceCalculation_1.computeCB)(route.ghgIntensity, route.fuelTons);
        // 3. Save snapshot into DB
        await this.complianceRepo.saveComplianceRecord({
            shipId,
            year,
            cbGco2eq: cbValue
        });
        // 4. Return computed result
        return {
            shipId,
            year,
            cb: cbValue
        };
    }
}
exports.ComputeCBUseCase = ComputeCBUseCase;

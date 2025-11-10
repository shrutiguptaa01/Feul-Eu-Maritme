"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetBaselineUseCase = void 0;
class SetBaselineUseCase {
    constructor(routeRepo) {
        this.routeRepo = routeRepo;
    }
    async execute(routeId) {
        const route = await this.routeRepo.findByRouteId(routeId);
        if (!route) {
            throw new Error(`Route with id ${routeId} not found`);
        }
        await this.routeRepo.setBaseline(routeId);
    }
}
exports.SetBaselineUseCase = SetBaselineUseCase;

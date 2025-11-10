"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoutesUseCase = void 0;
class GetRoutesUseCase {
    constructor(routeRepo) {
        this.routeRepo = routeRepo;
    }
    async execute() {
        return this.routeRepo.findAll();
    }
}
exports.GetRoutesUseCase = GetRoutesUseCase;

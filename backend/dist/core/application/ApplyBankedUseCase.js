"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyBankedUseCase = void 0;
class ApplyBankedUseCase {
    constructor(bankingRepo, complianceRepo) {
        this.bankingRepo = bankingRepo;
        this.complianceRepo = complianceRepo;
    }
    async execute(shipId, year, amount) {
        const available = await this.bankingRepo.getBankedAmount(shipId, year);
        if (amount > available) {
            throw new Error("Cannot apply more than available banked amount.");
        }
        // Deduct from bank
        await this.bankingRepo.applyBankedAmount(shipId, year, amount);
        // Return outcome
        return {
            applied: amount,
            remaining: available - amount,
        };
    }
}
exports.ApplyBankedUseCase = ApplyBankedUseCase;

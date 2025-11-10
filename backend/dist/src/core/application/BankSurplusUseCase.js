"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankSurplusUseCase = void 0;
class BankSurplusUseCase {
    constructor(bankingRepo, complianceRepo) {
        this.bankingRepo = bankingRepo;
        this.complianceRepo = complianceRepo;
    }
    async execute(shipId, year) {
        const record = await this.complianceRepo.getComplianceRecord(shipId, year);
        if (!record) {
            throw new Error("Compliance balance not computed yet for this ship/year.");
        }
        if (record.cbGco2eq <= 0) {
            throw new Error("Cannot bank non-positive CB.");
        }
        await this.bankingRepo.addBankEntry({
            shipId,
            year,
            amountGco2eq: record.cbGco2eq,
        });
        return { banked: record.cbGco2eq };
    }
}
exports.BankSurplusUseCase = BankSurplusUseCase;

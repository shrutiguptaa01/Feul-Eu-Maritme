"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdjustedComplianceUseCase = void 0;
class GetAdjustedComplianceUseCase {
    constructor(complianceRepo, bankingRepo) {
        this.complianceRepo = complianceRepo;
        this.bankingRepo = bankingRepo;
    }
    async execute(year) {
        const cbRows = await this.complianceRepo.getComplianceForYear(year);
        const bankRows = await this.bankingRepo.getBankEntriesForYear(year);
        return cbRows.map((row) => {
            const applied = bankRows
                .filter((b) => b.shipId === row.shipId)
                .reduce((sum, b) => sum + b.amountGco2eq, 0);
            return {
                shipId: row.shipId,
                adjustedCb: row.cbGco2eq + applied
            };
        });
    }
}
exports.GetAdjustedComplianceUseCase = GetAdjustedComplianceUseCase;

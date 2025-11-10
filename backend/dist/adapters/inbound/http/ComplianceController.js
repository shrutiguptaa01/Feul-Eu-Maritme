"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceController = void 0;
class ComplianceController {
    constructor(computeCB, complianceRepo, adjustedUseCase) {
        this.computeCB = computeCB;
        this.complianceRepo = complianceRepo;
        this.adjustedUseCase = adjustedUseCase;
        // Compute and fetch CB
        this.getComplianceBalance = async (req, res) => {
            try {
                const { shipId, year } = req.query;
                if (!shipId || !year) {
                    return res.status(400).json({
                        error: "Missing required query parameters: shipId, year",
                    });
                }
                const yearNum = Number(year);
                if (isNaN(yearNum)) {
                    return res.status(400).json({
                        error: "year must be a valid number",
                    });
                }
                // Execute use-case
                const result = await this.computeCB.execute(String(shipId), yearNum);
                res.json({
                    shipId: result.shipId,
                    year: result.year,
                    cb: result.cb,
                });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        };
        // fetch stored CB (without recomputing)
        this.getStoredComplianceRecord = async (req, res) => {
            try {
                const { shipId, year } = req.query;
                if (!shipId || !year) {
                    return res.status(400).json({
                        error: "Missing required query parameters: shipId, year",
                    });
                }
                const record = await this.complianceRepo.getComplianceRecord(String(shipId), Number(year));
                if (!record) {
                    return res.status(404).json({ error: "No CB record found" });
                }
                res.json(record);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        };
        this.getAdjustedCompliance = async (req, res) => {
            try {
                const { year } = req.query;
                if (!year) {
                    return res.status(400).json({ error: "Missing required query parameter: year" });
                }
                const yearNum = Number(year);
                const result = await this.adjustedUseCase.execute(yearNum);
                return res.json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        };
    }
}
exports.ComplianceController = ComplianceController;

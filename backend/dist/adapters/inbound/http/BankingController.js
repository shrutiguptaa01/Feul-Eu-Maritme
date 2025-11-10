"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingController = void 0;
class BankingController {
    constructor(bankSurplus, applyBanked, bankingRepo) {
        this.bankSurplus = bankSurplus;
        this.applyBanked = applyBanked;
        this.bankingRepo = bankingRepo;
        this.bank = async (req, res) => {
            try {
                const { shipId, year } = req.body;
                const result = await this.bankSurplus.execute(shipId, Number(year));
                res.json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        };
        this.apply = async (req, res) => {
            try {
                const { shipId, year, amount } = req.body;
                const result = await this.applyBanked.execute(shipId, Number(year), Number(amount));
                res.json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        };
        this.getRecords = async (req, res) => {
            try {
                const { shipId, year } = req.query;
                const records = await this.bankingRepo.getBankEntries(String(shipId), Number(year));
                res.json(records);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        };
    }
}
exports.BankingController = BankingController;

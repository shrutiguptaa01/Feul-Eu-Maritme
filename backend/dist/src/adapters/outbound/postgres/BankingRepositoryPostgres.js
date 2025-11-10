"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingRepositoryPostgres = void 0;
class BankingRepositoryPostgres {
    constructor(db) {
        this.db = db;
    }
    async addBankEntry(entry) {
        await this.db.query(`
      INSERT INTO bank_entries (ship_id, year, amount_gco2eq)
      VALUES ($1, $2, $3);
      `, [entry.shipId, entry.year, entry.amountGco2eq]);
    }
    async getBankedAmount(shipId, year) {
        const res = await this.db.query(`
      SELECT COALESCE(SUM(amount_gco2eq), 0) AS total
      FROM bank_entries
      WHERE ship_id = $1 AND year = $2;
      `, [shipId, year]);
        return Number(res.rows[0].total);
    }
    async getBankEntriesForYear(year) {
        const res = await this.db.query(`SELECT ship_id AS "shipId", amount_gco2eq AS "amountGco2eq", year 
       FROM bank_entries 
       WHERE year = $1`, [year]);
        return res.rows;
    }
    async getBankEntries(shipId, year) {
        const res = await this.db.query(`
      SELECT id, ship_id, year, amount_gco2eq
      FROM bank_entries
      WHERE ship_id = $1 AND year = $2;
      `, [shipId, year]);
        return res.rows.map((r) => ({
            id: r.id,
            shipId: r.ship_id,
            year: r.year,
            amountGco2eq: Number(r.amount_gco2eq),
        }));
    }
    async applyBankedAmount(shipId, year, amount) {
        await this.db.query(`
      INSERT INTO bank_entries (ship_id, year, amount_gco2eq)
      VALUES ($1, $2, $3);
      `, [shipId, year, -Math.abs(amount)]);
    }
}
exports.BankingRepositoryPostgres = BankingRepositoryPostgres;

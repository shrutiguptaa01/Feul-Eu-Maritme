"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolingRepositoryPostgres = void 0;
class PoolingRepositoryPostgres {
    constructor(db) {
        this.db = db;
    }
    // Create a pool and return pool_id
    async createPool(year) {
        const res = await this.db.query(`
      INSERT INTO pools (year)
      VALUES ($1)
      RETURNING id;
      `, [year]);
        return res.rows[0].id;
    }
    // Insert pool members
    async addPoolMembers(poolId, members) {
        const query = `
      INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after)
      VALUES ($1, $2, $3, $4);
    `;
        for (const m of members) {
            await this.db.query(query, [
                poolId,
                m.shipId,
                m.cbBefore,
                m.cbAfter,
            ]);
        }
    }
    async existsForYear(year) {
        const res = await this.db.query(`SELECT 1 FROM pools WHERE year = $1 LIMIT 1`, [year]);
        return (res.rowCount ?? 0) > 0;
    }
}
exports.PoolingRepositoryPostgres = PoolingRepositoryPostgres;

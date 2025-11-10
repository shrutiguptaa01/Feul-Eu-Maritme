"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolingController = void 0;
class PoolingController {
    constructor(createPoolUseCase) {
        this.createPoolUseCase = createPoolUseCase;
        this.createPool = async (req, res) => {
            try {
                const { year, shipIds } = req.body;
                if (!year || !shipIds) {
                    return res.status(400).json({
                        error: "Missing required fields: year, shipIds"
                    });
                }
                if (!Array.isArray(shipIds) || shipIds.length === 0) {
                    return res.status(400).json({
                        error: "shipIds must be a non-empty array"
                    });
                }
                const result = await this.createPoolUseCase.execute({
                    year: Number(year),
                    shipIds: shipIds.map(String)
                });
                return res.json(result);
            }
            catch (err) {
                return res.status(400).json({ error: err.message });
            }
        };
    }
}
exports.PoolingController = PoolingController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutesController = void 0;
class RoutesController {
    constructor(getRoutes, setBaseline, getComparison) {
        this.getRoutes = getRoutes;
        this.setBaseline = setBaseline;
        this.getComparison = getComparison;
        this.getAllRoutes = async (req, res) => {
            try {
                const routes = await this.getRoutes.execute();
                res.json(routes);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        };
        this.setBaselineRoute = async (req, res) => {
            try {
                const routeId = req.params.id;
                await this.setBaseline.execute(routeId);
                res.json({ message: `Baseline set to route ${routeId}` });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        };
        this.getComparisonRoutes = async (req, res) => {
            try {
                const result = await this.getComparison.execute();
                res.json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        };
    }
}
exports.RoutesController = RoutesController;

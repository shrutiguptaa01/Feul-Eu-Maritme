"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeCB = computeCB;
const constants_1 = require("../../shared/constants");
function computeCB(actualIntensity, fuelTons, target = constants_1.TARGET_2025_INTENSITY) {
    const energyInScope = fuelTons * constants_1.ENERGY_PER_TON_MJ;
    const cb = (target - actualIntensity) * energyInScope;
    return cb; // positive = surplus, negative = deficit
}

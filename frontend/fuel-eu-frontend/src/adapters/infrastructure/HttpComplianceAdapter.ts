import type { CompliancePort } from "../../core/ports/CompliancePort";
import type { ComplianceBalance } from "../../core/domain/ComplianceBalance";
import { API_BASE_URL } from "../../shared/config";

export class HttpComplianceAdapter implements CompliancePort {
  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    const res = await fetch(`${API_BASE_URL}/compliance/cb?shipId=${shipId}&year=${year}`);
    return res.json();
  }
}

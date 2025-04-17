import { logToFile } from "@/utils/logger";

/**
 * Represents a 10 year average risk free rate.
 */
export interface RiskFreeRate {
  /**
   * The 10 year average risk free rate
   */
  rate: number;
}

/**
 * Asynchronously retrieves risk free rate.
 *
 * @returns A promise that resolves to a RiskFreeRate object containing the rate.
 */
export async function getRiskFreeRate(): Promise<RiskFreeRate> {  
    try {
        const response = await fetch('/api/risk-free-rate');
        const data = await response.json();
        return data;
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
        console.error('Error fetching risk-free rate:', (error as any).message, error);
      } else {
        console.error('Error fetching risk-free rate:', error);
      }
      return { rate: -1000.0 };
  }
}

/**
 * Represents the market return, such as the SP500 mean return
 */
export interface MarketReturn {
  /**
   * The market return.
   */
  rate: number;
}

/**
 * Asynchronously retrieves the market return.
 *
 * @returns A promise that resolves to a MarketReturn object containing the rate.
 */
export async function getMarketReturn(): Promise<MarketReturn> {  
    try {
        const response = await fetch('/api/market-return');
        const data = await response.json();
        return data;
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
        console.error('Error fetching market return:', (error as any).message, error);
      } else {
        console.error('Error fetching market return:', error);
      }
      return { rate: -1.0 };
  }
}

/**
 * Represents the unlevered beta.
 */
export interface UnleveredBeta {
  /**
   * The unlevered beta.
   */
  beta: number;
}

/**
 * Asynchronously retrieves the unlevered beta.
 *
 * @param companySector The company sector.
 *
 * @returns A promise that resolves to a UnleveredBeta object containing the beta.
 */
export async function getUnleveredBeta(
  companySector: string,
): Promise<UnleveredBeta> {
  try {
    const response = await fetch(`/api/unlevered-beta?sector=${companySector}`);
    const data = await response.json();
    return data;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
      console.error('Error fetching unlevered beta:', (error as any).message, error);
    } else {
      console.error('Error fetching unlevered beta:', error);
    }
    return { beta: -1.0 };
  }
}


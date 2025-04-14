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
  // TODO: Implement this by calling an API.

  return {
    rate: 0.0384,
  };
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
  // TODO: Implement this by calling an API.

  return {
    rate: 0.10,
  };
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
 * @param companySector The company sector to filter on.
 * @param country The country to filter on.
 *
 * @returns A promise that resolves to a UnleveredBeta object containing the beta.
 */
export async function getUnleveredBeta(
  companySector: string,
  country: string
): Promise<UnleveredBeta> {
  // TODO: Implement this by calling an API.

  return {
    beta: 1.1,
  };
}

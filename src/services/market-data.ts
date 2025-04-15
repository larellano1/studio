import yf from "yfinance";

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
    const ticker = yf.getTicker("^TNX"); // ^TNX is the ticker symbol for the 10-year Treasury yield
    const history = await ticker.history({ period: "1d" });
    const latestValue = history.values().next().value;
    const rate = latestValue.close / 100;

    return { rate };
  } catch (error) {
    console.error("Error fetching risk-free rate:", error);
    // Return a default value or throw an error depending on your error handling strategy
    return { rate: -1000.0 }; // Returning a default value for now
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

import { NextResponse } from "next/server";
import { logToFile } from "@/utils/logger";

export async function GET() {

  try {
    const apiKey = process.env.FRED_API_KEY;
    if (!apiKey) {
      throw new Error("FRED_API_KEY environment variable not set.");
    }

    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=SP500&api_key=${apiKey}&file_type=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data from FRED: ${response.statusText}`);
    }
    const data = await response.json();
    const observations = data.observations;

    if (!observations || observations.length < 2520) {
      throw new Error("Not enough data points to calculate 10-year return.");
    }

    const closePrices = observations
      .slice(-2520)
      .map((obs: any) => parseFloat(obs.value))
      .filter((value: number) => !isNaN(value) && value !== 0);

    logToFile(`Close prices: ${closePrices.length}`)
    logToFile(`Initial Date: ${observations[0].date}`)
    logToFile(`Final Date: ${observations[observations.length - 1].date}`)

    const initialValue = closePrices[0];
    const finalValue = closePrices[closePrices.length - 1];
    const totalReturn = (finalValue - initialValue) / initialValue;
    const numberOfYears = 10;
    const averageAnnualReturn = ((totalReturn + 1) ** (1 / numberOfYears)) - 1;

      return NextResponse.json({ rate: averageAnnualReturn }, { status: 200 });
    } catch (error) {
      logToFile(`Error fetching or calculating SP500 average annual return: ${error}`);
      return NextResponse.json({ rate: -3.0, error: (error as Error).message }, { status: 500 });
    }
}
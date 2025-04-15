"use client";

import { useState } from "react";
import {
  getMarketReturn,
  getRiskFreeRate,
  getUnleveredBeta,
} from "@/services/market-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Home() {
  const [companySector, setCompanySector] = useState("");
  const [country, setCountry] = useState("");
  const [expectedReturn, setExpectedReturn] = useState<number | null>(null);
  const [riskFreeRate, setRiskFreeRate] = useState<number | null>(null);
  const [marketReturn, setMarketReturn] = useState<number | null>(null);
  const [beta, setBeta] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateCAPM = async () => {
    setIsLoading(true);
    try {
      const riskFreeRateData = await getRiskFreeRate();
      const marketReturnData = await getMarketReturn();
      const unleveredBetaData = await getUnleveredBeta(companySector, country);

      const riskFreeRateValue = riskFreeRateData.rate;
      const marketReturnValue = marketReturnData.rate;
      const betaValue = unleveredBetaData.beta;

      setRiskFreeRate(riskFreeRateValue);
      setMarketReturn(marketReturnValue);
      setBeta(betaValue);

      const capm = riskFreeRateValue + betaValue * (marketReturnValue - riskFreeRateValue);
      setExpectedReturn(capm);
    } catch (error) {
      console.error("Failed to calculate CAPM:", error);
      // TODO: Show error message to the user using useToast hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md space-y-4">
        <CardHeader>
          <CardTitle>ValuMaster: CAPM Calculator</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="company-sector">Company Sector</Label>
            <Input
              id="company-sector"
              placeholder="e.g., Technology"
              value={companySector}
              onChange={(e) => setCompanySector(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="e.g., USA"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <Button onClick={calculateCAPM} disabled={isLoading}>
            {isLoading ? "Calculating..." : "Calculate Expected Return"}
          </Button>
          {expectedReturn !== null && (
            <div className={cn("mt-4 p-4 rounded-md", expectedReturn > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
              <p className="font-bold">
                Expected Return:{" "}
                <span className="font-normal">
                  { (expectedReturn * 100).toFixed(2) }%
                </span>
              </p>
              <p>
                Risk-Free Rate:{" "}
                <span className="font-normal">
                  {riskFreeRate !== null ? (riskFreeRate * 100).toFixed(2) + "%" : "N/A"}
                </span>
              </p>
              <p>
                Market Return:{" "}
                <span className="font-normal">
                  {marketReturn !== null ? (marketReturn * 100).toFixed(2) + "%" : "N/A"}
                </span>
              </p>
              <p>
                Beta:{" "}
                <span className="font-normal">
                  {beta !== null ? beta.toFixed(2) : "N/A"}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

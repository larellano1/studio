"use client";

import { useState } from "react";
import {
  getMarketReturn,
  getRiskFreeRate,
  getUnleveredBeta,
} from "@/services/market-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@/components/ui/toast";
import {
  ToastProvider,
  useToast,
} from "@/hooks/use-toast";

export default function Home() {
  const [companySector, setCompanySector] = useState("");
  const [country, setCountry] = useState("");
  const [expectedReturn, setExpectedReturn] = useState<number | null>(null);
  const [riskFreeRate, setRiskFreeRate] = useState<number | null>(null);
  const [marketReturn, setMarketReturn] = useState<number | null>(null);
  const [beta, setBeta] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const calculateCAPM = async () => {
    setIsLoading(true);
    try {
      if (!companySector || !country) {
        toast({
          title: "Error",
          description: "Please select both company sector and country.",
          variant: "destructive",
        });
        return;
      }

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
      toast({
        title: "Error",
        description: "Failed to calculate CAPM. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sectors = ["Technology", "Healthcare", "Finance", "Energy", "Consumer Discretionary"];
  const countries = ["USA", "Canada", "UK", "Germany", "France", "Japan", "China", "India"];

  return (
    
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
        <Card className="w-full max-w-md space-y-4 bg-card shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">ValueMaster: CAPM Calculator</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">

            <div className="grid gap-2">
              <Label htmlFor="company-sector" className="text-sm font-medium leading-none">Company Sector</Label>
              <Select value={companySector} onValueChange={setCompanySector}>
                <SelectTrigger id="company-sector">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="country" className="text-sm font-medium leading-none">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateCAPM} disabled={isLoading} className="bg-primary text-primary-foreground rounded-md hover:bg-primary/80">
              {isLoading ? "Calculating..." : "Calculate Expected Return"}
            </Button>

            {expectedReturn !== null && (
              <div className={cn("mt-4 p-4 rounded-md", expectedReturn > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                <Accordion type="single" collapsible>
                  <AccordionItem value="formula">
                    <AccordionTrigger>CAPM Formula</AccordionTrigger>
                    <AccordionContent>
                      <p>Expected Return = Risk-Free Rate + Beta * (Market Return - Risk-Free Rate)</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="factors">
                    <AccordionTrigger>Factors</AccordionTrigger>
                    <AccordionContent>
                      <p className="font-bold">
                        Risk-Free Rate:{" "}
                        <span className="font-normal">
                          {(riskFreeRate * 100).toFixed(2)}% (Value: {riskFreeRate?.toFixed(4)})
                        </span>
                      </p>
                      <p className="font-bold">
                        Beta:{" "}
                        <span className="font-normal">
                          {beta?.toFixed(2)} (Value: {beta?.toFixed(4)})
                        </span>
                      </p>
                      <p className="font-bold">
                        Market Return:{" "}
                        <span className="font-normal">
                          {(marketReturn * 100).toFixed(2)}% (Value: {marketReturn?.toFixed(4)})
                        </span>
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <p className="font-bold mt-2">
                  Expected Return:{" "}
                  <span className="font-normal">
                    {(expectedReturn * 100).toFixed(2)}%
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    
  );
}

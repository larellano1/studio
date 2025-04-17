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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { logToFile } from "@/utils/logger";

export default function Home() {
  const [companySector, setCompanySector] = useState("");
  const [country, setCountry] = useState("");
  const [expectedReturn, setExpectedReturn] = useState<number | null>(null);
  const [riskFreeRate, setRiskFreeRate] = useState<number | null>(null);
  const [marketReturn, setMarketReturn] = useState<number | null>(null);
  const [beta, setBeta] = useState<number | null>(null);
  const [countryRiskPremium, setCountryRiskPremium] = useState<number | null>(null);
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
      const unleveredBetaData = await getUnleveredBeta(companySector);
            
      const riskFreeRateValue = riskFreeRateData.rate;
      const marketReturnValue = marketReturnData.rate;
      const betaValue = unleveredBetaData.beta;

      setRiskFreeRate(riskFreeRateValue);
      setMarketReturn(marketReturnValue);
      setBeta(betaValue);
      const countryRiskPremiumData = await fetch("/api/country-risk-premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countries: [country] }),
      }).then(res => res.json());
      setCountryRiskPremium(countryRiskPremiumData);

      const capm = riskFreeRateValue + betaValue * (marketReturnValue - riskFreeRateValue) + countryRiskPremiumData;
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

 const sectors = [
  "Advertising",
  "Aerospace/Defense",
  "Air Transport",
  "Apparel",
  "Auto & Truck",
  "Auto Parts",
  "Bank (Money Center)",
  "Banks (Regional)",
  "Beverage (Alcoholic)",
  "Beverage (Soft)",
  "Broadcasting",
  "Brokerage & Investment Banking",
  "Building Materials",
  "Business & Consumer Services",
  "Cable TV",
  "Chemical (Basic)",
  "Chemical (Diversified)",
  "Chemical (Specialty)",
  "Coal & Related Energy",
  "Computer Services",
  "Computers/Peripherals",
  "Construction Supplies",
  "Diversified",
  "Drugs (Biotechnology)",
  "Drugs (Pharmaceutical)",
  "Education",
  "Electrical Equipment",
  "Electronics (Consumer & Office)",
  "Electronics (General)",
  "Engineering/Construction",
  "Entertainment",
  "Environmental & Waste Services",
  "Farming/Agriculture",
  "Financial Svcs. (Non-bank & Insurance)",
  "Food Processing",
  "Food Wholesalers",
  "Furn/Home Furnishings",
  "Green & Renewable Energy",
  "Healthcare Products",
  "Healthcare Support Services",
  "Heathcare Information and Technology",
  "Homebuilding",
  "Hospitals/Healthcare Facilities",
  "Hotel/Gaming",
  "Household Products",
  "Information Services",
  "Insurance (General)",
  "Insurance (Life)",
  "Insurance (Prop/Cas.)",
  "Investments & Asset Management",
  "Machinery",
  "Metals & Mining",
  "Office Equipment & Services",
  "Oil/Gas (Integrated)",
  "Oil/Gas (Production and Exploration)",
  "Oil/Gas Distribution",
  "Oilfield Svcs/Equip.",
  "Packaging & Container",
  "Paper/Forest Products",
  "Power",
  "Precious Metals",
  "Publishing & Newspapers",
  "R.E.I.T.",
  "Real Estate (Development)",
  "Real Estate (General/Diversified)",
  "Real Estate (Operations & Services)",
  "Recreation",
  "Reinsurance",
  "Restaurant/Dining",
  "Retail (Automotive)",
  "Retail (Building Supply)",
  "Retail (Distributors)",
  "Retail (General)",
  "Retail (Grocery and Food)",
  "Retail (REITs)",
  "Retail (Special Lines)",
  "Rubber& Tires",
  "Semiconductor",
  "Semiconductor Equip",
  "Shipbuilding & Marine",
  "Shoe",
  "Software (Entertainment)",
  "Software (Internet)",
  "Software (System & Application)",
  "Steel",
  "Telecom (Wireless)",
  "Telecom. Equipment",
  "Telecom. Services",
  "Tobacco",
  "Transportation",
  "Transportation (Railroads)",
  "Trucking",
  "Utility (General)",
  "Utility (Water)"
];
  const countries = [
    "USA",
    "Brazil",
  ];

  return (
    <>
      <Toaster />
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
                      <p>Expected Return = Risk-Free Rate + Beta * (Market Return - Risk-Free Rate) + Country Risk-Premium</p>
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
                      <p className="font-bold">
                        Country Risk Premium:{" "}
                        <span className="font-normal">
                          {
                            ((countryRiskPremium !== null && countryRiskPremium !== undefined) ? (countryRiskPremium) : 'NA')
                          }%
                        </span>
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="sources">
                    <AccordionTrigger>Sources</AccordionTrigger>
                    <AccordionContent>
                      <p>The data shown is coming from:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li>
                          <span className="font-bold">Risk-Free Rate:</span> 10 Years US Treasury Bonds - FRED - Series: DGS10{" "}
                          <a
                            href="https://fred.stlouisfed.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            fred.stlouisfed.org
                          </a>
                        </li>
                        <li>
                          <span className="font-bold">Market Return:</span> S&P 500 historical data (10 years) - FRED - Series: SP500{" "}
                          <a
                            href="https://fred.stlouisfed.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            fred.stlouisfed.org
                          </a>
                        </li>
                        <li>
                          <span className="font-bold">Unlevered Beta:</span> Damodaran Online -{" "}
                          <a
                            href="https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            pages.stern.nyu.edu
                          </a>
                        </li>
                        <li>
                          <span className="font-bold">Country Risk-Premium:</span> Damodaran Online -{" "}
                          <a
                            href="https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            pages.stern.nyu.edu
                          </a>
                        </li>
                      </ul>
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
    </>
  );
}
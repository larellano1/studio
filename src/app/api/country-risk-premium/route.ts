import { logToFile } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

interface CountryRiskPremium {
  [country: string]: number;
}

const mockCountryRiskPremiums: CountryRiskPremium = {
  "Brazil": 0.02,
  "Canada": 0.0,
  "USA": 0.0,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const countries: string[] = body.countries;

    //logToFile(countries.toString());
    if (!Array.isArray(countries)) {
      return NextResponse.json({ error: "Invalid input: 'countries' should be an array." }, { status: 400 });
    }

    var risk = -1.0;
    const notFoundCountries: string[] = [];

    for (const country of countries) {
      if (mockCountryRiskPremiums.hasOwnProperty(country)) {
        risk = mockCountryRiskPremiums[country];
      } else {
        notFoundCountries.push(country);
      }
    }

    if (notFoundCountries.length > 0) {
      return NextResponse.json({ error: `Countries not found: ${notFoundCountries.join(", ")}` }, { status: 404 });
    }
    

    return NextResponse.json(risk, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
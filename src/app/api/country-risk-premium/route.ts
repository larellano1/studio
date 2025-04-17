import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { logToFile } from '@/utils/logger';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');

    if (!country) {
        return NextResponse.json({ error: 'Country is required' }, { status: 400 });
    }

    try {
        const risk = await getCountryRiskPremium(country);
        if (risk === null) {
            return NextResponse.json({ error: 'Country not found in data' }, { status: 404 });
        }
        return NextResponse.json({ risk }, { status: 200 });
    } catch (error: any) {
        logToFile('Error fetching CPR:' + error);
        return NextResponse.json({ error: 'Failed to fetch unlevered beta' }, { status: 500 });
    }
}

async function getCountryRiskPremium(country: string): Promise<number | null> {
    const url = 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html';

    const mappedCountry = country;
    if (!mappedCountry) {
        logToFile(`Country ${country} not found in mapping`);
        return null;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const html = await response.text();
        //logToFile(`HTML: ${html}`);
        const $ = cheerio.load(html);
        
        let risk: number | null = null;

        const tables = $('table');

        const table = $('table').eq(1);  
        table.find('tbody tr').each((_, row) => {
          const rowData = $(row).find('td').map((_, el) => $(el).text().trim()).get();
          if(rowData.includes(country)){
          const countryNameIndex = rowData.indexOf(country);
          const countryPremiumRiskIndex = 3;
          logToFile(`Country: ${rowData[countryNameIndex]}, CPR: ${rowData[countryPremiumRiskIndex]}`);
          if (rowData[countryNameIndex] === country) {
            risk = parseFloat(rowData[countryPremiumRiskIndex]);
            return false; 
            }
          }
          });
          return risk/100; 
        return risk;
    } catch (error: any) {
        logToFile('Error parsing HTML:' + error);
        throw new Error('Failed to parse data from Damodaran website');
    }
}
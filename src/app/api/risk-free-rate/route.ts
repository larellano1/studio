import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse';

export async function GET(request: NextRequest) {
  try {
    const url =
      'https://query1.finance.yahoo.com/v7/finance/download/%5ETNX?range=1d&interval=1d&events=history&includeAdjustedClose=true';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const csvData = await response.text();
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });

    const latest = records[records.length - 1];
    const rate = parseFloat(latest.Close) / 100;

    return NextResponse.json({ rate });
  } catch (error) {
    console.error('Error fetching risk-free rate:', error);
    return NextResponse.json({ rate: -1000.0 }, { status: 500 });
  }
}
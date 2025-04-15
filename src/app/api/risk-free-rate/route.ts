import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const url =
      'https://query1.finance.yahoo.com/v7/finance/download/%5ETNX?period1=1672531200&period2=1704067200&interval=1d&events=history&includeAdjustedClose=true';
    const response = await axios.get(url);
    const csvData = response.data;

    // Parse CSV data (crude parsing for demonstration)
    const lines = csvData.split('\n');
    const data = lines.slice(1, lines.length - 1).map((line) => {
      const values = line.split(',');
      return {
        date: values[0],
        open: parseFloat(values[1]),
        high: parseFloat(values[2]),
        low: parseFloat(values[3]),
        close: parseFloat(values[4]),
        adjClose: parseFloat(values[5]),
        volume: parseInt(values[6]),
      };
    });

    const rate = data[data.length - 1].close / 100;

    return NextResponse.json({ rate });
  } catch (error) {
    console.error('Error fetching risk-free rate:', error);
    return NextResponse.json({ rate: 0.0384 }, { status: 500 }); // Use default value as fallback
  }
}
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.FRED_API_KEY;
    if (!apiKey) {
      throw new Error('FRED_API_KEY environment variable not set.');
    }

    const apiUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=${apiKey}&file_type=json`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data from FRED: ${response.statusText}`);
    }

    const data = await response.json();
    const observations = data.observations;

    if (!observations || observations.length === 0) {
      throw new Error('No observations found in FRED data.');
    }

    // Filter observations for valid values within the last 10 years
    const validObservations = observations.filter((obs: any) => obs.value !== '.');

    // Extract rates and calculate the average
    const totalRate = validObservations.reduce((sum: number, obs: any) => sum + parseFloat(obs.value), 0);
    const averageRate = totalRate / validObservations.length;
    
    // Return -1.0 if averageRate is NaN
    if (isNaN(averageRate)) {
      return NextResponse.json({ rate: -1.0 });
    }
    // Convert to decimal (from percentage)
    const decimalAverageRate = averageRate / 100;
    return NextResponse.json({ rate: decimalAverageRate });
  } catch (error) {
    console.error('Error fetching or calculating risk-free rate:', error);
    return NextResponse.json(
      { error: 'Failed to calculate risk-free rate.', rate: -1.0 },
      { status: 500 }
    );
}
}
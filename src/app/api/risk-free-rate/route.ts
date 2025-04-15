import { NextRequest, NextResponse } from 'next/server';
import yf from 'yfinance';

export async function GET(request: NextRequest) {
  try {
    const ticker = yf.getTicker('^TNX');
    const history = await ticker.history({ period: '1d' });
    const latestValue = history.values().next().value;
    const rate = latestValue.close / 100;

    return NextResponse.json({ rate });
  } catch (error) {
    console.error('Error fetching risk-free rate:', error);
    return NextResponse.json({ rate: -1000.0 }, { status: 500 });
  }
}
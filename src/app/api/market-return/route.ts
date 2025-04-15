import { NextResponse } from 'next/server';
import { parse } from 'csv-parse';

export async function GET() {
  try {
    const csvUrl = 'https://finance.yahoo.com/quote/%5EGSPC/history/?frequency=1mo&period1=1429056000&period2=1744737882';
    const response = await fetch(csvUrl);
    const csvData = await response.text();

    console.log(csvData);

    const records: { Close: string }[] = [];
    const parser = parse({ columns: true, skip_empty_lines: true });

    parser.on('readable', () => {
      let record;
      while ((record = parser.read()) !== null) {
        if (record.Close) {
          records.push(parseFloat(record.Close));
        }
      }
    });

    await new Promise((resolve, reject) => {
      parser.on('error', (err) => reject(err));
      parser.on('end', resolve);
      parser.write(csvData);
      parser.end();
    });

    const closePrices = records
      .slice(-120)
      .map(record => parseFloat(record.Close))
      .filter(price => !isNaN(price));


    if (closePrices.length < 120) {
      throw new Error('Not enough data points to calculate 10-year return.');
    }

    const initialValue = closePrices[0];
    const finalValue = closePrices[closePrices.length - 1];
    const totalReturn = (finalValue - initialValue) / initialValue;
    const numberOfYears = 10;
    const averageAnnualReturn = ((totalReturn + 1) ** (1 / numberOfYears)) - 1;

    return NextResponse.json({ rate: averageAnnualReturn });
  } catch (error) {
    console.error('Error fetching or calculating SP500 average annual return:', error);
    return NextResponse.json({ rate: -2.0 }, { status: 500 });
  }
}
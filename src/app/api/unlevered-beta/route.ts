import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { logToFile } from '@/utils/logger';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');

    if (!sector) {
        return NextResponse.json({ error: 'Sector parameter is required' }, { status: 400 });
    }

    try {
        const beta = await getUnleveredBeta(sector);
        if (beta === null) {
            return NextResponse.json({ error: 'Sector not found in data' }, { status: 404 });
        }
        return NextResponse.json({ beta }, { status: 200 });
    } catch (error: any) {
        logToFile('Error fetching unlevered beta:', error);
        return NextResponse.json({ error: 'Failed to fetch unlevered beta' }, { status: 500 });
    }
}

async function getUnleveredBeta(sector: string): Promise<number | null> {
    const url = 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html';

    const mappedSector = sector;
    if (!mappedSector) {
        logToFile(`Sector ${sector} not found in mapping`);
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
        
        let beta: number | null = null;
        $('table').each((_, table) => {
            const headers = $(table).find('tr td').map((_, el) => $(el).text().trim()).get();
            //logToFile(`Headers: ${headers}`);
            if (headers.includes('Industry Name') && headers.includes('Unlevered beta')) {
                //logToFile($(table).find('tbody tr').html())
                $(table).find('tbody tr').each((_, row) => {
                    const rowData = $(row).find('td').map((_, el) => $(el).text().trim()).get();
                    const industryNameIndex = headers.indexOf('Industry Name');
                    const unleveredBetaIndex = headers.indexOf('Unlevered beta');
                    logToFile(`Industry Name: ${rowData[industryNameIndex]}, Unlevered Beta: ${rowData[unleveredBetaIndex]}`);
                    if (rowData[industryNameIndex] === mappedSector) {
                        beta = parseFloat(rowData[unleveredBetaIndex]);
                        logToFile(`Industry Name: ${rowData[industryNameIndex]}`+`Beta: ${beta}`);
                        return false; 
                    }
                });
                return false; 
            }
        });
        return beta;
    } catch (error: any) {
        logToFile('Error parsing HTML:' + error);
        throw new Error('Failed to parse data from Damodaran website');
    }
}
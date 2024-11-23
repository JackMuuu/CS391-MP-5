import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { originalUrl, alias } = await req.json();

    if (!originalUrl || !alias) {
      return NextResponse.json(
        { message: 'Original URL and alias are required.' },
        { status: 400 }
      );
    }

    // Validate URL
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)' + 
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + 
        '((\\d{1,3}\\.){3}\\d{1,3}))' + 
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
        '(\\?[;&a-z\\d%_.~+=-]*)?' + 
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );

    if (!urlPattern.test(originalUrl)) {
      return NextResponse.json({ message: 'Invalid URL.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(); 
    const collection = db.collection('urls');

    // Check if alias already exists
    const existing = await collection.findOne({ alias });
    if (existing) {
      return NextResponse.json({ message: 'Alias already taken.' }, { status: 400 });
    }

    // Insert new URL mapping
    await collection.insertOne({ alias, originalUrl });

    return NextResponse.json({ message: 'URL shortened successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
  }
}
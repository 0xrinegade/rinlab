import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Rinlab API',
    version: '0.3.1',
    status: 'operational'
  });
}
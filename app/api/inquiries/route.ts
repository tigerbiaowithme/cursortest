import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import { getClientIP, getCountryFromIP } from '@/lib/geoip';
import Analytics from '@/models/Analytics';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const ip = getClientIP(request);
    const country = getCountryFromIP(ip);

    // 记录访问统计
    await Analytics.create({
      page: '/contact',
      ipAddress: ip,
      country: country,
      date: new Date(),
    });

    const inquiry = await Inquiry.create({
      ...body,
      ipAddress: ip,
      country: country,
    });

    return NextResponse.json(
      { success: true, inquiry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Inquiry creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filter: any = {};
    if (status === 'unread') filter.read = false;
    if (status === 'read') filter.read = true;
    if (status === 'replied') filter.replied = true;

    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Inquiry.countDocuments(filter);

    return NextResponse.json({
      inquiries,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Inquiry fetch error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

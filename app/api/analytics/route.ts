import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Analytics from '@/models/Analytics';
import Inquiry from '@/models/Inquiry';
import { getClientIP, getCountryFromIP } from '@/lib/geoip';

// 记录页面访问
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const ip = getClientIP(request);
    const country = getCountryFromIP(ip);

    await Analytics.create({
      page: body.page || '/',
      ipAddress: ip,
      country: country,
      userAgent: request.headers.get('user-agent') || '',
      referrer: request.headers.get('referer') || '',
      language: body.language || 'en',
      date: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 获取统计数据
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // day, week, month, year

    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // 询盘数
    const inquiryCount = await Inquiry.countDocuments({
      createdAt: { $gte: startDate },
    });

    // 访问量统计
    const visitStats = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // 热门页面
    const topPages = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$page',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // 国家分布
    const countryStats = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // 月访问量
    const monthlyVisits = await Analytics.countDocuments({
      date: {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    });

    // 日访问量
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyVisits = await Analytics.countDocuments({
      date: { $gte: today },
    });

    return NextResponse.json({
      inquiryCount,
      monthlyVisits,
      dailyVisits,
      visitStats,
      topPages,
      countryStats,
    });
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

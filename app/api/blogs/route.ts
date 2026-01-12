import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { generateSlug } from '@/lib/utils';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filter: any = {};
    if (published === 'true') {
      filter.published = true;
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    return NextResponse.json({
      blogs,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    await connectDB();

    if (!user.permissions.blogs) {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const slug = body.slug || generateSlug(body.title);

    // 确保slug唯一
    let uniqueSlug = slug;
    let counter = 1;
    while (await Blog.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const blog = await Blog.create({
      ...body,
      slug: uniqueSlug,
      author: user.userId,
      publishedAt: body.published ? new Date() : undefined,
    });

    return NextResponse.json(
      { success: true, blog },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Blog creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});

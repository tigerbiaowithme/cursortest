import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 如果是根路径，重定向到默认语言
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  // 允许访问 API 路由和管理后台
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // 处理没有语言前缀的常见路径（重定向到默认语言）
  const commonPaths = ['/home', '/products', '/about', '/news', '/contact'];
  if (commonPaths.includes(pathname)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  // 检查是否已经是语言路径
  const localePattern = /^\/(en|ar|vi)(\/|$)/;
  if (!localePattern.test(pathname)) {
    // 如果不是语言路径，重定向到默认语言
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (favicon文件)
     * - public 文件夹
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

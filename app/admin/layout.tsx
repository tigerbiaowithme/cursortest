'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token || !userData) {
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      return;
    }

    setUser(JSON.parse(userData));
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  const navItems = [
    { href: '/admin/dashboard', label: '数据统计', icon: '📊', permission: 'dashboard' },
    { href: '/admin/inquiries', label: '询盘管理', icon: '📧', permission: 'inquiries' },
    { href: '/admin/blogs', label: '博客管理', icon: '📝', permission: 'blogs' },
    { href: '/admin/ai-marketing', label: 'AI营销宝', icon: '🤖', permission: 'aiMarketing' },
  ].filter(item => user.permissions[item.permission as keyof typeof user.permissions]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">Devos 管理后台</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === item.href
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">欢迎, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

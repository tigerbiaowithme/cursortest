'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'vi', name: 'Tiếng Việt' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // 从 URL 路径中提取当前语言
  const getCurrentLang = () => {
    const match = pathname.match(/^\/(en|ar|vi)/);
    return match ? match[1] : 'en';
  };
  
  const [currentLang, setCurrentLang] = useState(getCurrentLang());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 当路径改变时，更新当前语言
  useEffect(() => {
    const lang = getCurrentLang();
    setCurrentLang(lang);
  }, [pathname]);

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
    // 替换路径中的语言部分
    let newPath = pathname.replace(/^\/(en|ar|vi)/, `/${lang}`);
    // 如果没有语言前缀（例如在首页），直接添加
    if (!newPath.startsWith(`/${lang}`)) {
      newPath = `/${lang}${newPath}`;
    }
    router.push(newPath || `/${lang}`);
  };

  const navItems = [
    { path: '', label: { en: 'Home', ar: 'الرئيسية', vi: 'Trang chủ' } },
    { path: '/products', label: { en: 'Products', ar: 'المنتجات', vi: 'Sản phẩm' } },
    { path: '/about', label: { en: 'About Us', ar: 'من نحن', vi: 'Về chúng tôi' } },
    { path: '/news', label: { en: 'Latest News', ar: 'آخر الأخبار', vi: 'Tin tức mới nhất' } },
    { path: '/contact', label: { en: 'Contact Us', ar: 'اتصل بنا', vi: 'Liên hệ' } },
  ];

  const isRTL = currentLang === 'ar';

  return (
    <nav className={`bg-white shadow-lg ${isRTL ? 'rtl' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={`/${currentLang}`} className="text-2xl font-bold text-primary-600">
              Devos
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={`/${currentLang}${item.path}`}
                className="text-gray-700 hover:text-primary-600 transition"
              >
                {item.label[currentLang as keyof typeof item.label]}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={currentLang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={`/${currentLang}${item.path}`}
                className="block py-2 text-gray-700 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label[currentLang as keyof typeof item.label]}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

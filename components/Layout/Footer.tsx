'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  // 从 URL 路径中提取当前语言
  const getCurrentLang = () => {
    const match = pathname.match(/^\/(en|ar|vi)/);
    return match ? match[1] : 'en';
  };
  
  const currentLang = getCurrentLang();

  const footerLinks = [
    { path: '', label: { en: 'Home', ar: 'الرئيسية', vi: 'Trang chủ' } },
    { path: '/products', label: { en: 'Products', ar: 'المنتجات', vi: 'Sản phẩm' } },
    { path: '/about', label: { en: 'About Us', ar: 'من نحن', vi: 'Về chúng tôi' } },
    { path: '/news', label: { en: 'Latest News', ar: 'آخر الأخبار', vi: 'Tin tức mới nhất' } },
    { path: '/contact', label: { en: 'Contact Us', ar: 'اتصل بنا', vi: 'Liên hệ' } },
  ];

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href={`/${currentLang}`} className="text-xl font-bold mb-4 block hover:text-gray-300">
              Devos
            </Link>
            <p className="text-gray-400">Your trusted business partner</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.slice(0, 3).map((link) => (
                <li key={link.path}>
                  <Link 
                    href={`/${currentLang}${link.path}`} 
                    className="hover:text-white transition"
                  >
                    {link.label[currentLang as keyof typeof link.label]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">Email: info@devos.com</p>
            <p className="text-gray-400">Phone: +1 234 567 890</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Devos. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

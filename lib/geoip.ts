export function getCountryFromIP(ip: string): string {
  // 处理本地IP
  if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return 'US'; // 默认返回美国
  }

  try {
    // 动态导入以避免构建时加载数据文件
    const geoip = require('geoip-lite');
    const geo = geoip.lookup(ip);
    if (geo) {
      return geo.country;
    }
  } catch (error) {
    console.error('GeoIP lookup error:', error);
  }
  return 'US'; // 默认返回美国
}

export function getLanguageFromCountry(country: string): string {
  // 根据国家代码返回对应语言
  const countryToLanguage: { [key: string]: string } = {
    'SA': 'ar', // 沙特阿拉伯 - 阿拉伯语
    'AE': 'ar', // 阿联酋 - 阿拉伯语
    'EG': 'ar', // 埃及 - 阿拉伯语
    'IQ': 'ar', // 伊拉克 - 阿拉伯语
    'JO': 'ar', // 约旦 - 阿拉伯语
    'LB': 'ar', // 黎巴嫩 - 阿拉伯语
    'SY': 'ar', // 叙利亚 - 阿拉伯语
    'VN': 'vi', // 越南 - 越南语
    'US': 'en', // 美国 - 英语
    'GB': 'en', // 英国 - 英语
    'CA': 'en', // 加拿大 - 英语
    'AU': 'en', // 澳大利亚 - 英语
  };

  return countryToLanguage[country] || 'en'; // 默认英语
}

export function getClientIP(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress || req.socket.remoteAddress;
  return ip || '127.0.0.1';
}

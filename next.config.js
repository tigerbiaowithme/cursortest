/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // 禁用静态优化，因为我们需要动态渲染
  output: 'standalone',
}

module.exports = nextConfig

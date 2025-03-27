/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  // 配置域名重写规则
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*'
      }
    ]
  }
}

module.exports = nextConfig 
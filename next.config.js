/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com', 'leo56.tech', 'www.leo56.tech'],
    unoptimized: true
  },
  // 禁用基本路径
  basePath: '',
  // 禁用资源前缀
  assetPrefix: undefined,
  // 简化路由配置
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  // 配置域名
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          destination: '/:path*',
          has: [
            {
              type: 'host',
              value: 'www.leo56.tech',
            },
          ],
        },
      ],
    }
  }
}

module.exports = nextConfig 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  // 配置基本路径
  basePath: '',
  // 配置资源前缀
  assetPrefix: '',
  // 配置重写规则
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          destination: '/:path*',
        }
      ],
      afterFiles: [],
      fallback: []
    }
  }
}

module.exports = nextConfig 
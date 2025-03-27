/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  // 禁用基本路径
  basePath: '',
  // 禁用资源前缀
  assetPrefix: undefined,
  // 简化路由配置
  trailingSlash: false,
  skipTrailingSlashRedirect: true
}

module.exports = nextConfig 
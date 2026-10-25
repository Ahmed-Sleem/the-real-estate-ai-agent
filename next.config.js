/** @type {import('next').NextConfig} */
const isPages = process.env.PAGES_BUILD === '1';
const basePath = isPages ? (process.env.PAGES_BASE_PATH || '') : '';
const nextConfig = {
  reactStrictMode: true,
  ...(isPages ? { output: 'export', basePath, assetPrefix: basePath ? basePath + '/' : undefined, env: { NEXT_PUBLIC_BASE_PATH: basePath } } : {}),
  images: { unoptimized: true },
  ...(isPages ? {} : {
    async rewrites() {
      const apiUrl = process.env.API_INTERNAL_URL || 'http://127.0.0.1:8000';
      return [{ source: '/api/v1/:path*', destination: `${apiUrl}/api/v1/:path*` }];
    }
  })
};
module.exports = nextConfig;

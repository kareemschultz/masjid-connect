/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pg', 'web-push', 'node-cron', 'adhan'],
}

// Enable standalone output only for Docker builds
if (process.env.DOCKER_BUILD === '1') {
  nextConfig.output = 'standalone'
}

export default nextConfig

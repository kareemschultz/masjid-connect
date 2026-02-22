/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

// Enable standalone output only for Docker builds
if (process.env.DOCKER_BUILD === '1') {
  nextConfig.output = 'standalone'
}

export default nextConfig

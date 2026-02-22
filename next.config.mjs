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
  async redirects() {
    return [
      { source: '/adhkar',    destination: '/explore/adhkar',    permanent: true },
      { source: '/duas',      destination: '/explore/duas',      permanent: true },
      { source: '/events',    destination: '/explore/events',    permanent: true },
      { source: '/madrasa',   destination: '/explore/madrasa',   permanent: true },
      { source: '/qibla',     destination: '/explore/qibla',     permanent: true },
      { source: '/resources', destination: '/explore/resources', permanent: true },
      { source: '/tasbih',    destination: '/explore/tasbih',    permanent: true },
      { source: '/zakat',     destination: '/explore/zakat',     permanent: true },
      { source: '/fasting',   destination: '/tracker/fasting',   permanent: true },
      { source: '/names',     destination: '/explore/names',     permanent: true },
      { source: '/buddy/how-it-works', destination: '/explore/buddy/how-it-works', permanent: true },
      { source: '/tracker',   destination: '/tracker',         permanent: false },
    ]
  },
}

export default nextConfig

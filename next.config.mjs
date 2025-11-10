/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['static.exercisedb.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.exercisedb.dev',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
}

export default nextConfig

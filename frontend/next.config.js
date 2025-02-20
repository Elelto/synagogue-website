/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  images: {
    unoptimized: true
  },
  // הוספת קונפיגורציית פורט
  server: {
    port: 3003
  }
}

module.exports = nextConfig

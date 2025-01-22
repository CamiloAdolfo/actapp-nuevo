/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ["sqlite3"],
  },
}

module.exports = nextConfig


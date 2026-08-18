/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        // Temporary: real TSU campus photos hotlinked from the live site
        // as placeholders until they're re-uploaded through Sanity Studio.
        // Safe to remove once every image below comes from Sanity instead.
        protocol: 'https',
        hostname: 'www.tsuniversity.edu.ng',
      },
    ],
  },
}

module.exports = nextConfig

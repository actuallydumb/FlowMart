const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "github.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "uploadthing.com",
    ],
  },
  // Enable standalone output for Docker
  output: "standalone",
  // Optimize for production
  swcMinify: true,
  // Enable compression
  compress: true,
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Ensure PostCSS plugins are properly resolved
    config.resolve.alias = {
      ...config.resolve.alias,
      autoprefixer: require.resolve("autoprefixer"),
      postcss: require.resolve("postcss"),
    };

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);

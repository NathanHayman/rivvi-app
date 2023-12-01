const path = require("path");
const { NormalModuleReplacementPlugin } = require("webpack");

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    useDeploymentId: true,
    useDeploymentIdServerActions: true,
    taint: true,
    serverActions: {
      allowedOrigins: [
        "app.localhost:8888",
        "localhost:8888",
        "app.rivvi.io",
        "rivvi.io",
      ],
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        // temp fix for react-email bug: https://github.com/resendlabs/react-email/issues/868#issuecomment-1782771917
        new NormalModuleReplacementPlugin(
          /email\/render/,
          path.resolve(__dirname, "./renderEmailFix.js"),
        ),
      );
    }

    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    return config;
  },
  images: {
    remotePatterns: [
      { hostname: "cdn.sanity.io" },
      { hostname: "source.unsplash.com" },
      { hostname: "www.google.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "pbs.twimg.com" },
      { hostname: "d2vwwcvoksz7ty.cloudfront.net" },
      { hostname: "res.cloudinary.com" },
      { hostname: "api.dicebear.com" },
      { hostname: "faisalman.github.io" },
      { hostname: "avatar.vercel.sh" },
      { hostname: "media.cleanshot.cloud" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

module.exports = config;

const path = require("path");
const { NormalModuleReplacementPlugin } = require("webpack");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  experimental: {
    useDeploymentId: true,
    useDeploymentIdServerActions: true,
    taint: true,
  },
  webpack: (
    config, {
        buildId,
        dev,
        isServer,
        defaultLoaders,
        nextRuntime,
        webpack
    }
) => {
    config.plugins = config.plugins || []
    config.plugins.push(new NormalModuleReplacementPlugin(
        /email\/render/,
        path.resolve(__dirname, "./renderEmailFix.js"),
    ))
    // Important: return the modified config
    return config
},
  images: {
    domains: [
      "www.google.com",
      "avatar.vercel.sh",
      "faisalman.github.io",
      "api.dicebear.com",
      "res.cloudinary.com",
      "pbs.twimg.com",
      "d2vwwcvoksz7ty.cloudfront.net",
      "lh3.googleusercontent.com",
      "media.cleanshot.cloud", // only for staging purposes
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

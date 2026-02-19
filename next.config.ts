// import type { NextConfig } from "next";
// import withSvgr from "next-plugin-svgr";

// const nextConfig: NextConfig = {
//   experimental: {
//     turbo: undefined,  // Disables Turbopack
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '1337', // Add the port if your Strapi server is running on a specific port
//         pathname: '/uploads/**', // Adjust the pathname to match your image paths
//       },
//     ],
//   },
//   // Other configuration options
// };

// // Wrap the configuration with the SVGR plugin
// export default withSvgr(nextConfig);

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: undefined, // Disables Turbopack
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337", // Add the port if your Strapi server is running on a specific port
        pathname: "/uploads/**", // Adjust the pathname to match your image paths
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/, // Match .svg files
      use: [
        {
          loader: "@svgr/webpack", // Use @svgr/webpack loader
          options: {
            icon: true, // Optional: Enable icon mode
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;

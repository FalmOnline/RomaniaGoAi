// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: {
//     turbo: undefined,  // Disables Turbopack
//   },
//   // Other configuration options
// };

// export default nextConfig;





// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: {
//     turbo: undefined,  // Disables Turbopack
//   },
//   images: {
//     domains: ['localhost'], // Add your Strapi server hostname here
//   },
//   // Other configuration options
// };

// export default nextConfig;



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: undefined,  // Disables Turbopack
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337', // Add the port if your Strapi server is running on a specific port
        pathname: '/uploads/**', // Adjust the pathname to match your image paths
      },
    ],
  },
  // Other configuration options
};

export default nextConfig;
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//     images: {
      
//     domains: ['api.dicebear.com'],
//   },
//     transpilePackages: ["next-auth"],

// };

// export default nextConfig;



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ["next-auth"],
};

export default nextConfig;
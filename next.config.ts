import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "content.carlelo.com",
    },
    {
      protocol: "https",
      hostname: "imgd.aeplcdn.com",
    },
    {
      protocol: "https",
      hostname: "stimg.cardekho.com",
    },

     {
        protocol: "https",
        hostname: "imgd.aeplcdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
  ],
},
};

export default nextConfig;



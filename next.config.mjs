/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.pinterest.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "inc42.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "akm-img-a-in.tosshub.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.smbindia.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.indianexpress.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "staticimg.amarujala.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.jagranjosh.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.wisden.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com;" },
        ],
      },
    ];
  },
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

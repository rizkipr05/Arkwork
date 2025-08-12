/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy FE -> BE (hindari CORS)
  async rewrites() {
    return [
      {
        source: "/api/news/:path*",
        destination: "http://localhost:4000/api/news/:path*",
      },
    ];
  },

  images: {
    // Izinkan semua domain gambar (praktis untuk banyak media).
    // Jika ingin lebih ketat, ganti dengan whitelist hostname spesifik.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],

    // Sementara matikan optimasi Next Image untuk menghindari error upstream saat debug.
    // Jika semua sudah stabil, ubah ke `false` atau hapus properti ini.
    unoptimized: true,
  },
};

export default nextConfig;

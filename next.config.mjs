/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  experimental: {
    serverComponentsExternalPackages: [],
    esmExternals: 'loose',
  },
  transpilePackages: [],
  webpack: (config) => {
    config.externals = [...(config.externals || []), { 'utf-8-validate': 'commonjs utf-8-validate' }];
    return config;
  },
};

export default nextConfig;
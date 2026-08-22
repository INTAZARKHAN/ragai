import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'scripts'],
  },
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
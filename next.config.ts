// next.config.js
import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude node_sleep.node from being processed by Webpack
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // Important: Return the modified config
    return config;
  },
};

export default nextConfig;
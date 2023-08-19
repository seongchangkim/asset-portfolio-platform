/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});



const nextConfig = {
  reactStrictMode: false,
  compress: true,
  images: {
    domains: ['firebasestorage.googleapis.com']
  }
  // webpack : (config, {webpack}) => {
  //   return {
  //     ...config,
  //     plugins:[
  //       ...config.plugins,
  //       new webpack.ContextReplacementPlugin(/moment[/\\]locale$/,/^\.\/ko$/)
  //     ]
  //   }
  // }
}

export default bundleAnalyzer(nextConfig);

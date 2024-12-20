import config from './package.json' with {type: 'json'};

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    distDir: 'dist',
    experimental: {
        after: true,
        serverActions: {
            bodySizeLimit: '1gb',
        },
    },
    publicRuntimeConfig: {
        version: config.version,
        author: config.author,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'radar.weather.gov',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;

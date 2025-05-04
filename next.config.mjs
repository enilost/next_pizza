/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[{
            protocol: 'https',
            hostname:'media.dodostatic.net'
        }]
    },
    reactStrictMode: false,
};

export default nextConfig;

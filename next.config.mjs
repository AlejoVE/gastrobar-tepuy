/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		domains: ['blob.v0.dev'],
		unoptimized: true,
	},
	experimental: {
		optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion', '@radix-ui/react-icons'],
	},
};

export default nextConfig;

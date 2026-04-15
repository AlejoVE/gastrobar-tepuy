import type React from 'react';
import Script from 'next/script';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Providers } from './Providers';

export const metadata: Metadata = {
	title: 'Gastrobar Tepuy - Restaurante Venezolano',
	description: 'Una experiencia culinaria única en el corazón de Caracas',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='es' suppressHydrationWarning>
			<body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
				<Providers attribute='class' defaultTheme='system' enableSystem>
					{children}
				</Providers>

				<elevenlabs-convai agent-id='agent_3201kn26q9byfnr9xjdt9hjzsh72'></elevenlabs-convai>
				<Script src='https://unpkg.com/@elevenlabs/convai-widget-embed' strategy='lazyOnload' />
			</body>
		</html>
	);
}

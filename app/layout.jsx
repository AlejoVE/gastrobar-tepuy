import Script from 'next/script';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Providers } from './Providers';
import './globals.css';

export const metadata = {
	title: 'Gastrobar Tepuy - Restaurante Venezolano',
	description: 'Una experiencia culinaria única en el corazón de Caracas',
};

export default function RootLayout({ children }) {
	return (
		// suppressHydrationWarning es vital aquí para que next-themes (Providers) no de errores al recargar
		<html lang='es' suppressHydrationWarning>
			<body
				className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
			>
				<Providers attribute='class' defaultTheme='system' enableSystem>
					{children}
				</Providers>

				{/* Widget de Asistente de IA de Voz (ElevenLabs) */}
				{/* <elevenlabs-convai agent-id='agent_3201kn26q9byfnr9xjdt9hjzsh72'></elevenlabs-convai> */}
				{/* <Script src='https://unpkg.com/@elevenlabs/convai-widget-embed' strategy='lazyOnload' /> */}
			</body>
		</html>
	);
}

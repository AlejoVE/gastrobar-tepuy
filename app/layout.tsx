import type React from 'react';
import Script from 'next/script'; // ¡Ahora sí lo vamos a usar!
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

// Revisa el nombre y la ruta de tu CSS. Lo he cambiado a index.css basándome en tu captura anterior,
// pero ajústalo si se llama diferente o está en otra carpeta (ej. '../index.css').
// import './index.css';

export const metadata: Metadata = {
	title: 'Gastrobar Tepuy - Restaurante Venezolano',
	description: 'Una experiencia culinaria única en el corazón de Caracas',
	generator: 'v0.dev',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='es' suppressHydrationWarning>
			<head>
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
				<link
					href='https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap'
					rel='stylesheet'
				/>
				{/* ¡ELIMINAMOS LA ETIQUETA <style>! 
                  Ese era el causante del Error de Hidratación.
                */}
			</head>

			{/* Pasamos las variables de Geist directamente a las clases del body */}
			<body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
				{children}

				{/* Widget de Voz de ElevenLabs */}
				<elevenlabs-convai agent-id='agent_3201kn26q9byfnr9xjdt9hjzsh72'></elevenlabs-convai>

				{/* Usamos el componente nativo de Next.js para optimizar la carga del script */}
				<Script src='https://unpkg.com/@elevenlabs/convai-widget-embed' strategy='lazyOnload' />
			</body>
		</html>
	);
}

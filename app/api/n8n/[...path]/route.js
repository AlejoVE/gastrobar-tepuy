import { NextResponse } from 'next/server';

// Función central que intercepta todas las peticiones (GET y POST)
async function proxyRequest(request, { params }) {
	// 1. Reconstruimos la ruta final (ej: ['magic-link', 'modify'] -> 'magic-link-modify')
	const endpoint = params.path.join('/');

	// 2. Traemos las variables secretas
	const baseUrl = process.env.N8N_BASE_URL;
	const apiKey = process.env.N8N_SECRET_API_KEY;

	// 3. Extraemos cualquier parámetro de la URL (como ?date=...&guests=...)
	const url = new URL(request.url);
	const searchParams = url.searchParams.toString();
	const targetUrl = `${baseUrl}/${endpoint}${searchParams ? `?${searchParams}` : ''}`;

	// 4. Preparamos las cabeceras (Headers) inyectando nuestra llave maestra
	const options = {
		method: request.method,
		headers: {
			'x-api-key': apiKey,
			// Pasamos el Content-Type original si existe (vital para los POST)
			...(request.headers.get('content-type') && { 'Content-Type': request.headers.get('content-type') }),
		},
	};

	// 5. Si es un POST, leemos el body que mandó tu frontend y se lo pasamos a n8n
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		const body = await request.text();
		if (body) options.body = body;
	}

	try {
		// 6. El servidor hace la petición a n8n (El navegador del usuario no ve esto)
		const response = await fetch(targetUrl, options);

		// 7. Devolvemos exactamente lo que n8n respondió
		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error(`Error en el Proxy hacia n8n (${endpoint}):`, error);
		return NextResponse.json({ error: 'Error interno conectando con el servidor de reservas.' }, { status: 500 });
	}
}

// Exportamos la función para que acepte tanto peticiones GET como POST
export const GET = proxyRequest;
export const POST = proxyRequest;

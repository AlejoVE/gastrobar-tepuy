import { NextResponse } from 'next/server';

async function proxyRequest(request, { params }) {
	const endpoint = params.path.join('/');
	const baseUrl = process.env.N8N_BASE_URL;

	// 1. Preparamos las cabeceras base (dejamos el Content-Type intacto)
	const headers = {
		...(request.headers.get('content-type') && { 'Content-Type': request.headers.get('content-type') }),
	};

	// 🚨 2. BIFURCACIÓN DE RUTAS Y LLAVES 🚨
	if (endpoint.startsWith('admin')) {
		// --- RUTA PROTEGIDA (DASHBOARD) ---

		// A. Validamos la Llave Humana primero
		const clientPassword = request.headers.get('x-admin-password');
		const realPassword = process.env.ADMIN_API_KEY;

		console.log(clientPassword, realPassword);

		if (!clientPassword || clientPassword !== realPassword) {
			console.warn(`Intento bloqueado en ruta admin: ${endpoint}`);
			return NextResponse.json({ error: 'Acceso denegado. Contraseña incorrecta.' }, { status: 401 });
		}

		// B. Si el humano es válido, inyectamos la Llave de Máquina de Admin
		headers['x-admin-api-key'] = process.env.N8N_SECRET_ADMIN_API_KEY;
	} else {
		// --- RUTA PÚBLICA (CANCELAR/MODIFICAR) ---

		// Inyectamos la Llave de Máquina Pública (no requiere contraseña humana)
		headers['x-api-key'] = process.env.N8N_SECRET_API_KEY;
	}

	// 3. Extraemos parámetros de la URL y armamos el destino final
	const url = new URL(request.url);
	const searchParams = url.searchParams.toString();
	const targetUrl = `${baseUrl}/${endpoint}${searchParams ? `?${searchParams}` : ''}`;

	// 4. Preparamos las opciones de fetch con las cabeceras que decidimos arriba
	const options = {
		method: request.method,
		headers: headers,
	};

	// 5. Si es un POST o PATCH, pasamos el body
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		const body = await request.text();
		if (body) options.body = body;
	}

	try {
		// 6. El servidor hace la petición a n8n
		const response = await fetch(targetUrl, options);

		// 🚨 LEEMOS EL TEXTO CRUDO PRIMERO
		const rawText = await response.text();

		let data;
		try {
			// Intentamos convertirlo a JSON
			data = JSON.parse(rawText);
		} catch (parseError) {
			// Si falla, significa que n8n nos mandó texto plano (probablemente un error de Auth o un 404)
			console.error(
				`❌ n8n no devolvió JSON en ${endpoint}. Código HTTP: ${response.status}. Respuesta cruda:`,
				rawText,
			);
			return NextResponse.json(
				{ error: 'Respuesta inválida del servidor de reservas.', details: rawText },
				{ status: response.status },
			);
		}

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error(`Error en el Proxy hacia n8n (${endpoint}):`, error);
		return NextResponse.json({ error: 'Error interno conectando con el servidor.' }, { status: 500 });
	}
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;

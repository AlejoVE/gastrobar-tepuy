// utils/dateUtils.js

export const getMinDate = () => {
	const limitTimeObj = new Date();
	limitTimeObj.setMinutes(limitTimeObj.getMinutes() + 30); // 30 min de margen por defecto

	const options = { timeZone: 'Europe/Madrid', hour12: false };
	const spainDateStr = limitTimeObj.toLocaleDateString('en-CA', options); // YYYY-MM-DD
	const limitTime = limitTimeObj.toLocaleTimeString('es-ES', options).substring(0, 5); // HH:MM

	const ULTIMO_SLOT = '22:30';
	const minDateObj = new Date(spainDateStr);
	minDateObj.setHours(0, 0, 0, 0);

	if (limitTime > ULTIMO_SLOT) {
		minDateObj.setDate(minDateObj.getDate() + 1);
	}

	return minDateObj;
};

/**
 * Evalúa si una hora ya pasó, aplicando un margen de seguridad.
 * A prueba de fallos de zona horaria y navegadores.
 */
export const isTimeSlotPast = (selectedDateInput, slotTimeStr, marginMinutes = 30) => {
	if (!selectedDateInput || !slotTimeStr) return false;

	// 1. Extraemos la fecha exacta que seleccionó el usuario (YYYY-MM-DD)
	let selectedDateStr = '';
	if (selectedDateInput instanceof Date) {
		const y = selectedDateInput.getFullYear();
		const m = String(selectedDateInput.getMonth() + 1).padStart(2, '0');
		const d = String(selectedDateInput.getDate()).padStart(2, '0');
		selectedDateStr = `${y}-${m}-${d}`;
	} else {
		selectedDateStr = String(selectedDateInput).split('T')[0];
	}

	// 2. Calculamos qué hora es "ahora mismo" en España más el margen de seguridad
	const realNow = new Date();
	realNow.setMinutes(realNow.getMinutes() + marginMinutes);

	// Convertimos la hora de España a números exactos
	const spainDateString = realNow.toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
	const spainDate = new Date(spainDateString);

	const spainY = spainDate.getFullYear();
	const spainM = String(spainDate.getMonth() + 1).padStart(2, '0');
	const spainD = String(spainDate.getDate()).padStart(2, '0');
	const spainToday = `${spainY}-${spainM}-${spainD}`;

	// 3. REGLA A: Si la fecha seleccionada es de ayer o antes, bloqueamos todo
	if (selectedDateStr < spainToday) {
		return true;
	}

	// 4. REGLA B: Si la fecha seleccionada es exactamente HOY, comparamos minutos
	if (selectedDateStr === spainToday) {
		// Cuántos minutos han pasado desde las 00:00 hasta la hora límite en España
		const limitTotalMinutes = spainDate.getHours() * 60 + spainDate.getMinutes();

		// Cuántos minutos tiene el slot (ej: "18:30" -> 18 * 60 + 30 = 1110)
		const [slotHour, slotMinute] = slotTimeStr.split(':').map(Number);
		const slotTotalMinutes = slotHour * 60 + slotMinute;

		// Si el slot ocurre ANTES que la hora límite, está pasado (retorna true)
		return slotTotalMinutes < limitTotalMinutes;
	}

	// 5. REGLA C: Si es un día del futuro (ej. mañana), ninguna hora ha pasado
	return false;
};

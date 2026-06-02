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
 * @param {string} selectedDateStr - Fecha en formato 'YYYY-MM-DD'
 * @param {string} slotTimeStr - Hora en formato 'HH:MM'
 * @param {number} marginMinutes - Margen de seguridad (ej. 30 para nuevas, 60 para modificar)
 */
export const isTimeSlotPast = (selectedDateStr, slotTimeStr, marginMinutes = 30) => {
	if (!selectedDateStr || !slotTimeStr) return false;

	// 1. Calculamos la hora límite real en España con el margen proporcionado
	const limitTimeObj = new Date();
	limitTimeObj.setMinutes(limitTimeObj.getMinutes() + marginMinutes);

	const options = { timeZone: 'Europe/Madrid', hour12: false };
	const spainToday = limitTimeObj.toLocaleDateString('en-CA', options); // YYYY-MM-DD
	const limitTime = limitTimeObj.toLocaleTimeString('es-ES', options).substring(0, 5); // HH:MM

	// 2. Evaluamos usando comparación de Strings directa (Más seguro contra fallos de Timezone)
	if (selectedDateStr === spainToday) {
		return slotTimeStr < limitTime; // ¿La hora elegida es menor a la hora límite?
	}

	// Si por algún motivo la fecha es anterior a hoy, definitivamente ya pasó
	if (selectedDateStr < spainToday) {
		return true;
	}

	return false; // Si es mañana o más adelante, la hora es válida
};

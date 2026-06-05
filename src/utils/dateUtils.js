// utils/dateUtils.js

// This function is used by the calendar to determine which days to display as available or unavailable
export const getMinDate = () => {
	const limitTimeObj = new Date();

	// Take the current time and add 30 minutes. Security buffer t0o book a table
	limitTimeObj.setMinutes(limitTimeObj.getMinutes() + 30);

	const options = { timeZone: 'Europe/Madrid', hour12: false };
	const spainDateStr = limitTimeObj.toLocaleDateString('en-CA', options); // YYYY-MM-DD
	const limitTime = limitTimeObj.toLocaleTimeString('es-ES', options).substring(0, 5); // HH:MM

	const LAST_SLOT = '22:30';
	const minDateObj = new Date(spainDateStr);

	minDateObj.setHours(0, 0, 0, 0); // Time  00:00

	if (limitTime > LAST_SLOT) {
		// If the limitTime is later than the last available slot, add one more day, so the current day will be displayed as unavailable
		minDateObj.setDate(minDateObj.getDate() + 1);
	}

	return minDateObj;
};

/**
 * Checks whether a specific time has already passed, applying a safety margin.
 * Time zone and browser-agnostic.
 */
export const isTimeSlotPast = (selectedDateInput, slotTimeStr, marginMinutes = 30) => {
	if (!selectedDateInput || !slotTimeStr) return false;

	// 1. We retrieve the exact date selected by the user (YYYY-MM-DD)
	let selectedDateStr = '';
	if (selectedDateInput instanceof Date) {
		const y = selectedDateInput.getFullYear();
		const m = String(selectedDateInput.getMonth() + 1).padStart(2, '0');
		const d = String(selectedDateInput.getDate()).padStart(2, '0');
		selectedDateStr = `${y}-${m}-${d}`;
	} else {
		selectedDateStr = String(selectedDateInput).split('T')[0];
	}

	// 2. We calculate what time it is “right now” in Spain, plus a safety margin
	const realNow = new Date();
	realNow.setMinutes(realNow.getMinutes() + marginMinutes);

	// We convert Spanish time to exact numbers
	const spainDateString = realNow.toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
	const spainDate = new Date(spainDateString);

	const spainY = spainDate.getFullYear();
	const spainM = String(spainDate.getMonth() + 1).padStart(2, '0');
	const spainD = String(spainDate.getDate()).padStart(2, '0');
	const spainToday = `${spainY}-${spainM}-${spainD}`;

	// 3. RULE A: If the selected date is yesterday or earlier, we block everything
	if (selectedDateStr < spainToday) {
		return true;
	}

	// 4. RULE B: If the selected date is exactly TODAY, we compare minutes
	if (selectedDateStr === spainToday) {
		// How many minutes have passed from midnight until the deadline in Spain
		const limitTotalMinutes = spainDate.getHours() * 60 + spainDate.getMinutes();

		// How many minutes does the slot have (e.g., "18:30" -> 18 * 60 + 30 = 1110)
		const [slotHour, slotMinute] = slotTimeStr.split(':').map(Number);
		const slotTotalMinutes = slotHour * 60 + slotMinute;

		// If the slot occurs BEFORE the deadline, it has passed (returns true)
		return slotTotalMinutes < limitTotalMinutes;
	}

	// 5. RULE C: If it's a future day (e.g., tomorrow), no hours have passed
	return false;
};

export const fetchAvailability = async (selectedDate, guestsCount) => {
	if (!selectedDate || !guestsCount) return;

	try {
		const localDate = new Date(selectedDate);
		localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
		const formattedDate = localDate.toISOString().split('T')[0];

		const res = await fetch(`/api/n8n/disponibilidad?date=${formattedDate}&guests=${guestsCount}`);
		let data = await res.json();
		if (Array.isArray(data) && data.length > 0) data = data[0];

		return data;
	} catch (error) {
		console.error('Error fetching availability:', error);
	}
};

export const submitBooking = async (formData) => {
	try {
		const localDate = new Date(formData.date);
		localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());

		const payload = {
			customer_name: formData.name,
			phone: formData.phone,
			email: formData.email,
			booking_date: localDate.toISOString().split('T')[0],
			start_time: formData.time,
			guests: parseInt(formData.guests),
			preferred_zone: formData.zone,
			allergies: formData.requests || 'None',
		};

		const res = await fetch('/api/n8n/new-booking', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
		const { reservation_id } = await res.json(); // array

		const data = { reservation_id: reservation_id[0] };
		return data;
	} catch (error) {
		console.error('Error submitting booking:', error);
		return (data = {
			message: 'Network error. Please try again later.',
		});
	}
};

export const fetchBooking = async (token) => {
	try {
		const res = await fetch(`/api/n8n/get-booking-details?access_token=${token}`);

		const json = await res.json();
		const payload = Array.isArray(json) ? json[0] : json;

		return payload;
	} catch (err) {
		console.error('Error fetching booking details:', err);
		return null;
	}
};

export const cancelBooking = async (token) => {
	try {
		const payload = { token: token };

		const res = await fetch('/api/n8n/magic-link-cancel', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		const status = await res.json();

		return status;
	} catch (err) {
		console.log(error);
		return null;
	}
};

export const modifyBooking = async (formData, token) => {
	try {
		const res = await fetch('/api/n8n/magic-link-modify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				token: token,
				new_guests: parseInt(formData.pax),
				new_date: formData.date,
				new_time: formData.time,
				new_zone: formData.zone,
			}),
		});

		const data = await res.json();

		return true;
	} catch (err) {
		console.error('Error modifying booking:', err);
		return false;
	}
};

export const getNormalizedAvailability = async (date, pax) => {
	const today = new Date().toISOString().split('T')[0];
	if (date < today) {
		return { success: false, data: null, errorType: 'invalid_past_date' };
	}

	try {
		let data = await fetchAvailability(date, pax);

		if (Array.isArray(data) && data.length > 0) {
			data = data[0];
		}

		if (!data || !data.availability || data.availability.length === 0) {
			return { success: false, data: null, errorType: 'full' };
		}

		const hasAnyAvailable = data.availability.some((slot) => slot.status !== 'full');
		if (!hasAnyAvailable) {
			return { success: false, data: null, errorType: 'full' };
		}

		return { success: true, data: data, errorType: null };
	} catch (error) {
		console.error('Error fetching availability:', error);
		return { success: false, data: null, errorType: 'availability_error' };
	}
};

export const verifyAdminLogin = async (password) => {
	console.log({ password });
	// Usamos el endpoint de 'bookings' para el día de hoy como "ping" de prueba
	const today = new Date().toISOString().split('T')[0];

	// Llamamos a TU proxy de Next.js, no a n8n directamente
	const response = await fetch(`/api/n8n/admin/bookings?start=${today}&end=${today}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'x-admin-password': password,
		},
	});

	if (!response.ok) {
		throw new Error('Contraseña incorrecta o no autorizada');
	}

	return await response.json();
};

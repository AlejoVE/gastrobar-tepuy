import { useState, useEffect } from 'react';

export const useModifyBooking = (booking, token, onSuccess) => {
	const initialZone = booking.current_zone || 'Lounge';

	const [formData, setFormData] = useState({
		pax: booking.guests,
		date: booking.booking_date.split('T')[0],
		time: booking.start_time.substring(0, 5),
		zone: initialZone,
		phone: booking.phone || '',
		allergies: booking.allergies || '',
	});

	const [fullAvailability, setFullAvailability] = useState(null);
	const [isLoadingTimes, setIsLoadingTimes] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAvailability = async () => {
			const today = new Date().toISOString().split('T')[0];
			if (formData.date < today) {
				setError('invalid_past_date');
				setFullAvailability(null);
				return;
			}

			setIsLoadingTimes(true);
			setError(null);

			try {
				const res = await fetch(`api/n8n/disponibilidad?date=${formData.date}&guests=${formData.pax}`);
				if (!res.ok) throw new Error('HTTP Error');

				let data = await res.json();
				if (Array.isArray(data) && data.length > 0) data = data[0];

				if (Object.keys(data).length === 0 || data.error) {
					setFullAvailability(null);
				} else {
					setFullAvailability(data); // { Lounge: [{time: "14:00", status: "full"}], Terrace: [...] }
				}
			} catch (err) {
				setError('availability_error');
				setFullAvailability(null);
			} finally {
				setIsLoadingTimes(false);
			}
		};

		fetchAvailability();
	}, [formData.pax, formData.date]);

	// OBTENEMOS LAS HORAS COMO OBJETOS PARA LA ZONA SELECCIONADA
	const availableTimes = fullAvailability ? fullAvailability[formData.zone] || [] : [];

	const handleChange = (field, value) => {
		setFormData((prev) => {
			const newData = { ...prev, [field]: value };
			if (field === 'pax' || field === 'date') newData.time = '';
			if (field === 'zone' && fullAvailability) {
				const newZoneTimes = fullAvailability[value] || [];
				// Buscamos si la hora actual existe en la nueva zona
				const timeExists = newZoneTimes.some((slot) => slot.time === prev.time && slot.status !== 'full');
				if (!timeExists) newData.time = '';
			}
			return newData;
		});
	};

	// 5. Función de guardado atómicore
	const saveChanges = async () => {
		if (!formData.time) {
			setError('missing_time'); // Clave i18n
			return;
		}

		setIsSaving(true);
		setError(null);

		try {
			const res = await fetch('api/n8n/magic-link-modify', {
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

			if (!res.ok || data.error) {
				throw new Error(data.error || 'modification_failed');
			}

			if (onSuccess) onSuccess();
		} catch (err) {
			console.error('Error modifying booking:', err);
			setError(err.message || 'modification_failed'); // Clave i18n
		} finally {
			setIsSaving(false);
		}
	};

	return { formData, availableTimes, isLoadingTimes, isSaving, error, handleChange, saveChanges };
};

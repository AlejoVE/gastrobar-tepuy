import { useState, useEffect } from 'react';
import { getNormalizedAvailability, modifyBooking } from '../utils/api';

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
		if (!formData.pax || !formData.date) return;

		const getAvailableTables = async () => {
			setIsLoadingTimes(true);
			setError(null);

			const { success, data, errorType } = await getNormalizedAvailability(formData.date, formData.pax);

			if (success) {
				setFullAvailability(data);
			} else {
				if (errorType === 'invalid_past_date') {
					setError('invalid_past_date');
					setFullAvailability(null);
				} else if (errorType === 'full') {
					setFullAvailability({ error: t('reservations.messages.error_full') });
				} else {
					setError('availability_error');
					setFullAvailability(null);
				}
			}

			setIsLoadingTimes(false);
		};

		getAvailableTables();
	}, [formData.pax, formData.date]);

	// We filter the times based on the selected area
	const availableTimes = fullAvailability?.availability
		? fullAvailability.availability.filter((slot) => slot.zone_name === formData.zone)
		: [];

	const handleChange = (field, value) => {
		setFormData((prev) => {
			const newData = { ...prev, [field]: value };
			if (field === 'pax' || field === 'date') newData.time = '';

			if (field === 'zone' && fullAvailability?.availability) {
				const newZoneTimes = fullAvailability.availability.filter((slot) => slot.zone_name === value);
				const timeExists = newZoneTimes.some((slot) => slot.time === prev.time && slot.status !== 'full');
				if (!timeExists) newData.time = '';
			}
			return newData;
		});
	};

	const saveChanges = async () => {
		if (!formData.time) {
			setError('missing_time'); // Clave i18n
			return;
		}

		setIsSaving(true);
		setError(null);

		try {
			const success = await modifyBooking(formData, token);

			if (!success) return setError('modification_failed');

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

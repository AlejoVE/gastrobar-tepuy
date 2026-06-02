import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMinDate } from '../utils/dateUtils.js';

export const useReservation = () => {
	const { t } = useTranslation();
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		date: null,
		guests: '',
		zone: '',
		time: '',
		name: '',
		email: '',
		phone: '',
		requests: '',
	});
	const [availability, setAvailability] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [bookingSuccess, setBookingSuccess] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const minDate = getMinDate();

	useEffect(() => {
		if (formData.date) {
			setAvailability(null);
			setFormData((prev) => ({ ...prev, guests: '', zone: '', time: '' }));
			setSubmitError(null);
		}
	}, [formData.date]);

	const nextStep = () => setStep((prev) => prev + 1);
	const prevStep = () => setStep((prev) => prev - 1);

	const fetchAvailability = async (selectedDate, guestsCount) => {
		if (!selectedDate || !guestsCount) return;
		setIsLoading(true);
		setAvailability(null);
		setFormData((prev) => ({ ...prev, zone: '', time: '' }));

		try {
			const localDate = new Date(selectedDate);
			localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
			const formattedDate = localDate.toISOString().split('T')[0];

			const res = await fetch(`api/n8n/disponibilidad?date=${formattedDate}&guests=${guestsCount}`);
			let data = await res.json();
			if (Array.isArray(data) && data.length > 0) data = data[0];

			setAvailability(Object.keys(data).length === 0 ? { error: t('reservations.messages.error_full') } : data);
		} catch (error) {
			setAvailability({ error: 'Network error.' });
		} finally {
			setIsLoading(false);
		}
	};

	const submitBooking = async () => {
		setIsSubmitting(true);
		setSubmitError(null);
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

			const res = await fetch('api/n8n/new-booking', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const data = await res.json();

			if (res.ok && !data.error && !data.message?.includes('Sorry')) {
				setBookingSuccess(true);
			} else {
				setSubmitError(data.message || data.error || t('reservations.messages.error_full'));
			}
		} catch (error) {
			setSubmitError('Network error. Please try again later.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		t,
		step,
		formData,
		setFormData,
		availability,
		isLoading,
		isSubmitting,
		bookingSuccess,
		submitError,
		nextStep,
		prevStep,
		fetchAvailability,
		submitBooking,
		setSubmitError,
		minDate,
	};
};

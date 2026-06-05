import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMinDate } from '../utils/dateUtils.js';
import { fetchAvailability, getNormalizedAvailability, submitBooking } from '../utils/api.js';

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

	const getAvailableTables = async (selectedDate, guestsCount) => {
		if (!selectedDate || !guestsCount) return;

		setIsLoading(true);
		setAvailability(null);
		setFormData((prev) => ({ ...prev, zone: '', time: '' }));

		const { success, data, errorType } = await getNormalizedAvailability(selectedDate, guestsCount);

		console.log({ data });

		if (!success) {
			setIsLoading(false);

			return setAvailability({
				error: errorType === 'full' ? t('reservations.messages.error_full') : 'Network error.',
			});
		}

		setAvailability(data);

		setIsLoading(false);
	};

	const createBooking = async () => {
		setIsSubmitting(true);
		setSubmitError(null);
		try {
			const data = await submitBooking(formData);
			if (data.reservation_id) {
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
		getAvailableTables,
		createBooking,
		setSubmitError,
		minDate,
	};
};

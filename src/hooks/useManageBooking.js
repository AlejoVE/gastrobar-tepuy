import { useState, useEffect } from 'react';
import { fetchBooking, cancelBooking } from '../utils/api.js';

export const useManageBooking = (token) => {
	const [appState, setAppState] = useState('loading'); // 'loading', 'error', 'success'
	const [booking, setBooking] = useState(null);
	const [showConfirm, setShowConfirm] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isCancelled, setIsCancelled] = useState(false);

	useEffect(() => {
		if (!token) return setAppState('error');

		// Flag to avoid  fetching twice during development
		let ignore = false;

		const getBookingData = async () => {
			try {
				if (ignore) return;
				const data = await fetchBooking(token);

				if (!data.success) return setAppState('error');

				setBooking(data.data);
				setAppState('success');
			} catch (err) {
				if (ignore) return;
				console.error('Error fetching booking details:', err);
				setAppState('error');
			}
		};

		getBookingData();

		return () => {
			ignore = true;
		};
	}, [token]);

	const executeCancel = async () => {
		setIsProcessing(true);
		try {
			const res = await cancelBooking(token);

			if (!res === 'success') {
				alert('Error canceling booking.');
				setIsProcessing(false);
				return;
			}

			setIsCancelled(true);
		} catch (err) {
			console.error('Error canceling booking:', err);
			alert('Error connecting to server.');
		}
		setIsProcessing(false);
	};

	return {
		appState,
		booking,
		showConfirm,
		setShowConfirm,
		isProcessing,
		isCancelled,
		executeCancel,
	};
};

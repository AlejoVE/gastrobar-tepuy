import { useState, useEffect } from 'react';

export const useManageBooking = (token) => {
	const [appState, setAppState] = useState('loading'); // 'loading', 'error', 'success'
	const [booking, setBooking] = useState(null);
	const [showConfirm, setShowConfirm] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isCancelled, setIsCancelled] = useState(false);

	useEffect(() => {
		if (!token) return setAppState('error');

		const fetchBooking = async () => {
			try {
				const res = await fetch(`api/n8n/get-booking-details?access_token=${token}`);
				if (!res.ok) throw new Error('HTTP Error');

				const json = await res.json();
				const payload = Array.isArray(json) ? json[0] : json;

				if (payload?.success && payload?.data) {
					setBooking(payload.data);
					setAppState('success');
				} else {
					setAppState('error');
				}
			} catch (err) {
				console.error('Error fetching booking details:', err);
				setAppState('error');
			}
		};

		fetchBooking();
	}, [token]);

	const executeCancel = async () => {
		setIsProcessing(true);
		try {
			const payload = { token: token };

			const res = await fetch('api/n8n/magic-link-cancel', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const result = await res.json();

			if (result.status === 'success') {
				setIsCancelled(true);
			} else {
				alert(result.message || 'Error canceling booking.');
			}
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

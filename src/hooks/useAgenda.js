import { useState, useEffect, useCallback } from 'react';
import { fetchBookings } from '../utils/api';

export const useAgenda = (token) => {
	const getToday = () => new Date().toISOString().split('T')[0];

	const [startDate, setStartDate] = useState(getToday());
	const [endDate, setEndDate] = useState(getToday());
	const [data, setData] = useState([]);
	const [metrics, setMetrics] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Envolvemos la carga en useCallback para poder llamarla manualmente
	const loadData = useCallback(async () => {
		if (!token) return;
		setIsLoading(true);
		setError(null);

		try {
			const result = await fetchBookings(token, startDate, endDate);
			if (result.success) {
				setData(result.data || []);
				setMetrics(result.metrics || null);
			} else {
				setError('Respuesta inválida del servidor.');
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	}, [token, startDate, endDate]);

	// Solo cargamos automáticamente la PRIMERA vez que se abre el panel
	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		startDate,
		setStartDate,
		endDate,
		setEndDate,
		data,
		setData, // <-- Exportamos setData para actualizar UI optimistamente
		metrics,
		isLoading,
		error,
		loadData, // <-- Exportamos la función para el botón "Buscar"
	};
};

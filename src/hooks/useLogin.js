// src/hooks/useLogin.js
import { useState } from 'react';
import { verifyAdminLogin } from '../utils/api';

export const useLogin = (onLoginSuccess) => {
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleLogin = async (e) => {
		console.log('Estoy disparando el login');
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// Delegamos la llamada a la capa de API
			await verifyAdminLogin(password);

			// Si no hay errores, guardamos la sesión y avanzamos
			sessionStorage.setItem('adminToken', password);
			onLoginSuccess(password);
		} catch (err) {
			setError('Contraseña de administrador incorrecta.');
		} finally {
			setIsLoading(false);
		}
	};

	return {
		password,
		setPassword,
		isLoading,
		error,
		handleLogin,
	};
};

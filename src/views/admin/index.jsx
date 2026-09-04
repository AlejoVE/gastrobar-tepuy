import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Loader2 } from 'lucide-react';
import { AdminLogin } from '../../components/AdminLogin.jsx';
import { AdminDashboard } from '../../components/AdminDashboard.jsx.jsx';

export default function AdminPage() {
    const [token, setToken] = useState(null);
    const [isChecking, setIsChecking] = useState(true);

    // 1. Efecto de Hidratación: Revisamos si ya hay una sesión guardada al cargar la página
    useEffect(() => {
        const savedToken = sessionStorage.getItem('adminToken');
        if (savedToken) {
            setToken(savedToken);
        }
        setIsChecking(false);
    }, []);

    // 2. Función que se ejecuta cuando el Login es exitoso
    const handleLoginSuccess = (newToken) => {
        setToken(newToken);
    };

    // 3. Función de cierre de sesión (¡Muy importante para la seguridad!)
    const handleLogout = () => {
        sessionStorage.removeItem('adminToken');
        setToken(null);
    };

    // Pantalla de carga mientras Next.js verifica el navegador
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pure-white">
                <Loader2 className="w-10 h-10 animate-spin text-forest-green" />
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Panel de Administración | Tepuy</title>
                <meta name="robots" content="noindex, nofollow" /> {/* Evita que Google indexe esta página */}
            </Head>

            {/* Renderizado Condicional: Si no hay token, muestra el Login. Si hay, muestra el Dashboard */}
            {!token ? (
                <AdminLogin onLoginSuccess={handleLoginSuccess} />
            ) : (
                <AdminDashboard token={token} onLogout={handleLogout} />
            )}
        </>
    );
}
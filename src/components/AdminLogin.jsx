// src/components/AdminLogin.jsx
"use client"

import { motion } from 'framer-motion';
import { Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
export const AdminLogin = ({ onLoginSuccess }) => {
    // Consumimos el estado y la lógica desde nuestro Hook
    const { password, setPassword, isLoading, error, handleLogin } = useLogin(onLoginSuccess);

    return (
        <div className="min-h-screen bg-pure-white flex flex-col justify-center items-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-gray-50 rounded-2xl p-8 border border-sage-green/20 shadow-xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-forest-green" />
                    </div>
                    <h2 className="text-2xl font-bold text-forest-green font-sans">
                        Acceso Restringido
                    </h2>
                    <p className="text-sage-green mt-2 text-sm">
                        Introduce la clave maestra
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-start gap-3 border border-red-100"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium mt-0.5">{error}</p>
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="w-full p-4 bg-white border border-sage-green/30 rounded-xl focus:ring-2 focus:ring-forest-green outline-none transition-all text-center tracking-widest text-lg font-mono text-charcoal shadow-inner"
                            placeholder="••••••••"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !password.trim()}
                        className="w-full bg-forest-green text-white py-4 rounded-xl font-bold hover:bg-charcoal transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5" /> Acceder</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
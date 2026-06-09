import { useState } from 'react';
import { LogOut, CalendarDays, Search, LayoutDashboard } from 'lucide-react';

export const AdminDashboard = ({ token, onLogout }) => {
    // Estado para controlar qué "Pestaña" estamos viendo (Agenda o Buscador)
    const [activeTab, setActiveTab] = useState('agenda');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* BARRA DE NAVEGACIÓN SUPERIOR */}
            <header className="bg-charcoal text-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <LayoutDashboard className="w-6 h-6 text-sage-green" />
                            <h1 className="text-xl font-bold font-sans tracking-wide">Tepuy Admin</h1>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Navegación Interna */}
                            <nav className="hidden md:flex space-x-4">
                                <button
                                    onClick={() => setActiveTab('agenda')}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'agenda' ? 'bg-forest-green text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4" />
                                        Agenda Diaria
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('search')}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'search' ? 'bg-forest-green text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Search className="w-4 h-4" />
                                        Buscador
                                    </div>
                                </button>
                            </nav>

                            {/* Botón de Salir */}
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium border border-red-400/30 px-3 py-1.5 rounded-lg hover:bg-red-400/10"
                            >
                                <LogOut className="w-4 h-4" />
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'agenda' && (
                    <div>
                        <h2 className="text-2xl font-bold text-forest-green mb-6">Agenda de Reservas</h2>
                        {/* Aquí inyectaremos el componente DailyAgenda que consumirá el webhook GET admin/bookings */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <p className="text-gray-500">Cargando vista de agenda...</p>
                        </div>
                    </div>
                )}

                {activeTab === 'search' && (
                    <div>
                        <h2 className="text-2xl font-bold text-forest-green mb-6">Buscador de Clientes</h2>
                        {/* Aquí inyectaremos el componente AdvancedSearch que consumirá el webhook GET admin/search */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <p className="text-gray-500">Cargando vista de buscador...</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
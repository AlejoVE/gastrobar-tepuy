import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Users, Hash, Info, Loader2, X, Clock } from 'lucide-react';

const inputClasses = "w-full pl-10 pr-3 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green outline-none shadow-sm transition-all";

const FormField = ({ label, icon: Icon, children }) => (
    <div>
        <label className="block text-sm font-semibold text-charcoal mb-2">{label}</label>
        <div className="relative">
            {Icon && <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 z-10" pointerEvents="none" />}
            {children}
        </div>
    </div>
);

export const AdminModifyModal = ({ booking, onSave, onCancel, isSaving }) => {
    const [formData, setFormData] = useState({
        guests: booking.guests,
        date: new Date(booking.booking_date).toISOString().split('T')[0],
        time: booking.start_time.slice(0, 5),
        table_id: booking.assigned_tables || '',
        allergies: booking.allergies !== 'None' && booking.allergies !== 'Ninguna' ? booking.allergies : ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación básica de la hora por si se escribe incompleta
        const finalTime = formData.time.length === 5 ? formData.time : "12:00";

        const updatePayload = {
            guests: parseInt(formData.guests),
            booking_date: new Date(formData.date).toISOString(),
            start_time: finalTime + ':00', // Postgres requiere formato HH:mm:ss
            allergies: formData.allergies || 'Ninguna',
            table_id: formData.table_id ? formData.table_id.toString() : null
        };
        onSave(updatePayload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-visible"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                    <div>
                        <h3 className="text-xl font-bold text-forest-green font-sans">
                            Modo Administrador
                        </h3>
                        <p className="text-sm text-gray-500">Editando reserva #{booking.reservation_id}</p>
                    </div>
                    <button onClick={onCancel} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Fila 1: Comensales y Mesas */}
                    <div className="grid grid-cols-2 gap-5">
                        <FormField label="Comensales" icon={Users}>
                            <input
                                type="number" min="1" max="50"
                                value={formData.guests}
                                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                className={inputClasses}
                            />
                        </FormField>
                        <FormField label="Mesa(s)" icon={Hash}>
                            <input
                                type="text"
                                placeholder="Ej: 4, 5"
                                value={formData.table_id}
                                onChange={(e) => setFormData({ ...formData, table_id: e.target.value })}
                                className={inputClasses}
                                title="Puedes separar varias mesas por comas"
                            />
                        </FormField>
                    </div>

                    {/* Fila 2: Fecha y Hora manual */}
                    <div className="grid grid-cols-2 gap-5 items-start">
                        <FormField label="Fecha" icon={CalendarIcon}>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                // ✨ Esto fuerza al calendario a abrirse al hacer clic en cualquier parte de la caja
                                onClick={(e) => e.target.showPicker?.()}
                                className={`${inputClasses} cursor-pointer`}
                            />
                        </FormField>

                        <FormField label="Hora" icon={Clock}>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                // ✨ Igual que la fecha, forzamos la apertura del selector en móviles
                                onClick={(e) => e.target.showPicker?.()}
                                className={`${inputClasses} cursor-pointer appearance-none`}
                            />
                        </FormField>
                    </div>

                    {/* Fila 3: Alergias o Notas */}
                    <FormField label="Alergias o Notas Internas" icon={Info}>
                        <textarea
                            rows="2"
                            value={formData.allergies}
                            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                            className="w-full pl-10 pr-3 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green outline-none shadow-sm"
                            placeholder="Alergias, peticiones especiales..."
                        />
                    </FormField>

                    {/* Botones de Acción */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSaving}
                            className="flex-1 px-6 py-4 border-2 border-gray-200 text-charcoal hover:bg-gray-50 rounded-xl font-bold transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-6 py-4 bg-forest-green text-white rounded-xl font-bold hover:bg-charcoal transition-colors flex justify-center items-center gap-2 shadow-md disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
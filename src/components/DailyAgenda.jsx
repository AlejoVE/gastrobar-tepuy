import { useState } from 'react';
import { Loader2, Calendar, Users, ClipboardList, AlertCircle, Search, Edit2, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgenda } from '../hooks/useAgenda';
import { updateAdminBooking } from '../utils/api';
import { AdminModifyModal } from './AdminModifyModal';

export const DailyAgenda = ({ token }) => {
    const {
        startDate, setStartDate,
        endDate, setEndDate,
        data, setData, metrics,
        isLoading, error, loadData
    } = useAgenda(token);

    const [updatingId, setUpdatingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null); // Para el Modal

    // Mapeo de colores para los estados
    const getStatusColor = (status) => {
        const statusMap = {
            confirmed: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            seated: 'bg-blue-100 text-blue-700',
            completed: 'bg-gray-100 text-gray-700',
            cancelled: 'bg-red-100 text-red-700',
            no_show: 'bg-orange-100 text-orange-700'
        };
        return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
    };

    // Función para el Cambio de Estado Rápido
    const handleStatusChange = async (bookingId, newStatus) => {
        setUpdatingId(bookingId);
        try {
            await updateAdminBooking(token, bookingId, { status: newStatus });
            // Actualización optimista de la UI
            setData(prev => prev.map(b => b.reservation_id === bookingId ? { ...b, status: newStatus } : b));
        } catch (err) {
            alert('Error al actualizar el estado: ' + err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleModalSave = async (updatePayload) => {
        setUpdatingId(selectedBooking.reservation_id);
        try {
            const res = await updateAdminBooking(token, selectedBooking.reservation_id, updatePayload);

            if (!res.success) {
                throw new Error(res.error || 'Error desconocido al actualizar');
            }

            // Actualización optimista: fusionamos los datos viejos con los nuevos
            setData(prev => prev.map(b =>
                b.reservation_id === selectedBooking.reservation_id
                    ? {
                        ...b,
                        ...updatePayload,
                        // Mapeamos table_id a assigned_tables para que la vista se actualice al instante
                        assigned_tables: updatePayload.table_id ? updatePayload.table_id.toString() : b.assigned_tables
                    }
                    : b
            ));

            setSelectedBooking(null); // Cerramos el modal
        } catch (err) {
            alert('Error al guardar: ' + err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* CONTROLES DE FECHA Y BÚSQUEDA */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-forest-green" />
                    <span className="font-medium text-charcoal">Desde:</span>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 border border-sage-green/30 rounded-lg outline-none focus:ring-2 focus:ring-forest-green"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-charcoal">Hasta:</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 border border-sage-green/30 rounded-lg outline-none focus:ring-2 focus:ring-forest-green"
                    />
                </div>
                {/* NUEVO BOTÓN DE BÚSQUEDA */}
                <button
                    onClick={loadData}
                    disabled={isLoading}
                    className="ml-auto flex items-center gap-2 bg-forest-green text-white px-6 py-2 rounded-lg font-medium hover:bg-charcoal transition-colors disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    Buscar
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* TARJETAS DE MÉTRICAS */}
            {!isLoading && metrics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-sage-green/20 flex items-center gap-4">
                        <div className="p-4 bg-forest-green/10 rounded-full text-forest-green">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Reservas</p>
                            <p className="text-2xl font-bold text-charcoal">{metrics.total_reservations}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-sage-green/20 flex items-center gap-4">
                        <div className="p-4 bg-sage-green/10 rounded-full text-sage-green">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Comensales (Pax)</p>
                            <p className="text-2xl font-bold text-charcoal">{metrics.total_pax}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-sage-green/20 flex items-center gap-4">
                        <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Walk-ins</p>
                            <p className="text-2xl font-bold text-charcoal">{metrics.total_walk_ins}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* TABLA PRINCIPAL */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-forest-green">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p>Cargando reservas...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No hay reservas para las fechas seleccionadas.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 whitespace-nowrap">
                                    <th className="p-4 font-semibold">Fecha / Hora</th>
                                    <th className="p-4 font-semibold">Cliente</th>
                                    <th className="p-4 font-semibold text-center">Pax</th>
                                    <th className="p-4 font-semibold">Zona / Mesa</th>
                                    <th className="p-4 font-semibold">Alergias</th>
                                    <th className="p-4 font-semibold text-center">Estado</th>
                                    <th className="p-4 font-semibold text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((booking) => (
                                    <tr key={booking.reservation_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 whitespace-nowrap">
                                            {/* NUEVA COLUMNA: FECHA Y HORA */}
                                            <p className="font-semibold text-forest-green">
                                                {new Date(booking.booking_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                            </p>
                                            <p className="text-sm text-charcoal">{booking.start_time.slice(0, 5)}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-charcoal">{booking.customer_name}</p>

                                                {booking.is_reconfirmed && (
                                                    <CheckCircle className="w-4 h-4 text-forest-green" title="Cliente confirmado" />
                                                )}
                                            </div>
                                            <p className="text-gray-500">{booking.email}</p>
                                            <p className="text-gray-500">{booking.phone} • {booking.source}</p>
                                        </td>
                                        <td className="p-4 text-center font-bold text-charcoal">{booking.guests}</td>
                                        <td className="p-4">
                                            {/* NUEVA COLUMNA: ZONA/MESA */}
                                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap">
                                                {booking.assigned_tables ? `# ${booking.assigned_tables}` : 'Sin asignar'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-orange-600 max-w-[150px] truncate">
                                            {booking.allergies !== "None" && booking.allergies !== "Ninguna" ? booking.allergies : "-"}
                                        </td>
                                        <td className="p-4 text-center">
                                            {/* SELECTOR MÁGICO DE ESTADO */}
                                            {updatingId === booking.reservation_id ? (
                                                <Loader2 className="w-5 h-5 animate-spin mx-auto text-forest-green" />
                                            ) : (
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => handleStatusChange(booking.reservation_id, e.target.value)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer outline-none appearance-none text-center ${getStatusColor(booking.status)}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="seated">Seated (Sentados)</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="no_show">No Show</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {/* BOTÓN DE EDITAR (Abre modal) */}
                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="p-2 text-sage-green hover:text-forest-green hover:bg-sage-green/10 rounded-lg transition-colors"
                                                title="Editar Reserva"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL DE EDICIÓN FLOTANTE */}
            <AnimatePresence>
                {selectedBooking && (
                    <AdminModifyModal
                        booking={selectedBooking}
                        onSave={handleModalSave}
                        onCancel={() => setSelectedBooking(null)}
                        isSaving={updatingId === selectedBooking.reservation_id}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
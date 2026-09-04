"use client"
import { motion } from 'framer-motion';
import ReservationsPage from '@/src/views/ReservationsPage';

export default function Reservations() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <ReservationsPage />
        </motion.div>
    );
}
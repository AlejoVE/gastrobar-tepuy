"use client"
import { motion } from 'framer-motion';
import ManageBookingPage from '@/src/views/ManageBookingPage';

export default function Manage({ searchParams }) {
    const magicToken = searchParams.token || null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <ManageBookingPage token={magicToken} />
        </motion.div>
    );
}
"use client"
import { motion } from 'framer-motion';
import Index from '@/src/views/admin/index.jsx';

export default function Admin() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Index />
        </motion.div>
    );
}
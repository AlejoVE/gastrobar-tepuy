"use client"
import { motion } from 'framer-motion';
import HomePage from '@/src/views/HomePage';
import { redirect } from 'next/navigation';

export default function Home({ searchParams }) {

    if (searchParams?.token) {
        redirect(`/manage?token=${searchParams.token}`);
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <HomePage />
        </motion.div>
    );
}
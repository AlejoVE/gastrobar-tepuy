import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-pure-white font-sans flex flex-col">
            <Header />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
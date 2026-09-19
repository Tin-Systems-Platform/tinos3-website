import Header from '@/components/Header'; // Muuta polku vastaamaan omaa komponenttiasi
import Footer from '@/components/Footer'; // Muuta polku vastaamaan omaa komponenttiasi

export default function NewsLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      {/* Yhteinen Header uutissivuille */}
      <Header />
      
      {/* Itse uutissisältö (oli se sitten asynkroninen lista tai yksittäinen sivu) */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Yhteinen Footer uutissivuille */}
      <Footer />
    </div>
  );
}
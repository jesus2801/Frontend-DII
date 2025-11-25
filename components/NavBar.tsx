'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  // Ocultar navbar en login y callback
  if (pathname === '/login' || pathname?.startsWith('/auth/callback')) {
    return null;
  }

  // Función para cerrar sesión
  const handleLogout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/login';
    }
  };
  return (
    <nav className="p-4 shadow-md" style={{ backgroundColor: '#1F4E79' }}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Gestión Datos Personales</h1>
        <div className="flex gap-4 items-center">
          <Link href="/" className="text-white hover:opacity-80 transition">Inicio</Link>
          <Link href="/personas" className="text-white hover:opacity-80 transition">Consultar</Link>
          <Link href="/personas/crear" className="text-white hover:opacity-80 transition">Crear Persona</Link>
          <Link href="/rag" className="text-white hover:opacity-80 transition">Consulta IA (RAG)</Link>
          <Link href="/logs" className="text-white hover:opacity-80 transition">Logs</Link>
          <button
            onClick={handleLogout}
            className="ml-6 px-4 py-1 rounded text-white transition"
            style={{ backgroundColor: '#EA4335', marginLeft: '2rem' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EA4335'}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
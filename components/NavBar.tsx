import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Gestión Datos Personales</h1>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-blue-300">Inicio</Link>
          <Link href="/personas" className="hover:text-blue-300">Consultar</Link>
          <Link href="/personas/crear" className="hover:text-blue-300">Crear Persona</Link>
          <Link href="/rag" className="hover:text-blue-300">Consulta IA (RAG)</Link>
          <Link href="/logs" className="hover:text-blue-300">Logs</Link>
        </div>
      </div>
    </nav>
  );
}
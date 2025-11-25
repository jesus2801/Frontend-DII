'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPersonas, deletePersona, Persona } from '@/lib/api';
import { Trash2, Edit, Plus } from 'lucide-react';

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar datos al iniciar
  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      const data = await getPersonas();
      setPersonas(data);
    } catch (err) {
      setError('Error cargando personas. Verifica que el backend esté encendido.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta persona?')) return;
    
    try {
      await deletePersona(id);
      // Recargar la lista visualmente filtrando el eliminado
      setPersonas(personas.filter((p) => p.id !== id));
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando datos...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <main className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Listado de Personas</h1>
        <Link 
          href="/personas/crear" 
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Nueva Persona
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
            <tr>
              <th className="p-4">Documento</th>
              <th className="p-4">Nombre Completo</th>
              <th className="p-4">Email</th>
              <th className="p-4">Celular</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {personas.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  No hay personas registradas.
                </td>
              </tr>
            ) : (
              personas.map((persona) => (
                <tr key={persona.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-medium">
                    {persona.tipoDocumento} {persona.nroDocumento}
                  </td>
                  <td className="p-4">
                    {persona.primerNombre} {persona.apellidos}
                  </td>
                  <td className="p-4 text-slate-600">{persona.email}</td>
                  <td className="p-4 text-slate-600">{persona.celular}</td>
                  <td className="p-4 flex justify-center gap-3">
                    {/* Botón Editar: lleva a /personas/[ID] */}
                    <Link 
                      href={`/personas/${persona.id}`} 
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Edit size={20} />
                    </Link>
                    
                    {/* Botón Borrar */}
                    <button 
                      onClick={() => handleDelete(persona.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
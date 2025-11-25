'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPersonas, deletePersona } from '@/lib/api';
import { Persona } from '@/lib/definitions';
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
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar';
      if (errorMsg.includes('403') || errorMsg.includes('permisos')) {
        alert('No tienes permisos para eliminar personas. Solo administradores pueden eliminar.');
      } else {
        alert(errorMsg);
      }
    }
  };

  if (loading) return <div className="p-10 text-center" style={{ color: '#5A5A5A' }}>Cargando datos...</div>;
  if (error) return <div className="p-10 text-center" style={{ color: '#EA4335' }}>{error}</div>;

  return (
    <main className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>Listado de Personas</h1>
        <Link 
          href="/personas/crear" 
          className="text-white px-4 py-2 rounded flex items-center gap-2"
          style={{ backgroundColor: '#3A7BD5' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fa3'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3A7BD5'}
        >
          <Plus size={18} /> Nueva Persona
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9D9D9' }}>
        <table className="min-w-full text-left text-sm">
          <thead className="uppercase font-semibold" style={{ backgroundColor: '#F5F5F5' }}>
            <tr>
              <th className="p-4" style={{ color: '#5A5A5A' }}>Documento</th>
              <th className="p-4" style={{ color: '#5A5A5A' }}>Nombre Completo</th>
              <th className="p-4" style={{ color: '#5A5A5A' }}>Email</th>
              <th className="p-4" style={{ color: '#5A5A5A' }}>Celular</th>
              <th className="p-4 text-center" style={{ color: '#5A5A5A' }}>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: '#D9D9D9' }}>
            {personas.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center" style={{ color: '#5A5A5A' }}>
                  No hay personas registradas.
                </td>
              </tr>
            ) : (
              personas.map((persona) => (
                <tr key={persona.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium" style={{ color: '#1A1A1A' }}>
                    {persona.idType} {persona.id}
                  </td>
                  <td className="p-4" style={{ color: '#1A1A1A' }}>
                    {persona.firstName} {persona.surname}
                  </td>
                  <td className="p-4" style={{ color: '#5A5A5A' }}>{persona.email}</td>
                  <td className="p-4" style={{ color: '#5A5A5A' }}>{persona.phone}</td>
                  <td className="p-4 flex justify-center gap-3">
                    {/* Botón Editar: lleva a /personas/[ID] */}
                    <Link 
                      href={`/personas/${persona.id}`} 
                      style={{ color: '#3A7BD5' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2d5fa3'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#3A7BD5'}
                      title="Editar"
                    >
                      <Edit size={20} />
                    </Link>
                    
                    {/* Botón Borrar */}
                    <button 
                      onClick={() => handleDelete(persona.id)}
                      style={{ color: '#EA4335' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#d32f2f'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#EA4335'}
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
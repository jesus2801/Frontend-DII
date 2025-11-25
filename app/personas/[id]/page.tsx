'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// OJO: Creamos un schema parcial porque al editar la foto es opcional
import { PersonaSchema, PersonaFormData } from '@/lib/definitions'; 
import { getPersonaById, updatePersona } from '@/lib/api';
import { useRouter } from 'next/navigation'; // OJO: Importar de next/navigation

// Schema modificado para edición: la foto puede venir vacía (no se actualiza)
const EditSchema = PersonaSchema.extend({
  foto: PersonaSchema.shape.foto.optional(), 
});

export default function EditarPersonaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PersonaFormData>({
    resolver: zodResolver(EditSchema),
  });

  // 1. Cargar datos de la persona al entrar
  useEffect(() => {
    getPersonaById(params.id).then((data) => {
      // Formatear fecha para el input type="date" (YYYY-MM-DD)
      const fechaFormat = data.fechaNacimiento ? new Date(data.fechaNacimiento).toISOString().split('T')[0] : '';
      
      reset({ ...data, fechaNacimiento: fechaFormat });
      setIsLoadingData(false);
    });
  }, [params.id, reset]);

  // 2. Enviar actualización
  const onSubmit = async (data: PersonaFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // Solo enviamos la foto si el usuario subió una nueva
      if (key === 'foto') {
         if (value && value.length > 0) formData.append('foto', value[0]);
      } else {
         formData.append(key, value as string);
      }
    });

    try {
      await updatePersona(params.id, formData);
      alert('Actualizado correctamente');
      router.push('/personas');
    } catch (e) {
      alert('Error al actualizar');
    }
  };

  if (isLoadingData) return <p className="p-6">Cargando datos...</p>;

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-orange-600">Editar Persona</h2>
      {/* Reutilizamos el mismo formulario HTML, o puedes hacer un componente compartido */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow border">
         {/* ... Copia aquí los mismos inputs del formulario de Crear ... */}
         {/* Solo cambia el botón final */}
         <div className="md:col-span-2 mt-4">
            <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 text-white font-bold py-2 rounded">
               {isSubmitting ? 'Actualizando...' : 'Actualizar Datos'}
            </button>
         </div>
      </form>
    </main>
  );
}
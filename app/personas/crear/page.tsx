'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PersonaSchema, PersonaFormData } from '@/lib/definitions';
import { createPersona } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CrearPersonaPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonaFormData>({
    resolver: zodResolver(PersonaSchema),
  });

  const onSubmit = async (data: PersonaFormData) => {
    try {
      const formData = new FormData();
      // Agregamos campos al FormData (necesario para enviar archivos al backend Java/Python)
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'foto') {
           formData.append('foto', value[0]); // El archivo
        } else {
           formData.append(key, value as string);
        }
      });

      await createPersona(formData);
      alert('Persona creada exitosamente');
      router.push('/personas'); // Redirigir a la lista
    } catch (error) {
      setServerError('Hubo un error al conectar con el servidor.');
    }
  };

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Registrar Persona</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow border">
        
        {/* Nro Documento */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Nro. Documento</label>
          <input {...register('nroDocumento')} className="w-full border p-2 rounded" placeholder="12345678" />
          {errors.nroDocumento && <p className="text-red-500 text-xs mt-1">{errors.nroDocumento.message}</p>}
        </div>

        {/* Tipo Documento */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Tipo Documento</label>
          <select {...register('tipoDocumento')} className="w-full border p-2 rounded">
            <option value="">Seleccione...</option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="TI">Tarjeta de Identidad</option>
          </select>
          {errors.tipoDocumento && <p className="text-red-500 text-xs mt-1">{errors.tipoDocumento.message}</p>}
        </div>

        {/* Nombres */}
        <div>
          <label className="block text-sm font-medium mb-1">Primer Nombre</label>
          <input {...register('primerNombre')} className="w-full border p-2 rounded" />
          {errors.primerNombre && <p className="text-red-500 text-xs mt-1">{errors.primerNombre.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Segundo Nombre</label>
          <input {...register('segundoNombre')} className="w-full border p-2 rounded" />
          {errors.segundoNombre && <p className="text-red-500 text-xs mt-1">{errors.segundoNombre.message}</p>}
        </div>

        {/* Apellidos */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Apellidos</label>
          <input {...register('apellidos')} className="w-full border p-2 rounded" />
          {errors.apellidos && <p className="text-red-500 text-xs mt-1">{errors.apellidos.message}</p>}
        </div>

        {/* Fechas y Contacto */}
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Nacimiento</label>
          <input type="date" {...register('fechaNacimiento')} className="w-full border p-2 rounded" />
          {errors.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Género</label>
          <select {...register('genero')} className="w-full border p-2 rounded">
            <option value="">Seleccione...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="No binario">No binario</option>
            <option value="Prefiero no reportar">Prefiero no reportar</option>
          </select>
          {errors.genero && <p className="text-red-500 text-xs mt-1">{errors.genero.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" {...register('email')} className="w-full border p-2 rounded" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Celular</label>
          <input {...register('celular')} className="w-full border p-2 rounded" placeholder="3001234567" />
          {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>}
        </div>

        {/* Foto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Foto de Perfil (Max 2MB)</label>
          <input type="file" accept="image/*" {...register('foto')} className="w-full border p-2 rounded bg-slate-50" />
          {errors.foto && <p className="text-red-500 text-xs mt-1">{errors.foto.message as string}</p>}
        </div>

        {/* Botón Submit */}
        <div className="md:col-span-2 mt-4">
          <button 
            disabled={isSubmitting}
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Persona'}
          </button>
          {serverError && <p className="text-center text-red-500 mt-2">{serverError}</p>}
        </div>
      </form>
    </main>
  );
}
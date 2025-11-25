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

      // Mapeo de campos Frontend (Español) -> Backend (Inglés)
      const fieldMapping: Record<string, string> = {
        nroDocumento: 'id',
        tipoDocumento: 'idType',
        primerNombre: 'firstName',
        segundoNombre: 'secondName',
        apellidos: 'surname',
        fechaNacimiento: 'birthdate',
        genero: 'gender',
        email: 'email',
        celular: 'phone',
        foto: 'foto'
      };

      Object.entries(data).forEach(([key, value]) => {
        const backendKey = fieldMapping[key] || key;

        if (key === 'foto') {
          // Si hay foto, enviarla
          if (value && value.length > 0) {
            formData.append('foto', value[0]);
          }
        } else if (value !== undefined && value !== null && value !== '') {
          formData.append(backendKey, value as string);
        }
      });

      await createPersona(formData);
      alert('Persona creada exitosamente');
      router.push('/personas'); // Redirigir a la lista
    } catch (error) {
      console.error(error);
      setServerError('Hubo un error al conectar con el servidor.');
    }
  };

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A1A1A' }}>Registrar Persona</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-lg shadow" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9D9D9' }}>

        {/* Nro Documento */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A5A' }}>Nro. Documento</label>
          <input {...register('nroDocumento')} className="w-full p-2 rounded" placeholder="12345678" style={{ border: '1px solid #D9D9D9', color: '#1A1A1A' }} />
          {errors.nroDocumento && <p className="text-xs mt-1" style={{ color: '#EA4335' }}>{errors.nroDocumento.message}</p>}
        </div>

        {/* Tipo Documento */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A5A' }}>Tipo Documento</label>
          <select {...register('tipoDocumento')} className="w-full p-2 rounded" style={{ border: '1px solid #D9D9D9', color: '#1A1A1A' }}>
            <option value="">Seleccione...</option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="TI">Tarjeta de Identidad</option>
          </select>
          {errors.tipoDocumento && <p className="text-xs mt-1" style={{ color: '#EA4335' }}>{errors.tipoDocumento.message}</p>}
        </div>

        {/* Nombres */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A5A' }}>Primer Nombre</label>
          <input {...register('primerNombre')} className="w-full p-2 rounded" style={{ border: '1px solid #D9D9D9', color: '#1A1A1A' }} />
          {errors.primerNombre && <p className="text-xs mt-1" style={{ color: '#EA4335' }}>{errors.primerNombre.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A5A' }}>Segundo Nombre</label>
          <input {...register('segundoNombre')} className="w-full p-2 rounded" style={{ border: '1px solid #D9D9D9', color: '#1A1A1A' }} />
          {errors.segundoNombre && <p className="text-xs mt-1" style={{ color: '#EA4335' }}>{errors.segundoNombre.message}</p>}
        </div>

        {/* Apellidos */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A5A' }}>Apellidos</label>
          <input {...register('apellidos')} className="w-full p-2 rounded" style={{ border: '1px solid #D9D9D9', color: '#1A1A1A' }} />
          {errors.apellidos && <p className="text-xs mt-1" style={{ color: '#EA4335' }}>{errors.apellidos.message}</p>}
        </div>

        {/* Fechas y Contacto */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A5A' }}>Fecha Nacimiento</label>
          <input type="date" {...register('fechaNacimiento')} className="w-full p-2 rounded" style={{ border: '1px solid #D9D9D9', color: '#1A1A1A' }} />
          {errors.fechaNacimiento && <p className="text-xs mt-1" style={{ color: '#EA4335' }}>{errors.fechaNacimiento.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A5A' }}>Género</label>
          <select {...register('genero')} className="w-full p-2 rounded" style={{ border: '1px solid #D9D9D9', color: '#1A1A1A' }}>
            <option value="">Seleccione...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="No binario">No binario</option>
            <option value="Prefiero no reportar">Prefiero no reportar</option>
          </select>
          {errors.genero && <p className="text-xs mt-1" style={{ color: '#EA4335' }}>{errors.genero.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A5A' }}>Email</label>
          <input type="email" {...register('email')} className="w-full p-2 rounded" style={{ border: '1px solid #D9D9D9', color: '#1A1A1A' }} />
          {errors.email && <p className="text-xs mt-1" style={{ color: '#EA4335' }}>{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A5A' }}>Celular</label>
          <input {...register('celular')} className="w-full p-2 rounded" placeholder="3001234567" style={{ border: '1px solid #D9D9D9', color: '#1A1A1A' }} />
          {errors.celular && <p className="text-xs mt-1" style={{ color: '#EA4335' }}>{errors.celular.message}</p>}
        </div>

        {/* Foto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A5A' }}>Foto de Perfil (Max 2MB)</label>
          <input type="file" accept="image/*" {...register('foto')} className="w-full p-2 rounded" style={{ border: '1px solid #D9D9D9', color: '#1A1A1A' }} />
          {errors.foto && <p className="text-xs mt-1" style={{ color: '#EA4335' }}>{errors.foto.message as string}</p>}
        </div>

        {/* Botón Submit */}
        <div className="md:col-span-2 mt-4">
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            style={{ backgroundColor: '#3A7BD5' }}
            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#2d5fa3')}
            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#3A7BD5')}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Persona'}
          </button>
          {serverError && <p className="text-center mt-2" style={{ color: '#EA4335' }}>{serverError}</p>}
        </div>
      </form>
    </main>
  );
}
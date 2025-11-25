'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// OJO: Creamos un schema parcial porque al editar la foto es opcional
import { PersonaSchema, PersonaFormData } from '@/lib/definitions'; 
import { getPersonaById, updatePersona } from '@/lib/api';
import { useRouter } from 'next/navigation'; // OJO: Importar de next/navigation
import { use } from 'react'; // Importar use para unwrap Promise params

// Schema modificado para edición: la foto puede venir vacía (no se actualiza)
const EditSchema = PersonaSchema.extend({
  foto: PersonaSchema.shape.foto.optional(), 
});

export default function EditarPersonaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Unwrap Promise params
  const router = useRouter();
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PersonaFormData>({
    resolver: zodResolver(EditSchema),
  });

  // 1. Cargar datos de la persona al entrar
  useEffect(() => {
    getPersonaById(id).then((data) => {
      // Mapear campos backend (firstName, surname, etc.) a frontend schema (primerNombre, apellidos, etc.)
      const mappedData = {
        tipoDocumento: data.idType,
        nroDocumento: data.id,
        primerNombre: data.firstName,
        segundoNombre: data.secondName,
        apellidos: data.surname,
        fechaNacimiento: data.birthdate,
        genero: data.gender,
        email: data.email,
        celular: data.phone,
      };
      
      // Formatear fecha para el input type="date" (YYYY-MM-DD)
      const fechaFormat = mappedData.fechaNacimiento ? new Date(mappedData.fechaNacimiento).toISOString().split('T')[0] : '';
      
      reset({ ...mappedData, fechaNacimiento: fechaFormat });
      setIsLoadingData(false);
    });
  }, [id, reset]);

  // 2. Enviar actualización
  const onSubmit = async (data: PersonaFormData) => {
    const formData = new FormData();
    
    // Mapeo de campos Frontend -> Backend
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
      
      // Solo enviamos la foto si el usuario subió una nueva
      if (key === 'foto') {
         if (value && value.length > 0) formData.append(backendKey, value[0]);
      } else if (value !== undefined && value !== null && value !== '') {
         formData.append(backendKey, value as string);
      }
    });

    try {
      await updatePersona(id, formData);
      alert('Actualizado correctamente');
      router.push('/personas');
    } catch (e) {
      alert('Error al actualizar');
    }
  };

  if (isLoadingData) return <p className="p-6" style={{ color: '#5A5A5A' }}>Cargando datos...</p>;

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A1A1A' }}>Editar Persona</h2>
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
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A5A' }}>Foto de Perfil (Max 2MB) - Opcional</label>
          <input type="file" accept="image/*" {...register('foto')} className="w-full p-2 rounded" style={{ border: '1px solid #D9D9D9', color: '#1A1A1A' }} />
          {errors.foto && <p className="text-xs mt-1" style={{ color: '#EA4335' }}>{errors.foto.message as string}</p>}
        </div>

        {/* Botón Submit */}
        <div className="md:col-span-2 mt-4">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full text-white font-bold py-2 rounded disabled:opacity-50"
            style={{ backgroundColor: '#F4B400' }}
            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#d4a000')}
            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#F4B400')}
          >
            {isSubmitting ? 'Actualizando...' : 'Actualizar Datos'}
          </button>
        </div>
      </form>
    </main>
  );
}
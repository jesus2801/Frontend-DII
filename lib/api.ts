const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function createPersona(data: FormData) {
  const res = await fetch(`${API_URL}/personas`, {
    method: 'POST',
    body: data, // Enviamos FormData para manejar la imagen
  });
  if (!res.ok) throw new Error('Error al crear persona');
  return res.json();
}

export async function getPersonas() {
  const res = await fetch(`${API_URL}/personas`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener personas');
  return res.json();
}

export async function deletePersona(id: string) {
  const res = await fetch(`${API_URL}/personas/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al borrar');
  return res.json();
}

export async function queryRAG(question: string) {
  const res = await fetch(`${API_URL}/rag/consulta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error('Error en el servicio RAG');
  return res.json();
}

// Obtener una persona por ID (Para edición)
export async function getPersonaById(id: string) {
  const res = await fetch(`${API_URL}/personas/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener persona');
  return res.json();
}

// Actualizar persona (PUT)
export async function updatePersona(id: string, data: FormData) {
  const res = await fetch(`${API_URL}/personas/${id}`, {
    method: 'PUT',
    body: data,
  });
  if (!res.ok) throw new Error('Error al actualizar');
  return res.json();
}

// Obtener Logs
export async function getLogs() {
  const res = await fetch(`${API_URL}/logs`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener logs');
  return res.json();
}
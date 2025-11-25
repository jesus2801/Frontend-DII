const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

// ==========================================
// Utilidades
// ==========================================

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function clearAuthAndRedirect() {
  if (typeof document !== 'undefined') {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/login';
  }
}

// ==========================================
// Cliente API Centralizado
// ==========================================

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: FormData | object;
  cache?: RequestCache;
  customError?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, cache = 'no-store', customError } = options;

  // Obtener token
  const token = getCookie('token');
  const headers: Record<string, string> = {};

  // Agregar token si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Configurar body y Content-Type
  let requestBody: BodyInit | undefined;
  if (body) {
    if (body instanceof FormData) {
      // FormData: NO establecer Content-Type, el navegador lo hace automáticamente
      requestBody = body;
    } else {
      // JSON: establecer Content-Type y serializar
      headers['Content-Type'] = 'application/json';
      requestBody = JSON.stringify(body);
    }
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      method,
      headers,
      body: requestBody,
      cache,
    });

    // Manejar errores HTTP
    if (!res.ok) {
      const status = res.status;
      let errorMessage = customError || 'Error en la petición';

      // Intentar obtener mensaje de error del servidor
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Si no es JSON, intentar como texto
        try {
          const errorText = await res.text();
          if (errorText) errorMessage = errorText;
        } catch {
          // Si falla todo, usar mensaje por defecto según status
        }
      }

      // Manejar errores específicos
      switch (status) {
        case 401:
          // Token inválido o expirado
          console.warn('Token inválido o expirado. Redirigiendo a login...');
          clearAuthAndRedirect();
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');

        case 403:
          throw new Error('No tienes permisos para realizar esta acción.');

        case 404:
          throw new Error('Recurso no encontrado.');

        case 429:
          throw new Error('Demasiadas peticiones. Por favor, intenta más tarde.');

        case 500:
        case 502:
        case 503:
          throw new Error('Error del servidor. Por favor, intenta más tarde.');

        default:
          throw new Error(errorMessage);
      }
    }

    // Si la respuesta está vacía (204 No Content), retornar null
    if (res.status === 204 || res.headers.get('content-length') === '0') {
      return null as T;
    }

    return await res.json();
  } catch (error) {
    // Si es un error de red, mostrar mensaje amigable
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Error de conexión:', error);
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    }
    throw error;
  }
}

// ==========================================
// API de Personas
// ==========================================

export async function createPersona(data: FormData) {
  return apiRequest('/personas', {
    method: 'POST',
    body: data,
    customError: 'Error al crear persona',
  });
}

export async function getPersonas() {
  return apiRequest('/personas', {
    method: 'GET',
    cache: 'no-store',
  });
}

export async function getPersonaById(id: string) {
  return apiRequest(`/personas/${id}`, {
    method: 'GET',
    cache: 'no-store',
    customError: 'Error al obtener persona',
  });
}

export async function updatePersona(id: string, data: FormData) {
  return apiRequest(`/personas/${id}`, {
    method: 'PUT',
    body: data,
    customError: 'Error al actualizar persona',
  });
}

export async function deletePersona(id: string) {
  return apiRequest(`/personas/${id}`, {
    method: 'DELETE',
    customError: 'Error al eliminar persona',
  });
}

// ==========================================
// API de RAG/Query
// ==========================================

export async function queryRAG(question: string) {
  return apiRequest('/rag/consulta', {
    method: 'POST',
    body: { question },
    customError: 'Error en el servicio RAG',
  });
}

// ==========================================
// API de Logs
// ==========================================

export async function getLogs() {
  return apiRequest('/logs', {
    method: 'GET',
    cache: 'no-store',
    customError: 'Error al obtener logs',
  });
}
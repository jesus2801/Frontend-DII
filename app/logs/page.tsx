'use client';

import { useEffect, useState } from 'react';
import { getLogs } from '@/lib/api';
import { FileText } from 'lucide-react';

interface Log {
  id: string;
  fecha: string; // O Date
  accion: string; // "CREAR", "ELIMINAR", etc.
  descripcion: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLogs()
      .then(setLogs)
      .catch(() => alert('Error cargando logs'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-slate-800 text-white rounded-lg">
          <FileText size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Auditoría del Sistema</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Cargando historial...</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {logs.map((log) => (
              <li key={log.id} className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase mr-2 ${
                    log.accion === 'ELIMINAR' ? 'bg-red-100 text-red-700' : 
                    log.accion === 'CREAR' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {log.accion}
                  </span>
                  <span className="text-slate-700">{log.descripcion}</span>
                </div>
                <div className="text-sm text-slate-400 whitespace-nowrap">
                  {new Date(log.fecha).toLocaleString()}
                </div>
              </li>
            ))}
            {logs.length === 0 && <li className="p-4 text-center text-slate-500">No hay registros aún.</li>}
          </ul>
        )}
      </div>
    </main>
  );
}
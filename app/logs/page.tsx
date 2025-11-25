'use client';

import { useEffect, useState } from 'react';
import { getLogs } from '@/lib/api';
import { FileText } from 'lucide-react';

interface Log {
  _id?: string;
  id?: string;
  time: string | Date; // fecha del log
  action: string; // "Created", "Modified", "Deleted", etc.
  data?: any;
  errorMessage?: string;
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
        <div className="p-3 text-white rounded-lg" style={{ backgroundColor: '#0A2240' }}>
          <FileText size={24} />
        </div>
        <h1 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>Auditoría del Sistema</h1>
      </div>

      <div className="shadow rounded-lg overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9D9D9' }}>
        {loading ? (
          <div className="p-8 text-center" style={{ color: '#5A5A5A' }}>Cargando historial...</div>
        ) : (
          <ul className="divide-y" style={{ borderColor: '#D9D9D9' }}>
            {logs.map((log, index) => (
              <li key={log.id || `log-${index}`} className="p-4 flex flex-col sm:flex-row justify-between gap-2 hover:bg-gray-50">
                <div>
                  <span 
                    className="text-xs font-bold px-2 py-1 rounded uppercase mr-2"
                    style={{
                      backgroundColor: log.action === 'Deleted' ? '#ffebee' : 
                                      log.action === 'Created' ? '#e8f5e9' : '#e3f2fd',
                      color: log.action === 'Deleted' ? '#EA4335' : 
                             log.action === 'Created' ? '#34A853' : '#3A7BD5'
                    }}
                  >
                    {log.action}
                  </span>
                  <span style={{ color: '#1A1A1A' }}>{log.errorMessage || log.action}</span>
                </div>
                <div className="text-sm whitespace-nowrap" style={{ color: '#5A5A5A' }}>
                  {log.time ? new Date(log.time).toLocaleString() : 'N/A'}
                </div>
              </li>
            ))}
            {logs.length === 0 && <li className="p-4 text-center" style={{ color: '#5A5A5A' }}>No hay registros aún.</li>}
          </ul>
        )}
      </div>
    </main>
  );
}
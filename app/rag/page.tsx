'use client';
import { useState } from 'react';
import { queryRAG } from '@/lib/api';
import { Send, Bot } from 'lucide-react';

export default function RagPage() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResponse(''); // Limpiar anterior
    try {
      const data = await queryRAG(question);
      // Asumiendo que el backend devuelve { answer: "Pedro Pérez..." }
      setResponse(data.answer); 
    } catch (err) {
      setResponse('Error al consultar el modelo de IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold flex justify-center items-center gap-2" style={{ color: '#1A1A1A' }}>
          <Bot className="w-8 h-8" style={{ color: '#3A7BD5' }} />
          Consulta Inteligente (RAG)
        </h2>
        <p style={{ color: '#5A5A5A' }}>Pregunta sobre los empleados registrados en lenguaje natural.</p>
      </div>

      <div className="rounded-xl shadow-lg p-6 min-h-[400px] flex flex-col justify-between" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9D9D9' }}>
        
        {/* Área de Respuesta */}
        <div className="flex-1 mb-6 rounded-lg p-4 overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
            {loading ? (
                <div className="flex items-center gap-2" style={{ color: '#5A5A5A' }}>
                    <span className="animate-spin">🌀</span> Analizando base de datos...
                </div>
            ) : response ? (
                <div>
                    <h4 className="font-bold mb-2" style={{ color: '#1A1A1A' }}>Respuesta:</h4>
                    <p className="leading-relaxed" style={{ color: '#1A1A1A' }}>{response}</p>
                </div>
            ) : (
                <p className="text-center italic mt-10" style={{ color: '#5A5A5A' }}>
                    Ej: "¿Cuál es el empleado más joven que se ha registrado?"
                </p>
            )}
        </div>

        {/* Input */}
        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Haz una pregunta..."
            className="flex-1 rounded-full px-4 py-3 focus:outline-none focus:ring-2"
            style={{ border: '1px solid #D9D9D9', color: '#1A1A1A' }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#3A7BD5'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#D9D9D9'}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="text-white rounded-full p-3 transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#3A7BD5' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2d5fa3')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#3A7BD5')}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
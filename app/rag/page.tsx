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
        <h2 className="text-3xl font-bold flex justify-center items-center gap-2">
          <Bot className="w-8 h-8 text-blue-600" />
          Consulta Inteligente (RAG)
        </h2>
        <p className="text-slate-500">Pregunta sobre los empleados registrados en lenguaje natural.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border p-6 min-h-[400px] flex flex-col justify-between">
        
        {/* Área de Respuesta */}
        <div className="flex-1 mb-6 bg-slate-50 rounded-lg p-4 overflow-y-auto">
            {loading ? (
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="animate-spin">🌀</span> Analizando base de datos...
                </div>
            ) : response ? (
                <div>
                    <h4 className="font-bold text-slate-700 mb-2">Respuesta:</h4>
                    <p className="text-slate-800 leading-relaxed">{response}</p>
                </div>
            ) : (
                <p className="text-slate-400 text-center italic mt-10">
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
            className="flex-1 border border-slate-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
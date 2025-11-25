import Link from "next/link";
import { UserPlus, Search, Bot, FileText, Trash2, Edit } from "lucide-react";

const MenuOption = ({ title, href, icon: Icon, bgColor }: any) => (
  <Link 
    href={href} 
    className="flex flex-col items-center justify-center p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 group cursor-pointer"
    style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9D9D9' }}
  >
    <div className="p-4 rounded-full text-white mb-4 group-hover:opacity-90" style={{ backgroundColor: bgColor }}>
      <Icon size={32} />
    </div>
    <h3 className="font-semibold text-center" style={{ color: '#1A1A1A' }}>{title}</h3>
  </Link>
);

export default function Home() {
  return (
    <main className="container mx-auto p-12">
      <h1 className="text-4xl font-bold text-center mb-12" style={{ color: '#1A1A1A' }}>Menú Principal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <MenuOption title="Crear Personas" href="/personas/crear" icon={UserPlus} bgColor="#3A7BD5" />
        <MenuOption title="Modificar Datos" href="/personas" icon={Edit} bgColor="#F4B400" />
        <MenuOption title="Consultar Datos" href="/personas" icon={Search} bgColor="#34A853" />
        <MenuOption title="Consulta Lenguaje Natural" href="/rag" icon={Bot} bgColor="#1F4E79" />
        <MenuOption title="Borrar Personas" href="/personas" icon={Trash2} bgColor="#EA4335" />
        <MenuOption title="Consultar Log" href="/logs" icon={FileText} bgColor="#0A2240" />
      </div>
    </main>
  );
}
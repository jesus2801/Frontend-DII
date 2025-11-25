import Link from "next/link";
import { UserPlus, Search, Bot, FileText, Trash2, Edit } from "lucide-react";

const MenuOption = ({ title, href, icon: Icon, color }: any) => (
  <Link 
    href={href} 
    className={`flex flex-col items-center justify-center p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 group cursor-pointer`}
  >
    <div className={`p-4 rounded-full ${color} text-white mb-4 group-hover:opacity-90`}>
      <Icon size={32} />
    </div>
    <h3 className="font-semibold text-slate-700 text-center">{title}</h3>
  </Link>
);

export default function Home() {
  return (
    <main className="container mx-auto p-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-slate-800">Menú Principal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <MenuOption title="Crear Personas" href="/personas/crear" icon={UserPlus} color="bg-blue-600" />
        <MenuOption title="Modificar Datos" href="/personas" icon={Edit} color="bg-orange-500" />
        <MenuOption title="Consultar Datos" href="/personas" icon={Search} color="bg-green-600" />
        <MenuOption title="Consulta Lenguaje Natural" href="/rag" icon={Bot} color="bg-purple-600" />
        <MenuOption title="Borrar Personas" href="/personas" icon={Trash2} color="bg-red-600" />
        <MenuOption title="Consultar Log" href="/logs" icon={FileText} color="bg-slate-600" />
      </div>
    </main>
  );
}
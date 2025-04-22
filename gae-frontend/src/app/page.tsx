import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';


export default function Home() {
  return (
    <div
      className="relative flex flex-col items-center justify-start min-h-screen bg-cover bg-bottom"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      {/* Navbar/Header */}
      <header className="w-full bg-white/10 backdrop-blur-md shadow-md py-4 px-6 flex flex-col items-center sm:flex-row sm:justify-between">
        {/* Logo + Título */}
        <div className="flex items-center space-x-4">
          <img src="/GAE-Icon.png" alt="Ícone HUOC" className="h-10" />
          <div>
            <h1 className="text-xl font-bold text-cyan-800">GAE-Hub</h1>
            <p className="text-sm text-gray-700">Gestão de Atividades Extracurriculares</p>
          </div>
        </div>

        {/* Botão de login */}
        <div className="mt-4 sm:mt-0">
          <Link href="/login">
            <button className="bg-cyan-600 hover:bg-cyan-800 text-white py-2 px-6 rounded-full transition-all">
              <strong><i className="bi bi-box-arrow-in-right"></i> Login</strong>
            </button>
          </Link>
        </div>
      </header>

      {/* Conteúdo restante da página, se houver */}
      <main className="flex-1 flex flex-col items-center justify-center text-center text-white">
        <h2 className="text-3xl font-semibold mb-4">Bem-vindo ao GAE-Hub!</h2>
        <p className="text-lg mb-6">Otimizamos a gestão e armazenamento de suas atividades complementares.</p>
      </main>
    </div>
  );
}

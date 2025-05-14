'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AuthenticatedNavbar() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <header className="w-full bg-white/10 backdrop-blur-md shadow-md py-4 px-6 flex flex-col items-center sm:flex-row sm:justify-between">
      <div className="flex items-center space-x-4">
        <img src="/GAE-Icon.png" alt="Ícone HUOC" className="h-10" />
        <div>
          <h1 className="text-xl font-bold text-cyan-800">GAE-Hub</h1>
          <p className="text-sm text-gray-700">Gestão de Atividades</p>
        </div>
      </div>

      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
        <Link href="/dashboard">
          <i className="bi bi-house-door-fill text-cyan-800 text-xl hover:text-cyan-900"></i>
        </Link>
        <Link href="/activities">
          <i className="bi bi-list-ul text-cyan-800 text-xl hover:text-cyan-900"></i>
        </Link>
        <Link href="/activities/new">
          <i className="bi bi-plus-circle text-cyan-800 text-xl hover:text-cyan-900"></i>
        </Link>
        <button onClick={handleLogout} title="Sair">
          <i className="bi bi-box-arrow-right text-red-600 text-xl hover:text-red-800"></i>
        </button>
      </div>
    </header>
  )
}

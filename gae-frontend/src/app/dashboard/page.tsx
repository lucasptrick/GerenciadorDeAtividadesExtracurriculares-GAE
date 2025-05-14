'use client'

import { useState, useEffect } from 'react'
import PrivateRoute from '@/components/PrivateRoute'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import axios from 'axios'

interface Activity {
  semestre: string
  cargaHoraria: number
}

interface Resumo {
  semestre: string
  horas: number
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [resumoSemestral, setResumoSemestral] = useState<Resumo[]>([])

  useEffect(() => {
    // Função para buscar as atividades do usuário e calcular o resumo semestral
    const fetchActivities = async () => {
      try {
        // Recuperando o token do localStorage
        const token = localStorage.getItem('token')

        // Verificando se o token existe
        if (!token) {
          console.error('Token não encontrado')
          return
        }

        // Usando axios para buscar as atividades
        const response = await axios.get('http://localhost:3000/activities', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Log para verificar a estrutura da resposta
        console.log('Dados recebidos da API:', response.data)

        const activities: Activity[] = response.data // Esperamos que a resposta seja um array

        // Filtrando e somando as horas por semestre
        const resumo = activities.reduce<{ [key: string]: number }>((acc, activity) => {
          const { semestre, cargaHoraria } = activity
          if (!acc[semestre]) {
            acc[semestre] = 0
          }
          acc[semestre] += cargaHoraria
          return acc
        }, {})

        // Convertendo para um array de objetos para exibição
        const resumoArray: Resumo[] = Object.keys(resumo).map((semestre) => ({
          semestre,
          horas: resumo[semestre],
        }))

        setResumoSemestral(resumoArray)
      } catch (error) {
        console.error('Erro ao buscar atividades:', error)
      }
    }

    if (user) {
      fetchActivities()
    }
  }, [user]) // O efeito é disparado quando o usuário é alterado

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-cyan-50 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">

          {/* Header com saudação */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-cyan-800">
                Olá, {user?.nome || 'Estudante'}
              </h1>
              <p className="text-gray-600 text-sm">Email: {user?.email}</p>
            </div>

            {/* Botão para ir para a página de atividades */}
            <div className="text-center flex gap-2">
                
                <Link href="/activities">
                <button className="bg-cyan-600 hover:bg-cyan-800 text-white py-2 px-6 rounded-full transition-all font-semibold">
                    <i className="bi bi-clipboard-data-fill"></i> Minhas Atividades
                </button>
                </Link>

                <button
                onClick={logout}
                className="mt-4 sm:mt-0 bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full transition-all font-semibold"
                >
                <i className="bi bi-box-arrow-left"></i> Sair
                </button>

            </div>
          </header>

          {/* Resumo de atividades por semestre */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-cyan-700 mb-4">Resumo de Horas por Semestre</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumoSemestral.length === 0 ? (
                <div className="text-center text-gray-500 col-span-full">Nenhuma atividade registrada para exibir</div>
              ) : (
                resumoSemestral.map(({ semestre, horas }) => (
                  <div key={semestre} className="bg-cyan-100 p-4 rounded-xl shadow hover:shadow-md transition">
                    <h3 className="text-cyan-800 font-medium text-lg">{semestre}</h3>
                    <p className="text-gray-700 text-sm">Horas acumuladas:</p>
                    <span className="text-xl font-bold text-cyan-900">{horas}h</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </PrivateRoute>
  )
}

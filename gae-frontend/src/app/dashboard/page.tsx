'use client'

import { useState, useEffect } from 'react'
import PrivateRoute from '@/components/PrivateRoute'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import axios from 'axios'

interface Activity {
  id: number
  atividadeRealizada: string
  categoriaAtividade: string
  certificadoURL: string
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
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null)
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [allActivities, setAllActivities] = useState<Activity[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('Token não encontrado')
          return
        }

        const response = await axios.get('http://localhost:3000/activities', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('Dados recebidos da API:', response.data)
        const activities: Activity[] = response.data
        setAllActivities(activities)

        const resumo = activities.reduce<{ [key: string]: number }>((acc, activity) => {
          const { semestre, cargaHoraria } = activity
          if (!acc[semestre]) {
            acc[semestre] = 0
          }
          acc[semestre] += cargaHoraria
          return acc
        }, {})

        const resumoArray: Resumo[] = Object.keys(resumo)
          .map((semestre) => ({
            semestre,
            horas: resumo[semestre],
          }))
          .sort((a, b) => b.semestre.localeCompare(a.semestre)) // Ordena semestres em ordem decrescente

        setResumoSemestral(resumoArray)
      } catch (error) {
        console.error('Erro ao buscar atividades:', error)
      }
    }

    if (user) {
      fetchActivities()
    }
  }, [user])


  // FALTA CORRIGIR!!! 
  const openModal = async (semestre: string) => {
    const token = localStorage.getItem('token')
        if (!token) {
          console.error('Token não encontrado')
          return
        }
    
    const response = await axios.get(`http://localhost:3000/activities/semestre/${semestre}`, {
      headers: { Authorization: `Bearer ${token}` },
})
setFilteredActivities(response.data)
setSelectedSemester(semestre)

  }

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-cyan-50 p-6"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        <div className="max-w-4xl mx-auto bg-white/80 shadow-xl rounded-2xl p-8">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-cyan-800">
                Olá, {user?.nome || 'Estudante'}
              </h1>
              <p className="text-gray-600 text-sm">Matrícula: {user?.matricula}</p>
            </div>

            <div className="text-center flex gap-2">
              <Link href="/activities">
                <button className="bg-cyan-600 hover:bg-cyan-800 text-white px-4 py-2 rounded transition-all font-semibold">
                  <i className="bi bi-clipboard-data-fill"></i> Minhas Atividades
                </button>
              </Link>

              <button
                onClick={logout}
                className="mt-4 sm:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all font-semibold"
              >
                <i className="bi bi-box-arrow-left"></i> Sair
              </button>
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-cyan-700 mb-4">Resumo de Horas por Semestre</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumoSemestral.length === 0 ? (
                <div className="text-center text-gray-500 col-span-full">Nenhuma atividade registrada para exibir</div>
              ) : (
                resumoSemestral.map(({ semestre, horas }) => (
                  <div
                    key={semestre}
                    onClick={() => openModal(semestre)}
                    className="cursor-pointer bg-[#dff5c5] p-4 rounded-xl shadow hover:shadow-md transition"
                  >
                    <h3 className="text-cyan-800 font-medium text-lg">{semestre}</h3>
                    <p className="text-gray-700 text-sm">Horas acumuladas:</p>
                    <span className="text-xl font-bold text-cyan-900">{horas}h</span>
                  </div>
                ))
              )}
            </div>
          </section>

          {selectedSemester && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
                <h3 className="text-lg font-bold text-cyan-800 mb-2">Atividades de {selectedSemester}</h3>
                <ul className="max-h-64 overflow-y-auto space-y-2">
                  {filteredActivities.length === 0 ? (
                    <p className="text-gray-500">Nenhuma atividade encontrada para este semestre.</p>
                  ) : (
                    filteredActivities.map((activity, index) => (
                      <li key={index} className="border p-3 rounded bg-gray-50">
                        <p><strong>Atividade:</strong> {activity.atividadeRealizada}</p>
                        <p><strong>Categoria:</strong> {activity.categoriaAtividade}</p>
                        <p><strong>Carga Horária:</strong> {activity.cargaHoraria}h</p>
                        {activity.certificadoURL && (
                          <p>
                            <strong>Certificado:</strong>{' '}
                            <a href={activity.certificadoURL} target="_blank" className="text-blue-600 underline">
                              Ver certificado
                            </a>
                          </p>
                        )}
                      </li>
                    ))
                  )}
                </ul>
                <button
                  onClick={() => setSelectedSemester(null)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </PrivateRoute>
  )
}

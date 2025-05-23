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
  const [, setAllActivities] = useState<Activity[]>([])
  const [totalHoras, setTotalHoras] = useState<number>(0)


  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // const token = localStorage.getItem('token')
        // if (!token) {
        //   console.error('Token não encontrado')
        //   return
        // }

        const response = await axios.get('http://localhost:3000/activities', {
         withCredentials: true,
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        })

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

  useEffect(() => {
    const total = resumoSemestral.reduce((acc, item) => acc + item.horas, 0)
    setTotalHoras(total)
  }, [resumoSemestral])



  // FALTA CORRIGIR!!! 
  const openModal = async (semestre: string) => {
    // const token = localStorage.getItem('token')
    //     if (!token) {
    //       console.error('Token não encontrado')
    //       return
    //     }
    
    const response = await axios.get(`http://localhost:3000/activities/semestre/${semestre}`, {
      withCredentials: true,
      // headers: { Authorization: `Bearer ${token}` },
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
              <p className="text-gray-600 text-sm"> Matrícula:{' '}
                <span className="text-cyan-800 text-body">{user?.matricula}</span>
              </p>
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
            <h2 className="text-center text-xl font-semibold text-cyan-700">Resumo de Horas por Semestre</h2>
            <hr className="border-1 border-cyan-700" />


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {resumoSemestral.length === 0 ? (
                  <div className="text-center text-gray-500 col-span-full">Nenhuma atividade registrada para
                    exibir</div>
              ) : (
                  resumoSemestral.map(({semestre, horas}) => (
                      <div
                          key={semestre}
                          onClick={() => openModal(semestre)}
                          className="text-center cursor-pointer bg-[#dff5c5] p-4 rounded-xl shadow hover:shadow-md transition"
                      >
                        <h3 className="text-cyan-800 font-extrabold text-xl">{semestre}</h3>
                        <p className="text-gray-700 text-sm">Horas acumuladas:{<span
                            className={`font-monospace`}> {horas}h
                        </span>}</p>

                      </div>
                  ))
              )}
            </div>
          </section>

          {selectedSemester && (
            <div className="fixed inset-0 bg-cyan-950/30 transition-opacity flex justify-center items-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
                <h3 className="text-lg font-bold text-cyan-800 mb-2">Atividades de {selectedSemester}</h3>
                <ul className="  text-black max-h-64 overflow-y-auto space-y-2">
                  {filteredActivities.length === 0 ? (
                    <p className="text-gray-500">Nenhuma atividade encontrada para este semestre.</p>
                  ) : (
                    filteredActivities.map((activity, index) => (
                      <li key={index} className="border p-3 rounded bg-[#EDEDED]">
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
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-3xl font-bold"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          <hr className="border-1 border-cyan-700 mt-3" />
          <h2 className="text-center text-xl font-semibold mt-3 text-cyan-700"> Total de Horas Complementares: {" "}
            <span
              className={ totalHoras < 150
                  ? "text-red-600"
                  : totalHoras >= 150 && totalHoras <= 190
                      ? "text-yellow-500"
                      : "text-green-600"
              }
            >
              {totalHoras}h
            </span>
          </h2>


        </div>
      </main>
    </PrivateRoute>
  )
}

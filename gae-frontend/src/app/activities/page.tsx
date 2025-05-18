'use client'

import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import PrivateRoute from '@/components/PrivateRoute'
import axios from 'axios'

interface Activity {
  id: number
  atividadeRealizada: string
  categoriaAtividade: string
  certificadoURL: string
  semestre: string
  cargaHoraria: number
}


export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    atividadeRealizada: '',
    categoriaAtividade: '',
    cargaHoraria: 0,
    semestre: "2022.2",
    certificadoURL: '',
})
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()


  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/activities', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setActivities(response.data)
    } catch (error) {
      console.error('Erro ao buscar atividades', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3000/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setIsOpen(false)
      fetchActivities()
    } catch (error) {
      console.error('Erro ao deletar atividade', error)
    }
  }

  const handleUpdate = async () => {
    if (!selectedActivity) return
    try {
      const token = localStorage.getItem('token')
      const { id, ...updateData } = selectedActivity
      await axios.patch(`http://localhost:3000/activities/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setIsEditing(false)
      setIsOpen(false)
      fetchActivities()
    } catch (error) {
      console.error('Erro ao atualizar atividade', error)
    }
  }

  const handleChange = (field: keyof Activity, value: string | number) => {
    if (selectedActivity) {
      setSelectedActivity({ ...selectedActivity, [field]: value })
    }
  }

  const handleNewChange = (field: keyof typeof newActivity, value: string | number) => {
    setNewActivity({ ...newActivity, [field]: value })
  }

  const handleCreate = async () => {
    try {
        const token = localStorage.getItem('token');
        
        // Converta semestre para número
        const updatedActivity = {
        ...newActivity,
        semestre: parseInt(newActivity.semestre.toString()),  // Converte para número
        };

        const response = await axios.post('http://localhost:3000/activities', updatedActivity, {
        headers: { Authorization: `Bearer ${token}` },
        });

        setIsCreating(false);
        setNewActivity({
        atividadeRealizada: '',
        categoriaAtividade: '',
        cargaHoraria: 0,
        semestre: "2024.1", // Deixe o valor inicial como número
        certificadoURL: '',
        });
        fetchActivities();
    } catch (error) {
        console.error('Erro ao criar atividade', error);
    }
    };


  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-cyan-50 p-6"
      style={{ backgroundImage: "url('/bg.png')" }}
      >
        
        <div className="max-w-4xl mx-auto bg-white/80 shadow-xl rounded-2xl p-8">

      <div className="p-6 ">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-cyan-800">Minhas Atividades</h1>

            <div className='flex gap-4'>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-cyan-600 text-white px-4 py-2 rounded font-semibold hover:bg-cyan-800">
                    <i className="bi bi-clipboard-plus-fill"></i> Adicionar Atividade
                </button>

                <button
                    onClick={() => router.back()}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    <i className="bi bi-arrow-left-circle-fill"></i> Voltar
                </button>
            </div>
        </div>



        <div className="overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200 shadow rounded-3xl">
            <thead className="bg-cyan-700 text-white">
              <tr className='text-center'>
                <th className="px-4 py-2 ">ID</th>
                <th className="px-4 py-2 ">Atividade Realizada</th>
                <th className="px-4 py-2 ">Categoria</th>
                <th className="px-4 py-2 ">Carga Horária</th>
                <th className="px-4 py-2 ">Semestre</th>
                <th className="px-4 py-2 ">Certificado</th>
                <th className="px-4 py-2 "></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50 text-black font-sans text-center">
                  <td className="px-4 py-2">{activity.id}</td>
                  <td className="px-4 py-2">{activity.atividadeRealizada}</td>
                  <td className="px-4 py-2">{activity.categoriaAtividade}</td>
                  <td className="px-4 py-2">{activity.cargaHoraria}h</td>
                  <td className="px-4 py-2">{activity.semestre}</td>
                  <td className="px-4 py-2">
                    <a
                      href={activity.certificadoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 hover:underline"
                      >
                      Ver Certificado
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setSelectedActivity(activity)
                        setIsEditing(false)
                        setIsOpen(true)
                      }}
                      className="bg-cyan-600 text-white px-1 py-1 rounded hover:bg-cyan-800 transition"
                      >
                      <BiDotsVerticalRounded size={28} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Criação de Atividades */}
        <Dialog open={isCreating} onClose={() => setIsCreating(false)} className="z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                
                <Dialog.Title className="text-xl font-bold text-cyan-800 mb-4">
                    Nova Atividade
                </Dialog.Title>
                <div className="space-y-2 text-black">
                    <label className="block">
                    <span className="text-sm font-medium">Atividade Realizada</span>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={newActivity.atividadeRealizada}
                        onChange={(e) => handleNewChange('atividadeRealizada', e.target.value)}
                        />
                    </label>
                    <label className="block">
                    <span className="text-sm font-medium">Categoria</span>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={newActivity.categoriaAtividade}
                        onChange={(e) => handleNewChange('categoriaAtividade', e.target.value)}
                        />
                    </label>
                    <label className="block">
                    <span className="text-sm font-medium">Carga Horária</span>
                    <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={newActivity.cargaHoraria}
                        onChange={(e) => handleNewChange('cargaHoraria', Number(e.target.value))}
                        />
                    </label>
                    <label className="block">
                    <span className="text-sm font-medium">Semestre</span>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={newActivity.semestre}
                        onChange={(e) => handleNewChange('semestre', e.target.value)}
                        />
                    </label>
                    <label className="block">
                    <span className="text-sm font-medium">URL do Certificado</span>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={newActivity.certificadoURL}
                        onChange={(e) => handleNewChange('certificadoURL', e.target.value)}
                        />
                    </label>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                    onClick={handleCreate}
                    className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-800"
                    >
                    Criar
                    </button>
                    <button
                    onClick={() => setIsCreating(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                    Cancelar
                    </button>
                </div>
                </Dialog.Panel>
            </div>
            </Dialog>


        {/* Modal de Detalhes / Edição */}
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">

            {/* Botão de Fechar DENTRO do painel do modal */}
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-red-300 hover:text-red-600 text-3xl font-bold"
                aria-label="Fechar"
                >
                &times;
            </button>

            <Dialog.Title className="text-xl text-black font-bold mb-4">
                {isEditing ? 'Editar Atividade' : 'Detalhes da Atividade'}
            </Dialog.Title>

              {selectedActivity && (
                <div className="space-y-2 text-black">
                  <p><strong>ID:</strong> {selectedActivity.id}</p>

                  <label className="block">
                    <span className="text-sm font-medium">Atividade Realizada</span>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      disabled={!isEditing}
                      value={selectedActivity.atividadeRealizada}
                      onChange={(e) =>
                        handleChange('atividadeRealizada', e.target.value)
                      }
                      />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">Categoria</span>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      disabled={!isEditing}
                      value={selectedActivity.categoriaAtividade}
                      onChange={(e) =>
                        handleChange('categoriaAtividade', e.target.value)
                      }
                      />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">Carga Horária</span>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      disabled={!isEditing}
                      value={selectedActivity.cargaHoraria}
                      onChange={(e) =>
                        handleChange('cargaHoraria', Number(e.target.value))
                      }
                      />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">Semestre</span>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      disabled={!isEditing}
                      value={selectedActivity.semestre}
                      onChange={(e) =>
                        handleChange('semestre', Number(e.target.value))
                      }
                      />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">URL do Certificado</span>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      disabled={!isEditing}
                      value={selectedActivity.certificadoURL}
                      onChange={(e) =>
                        handleChange('certificadoURL', e.target.value)
                      }
                      />
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                      >
                      Salvar Alterações
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                      >
                      Editar
                    </button>
                    <button
                      onClick={() => selectedActivity && handleDelete(selectedActivity.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                      Apagar
                    </button>
                  </>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
        </div>
        </div>
      </main>      
    </PrivateRoute>
  )
}
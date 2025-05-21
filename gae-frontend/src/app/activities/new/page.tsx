'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import PrivateRoute from '@/components/PrivateRoute'

export default function NewActivityPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [hours, setHours] = useState<number | ''>('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // const token = localStorage.getItem('token')
    try {
      await axios.post(
        'http://localhost:3000/activities',
        {
          title,
          description,
          hours: Number(hours),
        },
        {
          withCredentials: true,
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        }
      )

      router.push('/activities') 
    } catch (error) {
      console.error('Erro ao cadastrar atividade:', error)
    }
  }

  return (
    <PrivateRoute>
      <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
        <h1 className="text-2xl font-bold mb-6">Nova Atividade</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Horas</label>
            <input
              type="number"
              min="1"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </PrivateRoute>
  )
}

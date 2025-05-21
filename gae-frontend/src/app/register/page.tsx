'use client'

import Link from "next/link"
import Image from "next/image"
import toast from "react-hot-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [nome, setNome] = useState("")
  const [matricula, setMatricula] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    const success = await register({ nome, matricula, email, password })
    if (success) {
      toast.success("Cadastro realizado com sucesso!")
      router.push("/login")
    } else {
      toast.error("Erro ao realizar cadastro")
    }
  }

  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-bottom px-4"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="container-home1 mb-6 bg-white/80 shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <section className="container-home2 flex flex-col items-center">
          <Link href="/">
            <figure className="cursor-pointer hover:opacity-80 transition-all">
              <Image
                src="/GAE-Banner.png"
                alt="GAE Logo"
                width={300}
                height={300}
                className="h-36"
              />
            </figure>
          </Link>

          <article className="w-full">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">
                  Matrícula
                </label>
                <input
                  type="text"
                  id="matricula"
                  name="matricula"
                  required
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirme a senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-gray-500"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-800 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                Cadastrar
              </button>

              <p className="mt-4 text-center text-gray-600">
                Já tem conta?{" "}
                <Link href="/login" className="text-cyan-600 hover:underline">
                  Faça login
                </Link>
              </p>
            </form>
          </article>
        </section>
      </div>
    </main>
  )
}

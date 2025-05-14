'use client'

import Link from "next/link"
import Image from "next/image"
import toast from "react-hot-toast"
import { BiLogIn } from "react-icons/bi"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login({ email, password })
    if (success) {
      toast.success("Login realizado com sucesso!")
      router.push("/dashboard") 
    } else {
      toast.error("Credenciais inválidas!")
      // setError("E-mail ou senha inválidos")
    }
  }

  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-bottom px-4"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="container-home1 mb-6 bg-white bg-opacity-90 shadow-lg rounded-2xl p-8 w-full max-w-lg">
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

              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Lembrar-me
                  </label>
                </div>

                <a href="#" className="text-sm text-cyan-600 hover:underline">
                  Esqueci minha senha
                </a>
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-800 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                <i className="bi bi-box-arrow-in-right"></i> Entrar
              </button>
            </form>
          </article>
        </section>
      </div>
    </main>
  )
}

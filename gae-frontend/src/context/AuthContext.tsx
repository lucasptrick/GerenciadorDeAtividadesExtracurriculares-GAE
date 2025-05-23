'use client'

import React, { createContext, useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

// 🔗 Centralizando a API
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

interface AuthUser {
  sub: string
  nome: string
  email: string
  matricula: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (credentials: { email: string; password: string }) => Promise<boolean>
  register: (data: { nome: string; matricula: string; email: string; password: string }) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const router = useRouter()

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      await api.post('/login', { email, password })

      const response = await api.get('/me')
      setUser(response.data)

      router.push('/dashboard') // Redireciona após login, se desejar
      return true
    } catch (err) {
      console.error('Erro ao fazer login:', err)
      return false
    }
  }

  const register = async (data: { nome: string; matricula: string; email: string; password: string }) => {
    try {
      await api.post('/register', data)

      const response = await api.get('/me')
      setUser(response.data)

      router.push('/dashboard') // Redireciona após cadastro, se desejar
      return true
    } catch (err) {
      console.error('Erro ao fazer cadastro:', err)
      return false
    }
  }

  const logout = async () => {
    try {
      await api.post('/logout')
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para facilitar o uso
export const useAuth = () => useContext(AuthContext)

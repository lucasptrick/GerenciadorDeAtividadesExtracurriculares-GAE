'use client'

import React, { createContext, useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

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
      await axios.post(
          'http://localhost:3000/login',
          {email, password},
          {withCredentials: true}
      )

      const response = await axios.get('http://localhost:3000/me', {
        withCredentials: true,
      })

      setUser(response.data)
      return true
    } catch (err) {
      console.error('Erro ao fazer login:',err)
      return false
    }
  }

  const register = async (data: { nome: string; matricula: string; email: string; password: string }) => {
    try {
      await axios.post(
        'http://localhost:3000/register',
        data,
        { withCredentials: true }
      )
      console.log(data)
      return true
    } catch (err) {
      console.error('Erro ao fazer cadastro:', err)
      return false
    }
  }

  const logout = async () => {
  try {
    await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
    localStorage.removeItem('token'); // opcional se usar só cookie
    setUser(null);
    router.push('/login');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};


  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para facilitar o uso
export const useAuth = () => useContext(AuthContext)

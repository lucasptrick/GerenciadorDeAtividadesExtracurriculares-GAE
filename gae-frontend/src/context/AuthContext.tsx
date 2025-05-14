'use client'

import { createContext, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

interface AuthContextType {
  user: any
  login: (credentials: { email: string; password: string }) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setUser(decoded)
      } catch (e) {
        console.error('Token inválido', e)
        logout()
      }
    }
  }, [])

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await axios.post('http://localhost:3000/login', { email, password })
      const { access_token } = response.data
      localStorage.setItem('token', access_token)
      const decoded: any = jwtDecode(access_token)
      setUser(decoded)
      return true
    } catch (err) {
      console.error('Erro ao fazer login:', err)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para facilitar o uso
export const useAuth = () => useContext(AuthContext)

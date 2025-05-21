'use client'

import { createContext, useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
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
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const router = useRouter()

  // useEffect(() => {
  //   const token = localStorage.getItem('token')
  //   if (token) {
  //     try {
  //       const decoded: AuthUser = jwtDecode(token)
  //       setUser(decoded)
  //     } catch (e) {
  //       console.error('Token inválido', e)
  //       logout()
  //     }
  //   }
  // }, [])

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
      console.log(response.data);
      return true
    } catch (err) {
      console.error('Erro ao fazer login:',err)
      return false
    }
    //   const { access_token } = response.data
    //   localStorage.setItem('token', access_token)
    //   const decoded: AuthUser = jwtDecode(access_token)
    //   setUser(decoded)
    //   return true
    // } catch (err) {
    //   console.error('Erro ao fazer login:', err)
    //   return false
    // }
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para facilitar o uso
export const useAuth = () => useContext(AuthContext)

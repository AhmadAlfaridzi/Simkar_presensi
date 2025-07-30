'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  username: string
  role: 'TEKNISI' | 'ADMIN'
}

interface AuthContextProps {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {},
  logout: () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (username: string, password: string) => {
    if (!username || !password) throw new Error('Username dan password diperlukan')

    if (username === 'admin' && password === 'admin123') {
      const userData: User = { username, role: 'ADMIN' }
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    } else if (username === 'teknisi' && password === 'teknisi123') {
      const userData: User = { username, role: 'TEKNISI' }
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    } else {
      throw new Error('Username atau password salah')
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

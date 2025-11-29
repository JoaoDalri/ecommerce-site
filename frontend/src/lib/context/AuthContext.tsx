'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

type User = { name: string; email: string; avatar?: string }

type AuthCtx = {
  user: User | null
  login: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthCtx | undefined>(undefined)

export function useAuth(){
  const c = useContext(AuthContext)
  if (!c) throw new Error('useAuth must be used inside AuthProvider')
  return c
}

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('lumina_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = (email: string) => {
    // Simulação de login
    const newUser = { 
        name: email.split('@')[0], 
        email, 
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}` 
    }
    setUser(newUser)
    localStorage.setItem('lumina_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('lumina_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
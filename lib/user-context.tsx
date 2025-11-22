"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { STORAGE_KEYS } from './constants'

interface UserContextType {
  isAuthenticated: boolean
  userName: string | null
  loginMethod: 'notion' | 'guest' | null
  loginTime: Date | null
  setUserName: (name: string) => void
  loginWithNotion: () => void
  loginAsGuest: (name: string) => void
  logout: () => void
  getGreeting: () => string
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserNameState] = useState<string | null>(null)
  const [loginMethod, setLoginMethod] = useState<'notion' | 'guest' | null>(null)
  const [loginTime, setLoginTime] = useState<Date | null>(null)

  // Load user state from localStorage
  useEffect(() => {
    const savedUserName = localStorage.getItem(STORAGE_KEYS.USER_NAME)
    const savedLoginMethod = localStorage.getItem(STORAGE_KEYS.LOGIN_METHOD) as 'notion' | 'guest' | null
    const savedLoginTime = localStorage.getItem(STORAGE_KEYS.LOGIN_TIME)

    if (savedUserName && savedLoginMethod) {
      setUserNameState(savedUserName)
      setLoginMethod(savedLoginMethod)
      setLoginTime(savedLoginTime ? new Date(savedLoginTime) : new Date())
      setIsAuthenticated(true)
    }
  }, [])

  const setUserName = (name: string) => {
    setUserNameState(name)
    localStorage.setItem(STORAGE_KEYS.USER_NAME, name)
  }

  const loginWithNotion = () => {
    const now = new Date()
    setLoginMethod('notion')
    setLoginTime(now)
    setIsAuthenticated(true)
    localStorage.setItem(STORAGE_KEYS.LOGIN_METHOD, 'notion')
    localStorage.setItem(STORAGE_KEYS.LOGIN_TIME, now.toISOString())
  }

  const loginAsGuest = (name: string) => {
    const now = new Date()
    setUserName(name)
    setLoginMethod('guest')
    setLoginTime(now)
    setIsAuthenticated(true)
    localStorage.setItem(STORAGE_KEYS.LOGIN_METHOD, 'guest')
    localStorage.setItem(STORAGE_KEYS.LOGIN_TIME, now.toISOString())
  }

  const logout = () => {
    setUserNameState(null)
    setLoginMethod(null)
    setLoginTime(null)
    setIsAuthenticated(false)
    localStorage.removeItem(STORAGE_KEYS.USER_NAME)
    localStorage.removeItem(STORAGE_KEYS.LOGIN_METHOD)
    localStorage.removeItem(STORAGE_KEYS.LOGIN_TIME)
  }

  const getGreeting = () => {
    if (!loginTime) return 'Hello'

    const hour = loginTime.getHours()

    if (hour >= 5 && hour < 12) {
      return 'Good morning'
    } else if (hour >= 12 && hour < 17) {
      return 'Good afternoon'
    } else if (hour >= 17 && hour < 22) {
      return 'Good evening'
    } else {
      return 'Good night'
    }
  }

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        userName,
        loginMethod,
        loginTime,
        setUserName,
        loginWithNotion,
        loginAsGuest,
        logout,
        getGreeting,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

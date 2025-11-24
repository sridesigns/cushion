"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { STORAGE_KEYS } from './constants'
import type { SavingsEntry } from './types'

interface NotionContextType {
  isConnected: boolean
  isConnecting: boolean
  connect: (onSuccess?: (userName: string) => void) => void
  disconnect: () => void
  syncData: (entries: SavingsEntry[]) => Promise<void>
  fetchData: () => Promise<SavingsEntry[]>
}

const NotionContext = createContext<NotionContextType | undefined>(undefined)

const NOTION_CLIENT_ID = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID
const NOTION_REDIRECT_URI = typeof window !== 'undefined'
  ? `${window.location.origin}/api/notion/callback`
  : ''

export function NotionProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [onSuccessCallback, setOnSuccessCallback] = useState<((userName: string) => void) | null>(null)

  // Load connection state from localStorage
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN)
    if (token) {
      setAccessToken(token)
      setIsConnected(true)
    }
  }, [])

  // Listen for OAuth callback
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'notion-oauth-success') {
        const { access_token, workspace_id } = event.data
        if (access_token) {
          setAccessToken(access_token)
          setIsConnected(true)
          setIsConnecting(false)
          localStorage.setItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN, access_token)

          // Store workspace ID to identify user across devices
          if (workspace_id) {
            localStorage.setItem(STORAGE_KEYS.NOTION_WORKSPACE_ID, workspace_id)
          }

          // Always call callback without name - onboarding will handle name collection
          if (onSuccessCallback) {
            onSuccessCallback('')
            setOnSuccessCallback(null)
          }
        }
      } else if (event.data.type === 'notion-oauth-error') {
        setIsConnecting(false)
        console.error('Notion OAuth failed:', event.data.error)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onSuccessCallback])

  const connect = (onSuccess?: (userName: string) => void) => {
    if (!NOTION_CLIENT_ID) {
      console.error('Notion Client ID not configured')
      setIsConnecting(false)
      return
    }

    // Store the callback
    if (onSuccess) {
      setOnSuccessCallback(() => onSuccess)
    }

    setIsConnecting(true)

    try {
      // Construct Notion OAuth URL
      const authUrl = new URL('https://api.notion.com/v1/oauth/authorize')
      authUrl.searchParams.set('client_id', NOTION_CLIENT_ID)
      authUrl.searchParams.set('response_type', 'code')
      authUrl.searchParams.set('owner', 'user')
      authUrl.searchParams.set('redirect_uri', NOTION_REDIRECT_URI)

      // Open OAuth popup
      const width = 600
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      const popup = window.open(
        authUrl.toString(),
        'notion-oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      if (!popup) {
        alert('Popup was blocked. Please allow popups for this site to connect with Notion.')
        setIsConnecting(false)
      }
    } catch (error) {
      console.error('Failed to open OAuth popup:', error)
      alert('Failed to connect to Notion. Please try again.')
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAccessToken(null)
    setIsConnected(false)
    localStorage.removeItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.NOTION_DATABASE_ID)
    localStorage.removeItem(STORAGE_KEYS.NOTION_WORKSPACE_ID)
  }

  const syncData = async (entries: SavingsEntry[]) => {
    if (!isConnected || !accessToken) {
      return
    }

    try {
      // Call API route to sync data to Notion
      const response = await fetch('/api/notion/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          entries,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to sync data to Notion')
      }

      const data = await response.json()

      // Store database ID for future syncs
      if (data.database_id) {
        localStorage.setItem(STORAGE_KEYS.NOTION_DATABASE_ID, data.database_id)
      }
    } catch (error) {
      console.error('Error syncing to Notion:', error)
      throw error
    }
  }

  const fetchData = async (): Promise<SavingsEntry[]> => {
    if (!isConnected || !accessToken) {
      return []
    }

    try {
      const databaseId = localStorage.getItem(STORAGE_KEYS.NOTION_DATABASE_ID)

      // Call API route to fetch data from Notion
      const response = await fetch('/api/notion/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          database_id: databaseId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data from Notion')
      }

      const data = await response.json()

      // Store database ID if we found one
      if (data.database_id) {
        localStorage.setItem(STORAGE_KEYS.NOTION_DATABASE_ID, data.database_id)
      }

      return data.entries || []
    } catch (error) {
      console.error('Error fetching from Notion:', error)
      return []
    }
  }

  return (
    <NotionContext.Provider value={{ isConnected, isConnecting, connect, disconnect, syncData, fetchData }}>
      {children}
    </NotionContext.Provider>
  )
}

export function useNotion() {
  const context = useContext(NotionContext)
  if (context === undefined) {
    throw new Error('useNotion must be used within a NotionProvider')
  }
  return context
}

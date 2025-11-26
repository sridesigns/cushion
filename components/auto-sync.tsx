"use client"

import { useEffect, useRef } from 'react'
import { useNotion } from '@/lib/notion-context'
import { useUser } from '@/lib/user-context'
import type { SavingsEntry } from '@/lib/types'

interface AutoSyncProps {
  entries: SavingsEntry[]
}

export function AutoSync({ entries }: AutoSyncProps) {
  const { isConnected, syncData } = useNotion()
  const { userName } = useUser()
  const lastSyncRef = useRef<string>('')

  useEffect(() => {
    // Only sync if connected and entries have changed
    const entriesHash = JSON.stringify(entries)

    if (isConnected && entriesHash !== lastSyncRef.current) {
      // Debounce sync by 1 second
      const timer = setTimeout(() => {
        syncData(entries, userName || undefined).catch(error => {
          console.error('Auto-sync failed:', error)
        })
        lastSyncRef.current = entriesHash
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [entries, isConnected, syncData, userName])

  return null
}

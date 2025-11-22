"use client"

import { Home, Settings, Plus, Moon, Sun, Monitor } from "lucide-react"
import { useState } from "react"
import { useTheme } from "next-themes"

interface CompactBottomNavProps {
  onAddClick: () => void
  activeView: 'home' | 'settings'
  onViewChange: (view: 'home' | 'settings') => void
}

export function CompactBottomNav({ onAddClick, activeView, onViewChange }: CompactBottomNavProps) {
  const { theme, setTheme } = useTheme()

  const getNextTheme = () => {
    if (theme === 'light') return 'dark'
    if (theme === 'dark') return 'system'
    return 'light'
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-5 w-5" />
    if (theme === 'dark') return <Moon className="h-5 w-5" />
    return <Monitor className="h-5 w-5" />
  }

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md">
      <div className="bg-neutral-900/90 dark:bg-neutral-800/90 backdrop-blur-xl border border-neutral-700/50 rounded-2xl px-3 py-2 shadow-2xl">
        <div className="flex items-center justify-between gap-2">
          {/* Home */}
          <button
            onClick={() => onViewChange('home')}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
              activeView === 'home'
                ? 'bg-neutral-700/50 text-neutral-50'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </button>

          {/* Add Button (Primary CTA) */}
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-100 text-neutral-900 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-neutral-200 dark:hover:bg-neutral-200 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add
          </button>

          {/* Settings */}
          <button
            onClick={() => onViewChange('settings')}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
              activeView === 'settings'
                ? 'bg-neutral-700/50 text-neutral-50'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs font-medium">Settings</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(getNextTheme())}
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-neutral-400 hover:text-neutral-200 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {getThemeIcon()}
            <span className="text-xs font-medium">Theme</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

"use client"

import { Home, Settings, Plus } from "lucide-react"

interface SplitBottomNavProps {
  onAddClick: () => void
  activeView: 'home' | 'settings'
  onViewChange: (view: 'home' | 'settings') => void
}

export function SplitBottomNav({ onAddClick, activeView, onViewChange }: SplitBottomNavProps) {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-neutral-900/90 dark:bg-neutral-800/90 backdrop-blur-xl border border-neutral-700/50 rounded-full px-2 py-2 shadow-2xl">
        <div className="flex items-center gap-1">
          {/* Home */}
          <button
            onClick={() => onViewChange('home')}
            className={`p-3 rounded-full transition-all duration-200 ${
              activeView === 'home'
                ? 'bg-neutral-700/50 text-neutral-50'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/30'
            }`}
          >
            <Home className="h-5 w-5" />
          </button>

          {/* Settings */}
          <button
            onClick={() => onViewChange('settings')}
            className={`p-3 rounded-full transition-all duration-200 ${
              activeView === 'settings'
                ? 'bg-neutral-700/50 text-neutral-50'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/30'
            }`}
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Add Button */}
          <button
            onClick={onAddClick}
            className="p-3 bg-neutral-50 dark:bg-neutral-100 text-neutral-900 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-200 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}

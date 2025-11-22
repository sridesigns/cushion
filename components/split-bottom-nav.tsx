"use client"

import { Home, Settings, Plus } from "lucide-react"

interface SplitBottomNavProps {
  onAddClick: () => void
  activeView: 'home' | 'settings'
  onViewChange: (view: 'home' | 'settings') => void
}

export function SplitBottomNav({ onAddClick, activeView, onViewChange }: SplitBottomNavProps) {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md">
      <div className="bg-neutral-900/90 dark:bg-neutral-800/90 backdrop-blur-xl border border-neutral-700/50 rounded-2xl px-3 py-2 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between gap-2">
          {/* Home */}
          <button
            onClick={() => onViewChange('home')}
            className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all duration-200 ${
              activeView === 'home'
                ? 'bg-neutral-700/50 text-neutral-50'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => onViewChange('settings')}
            className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all duration-200 ${
              activeView === 'settings'
                ? 'bg-neutral-700/50 text-neutral-50'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs font-medium">Settings</span>
          </button>

          {/* Add Button (Last item) */}
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-100 text-neutral-900 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-neutral-200 dark:hover:bg-neutral-200 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add
          </button>
        </div>
      </div>
    </nav>
  )
}

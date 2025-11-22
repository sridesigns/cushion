"use client"

import { useState } from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ExpandableThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)

  const getCurrentIcon = () => {
    if (theme === 'light') return <Sun className="h-5 w-5" />
    if (theme === 'dark') return <Moon className="h-5 w-5" />
    return <Monitor className="h-5 w-5" />
  }

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className={`bg-neutral-900/90 dark:bg-neutral-800/90 backdrop-blur-xl border border-neutral-700/50 rounded-2xl shadow-2xl transition-all duration-300 ease-out ${
        isExpanded ? 'px-3 py-2' : 'p-3'
      }`}>
        {!isExpanded ? (
          <div className="flex items-center justify-center">
            <div className="text-neutral-200">
              {getCurrentIcon()}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                theme === 'light'
                  ? 'bg-neutral-700/50 text-neutral-50'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sun className="h-5 w-5" />
              <span className="text-xs font-medium whitespace-nowrap">Light</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-neutral-700/50 text-neutral-50'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Moon className="h-5 w-5" />
              <span className="text-xs font-medium whitespace-nowrap">Dark</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                theme === 'system'
                  ? 'bg-neutral-700/50 text-neutral-50'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Monitor className="h-5 w-5" />
              <span className="text-xs font-medium whitespace-nowrap">Device</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

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
      <div className="bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-full shadow-2xl shadow-neutral-900/10 dark:shadow-black/40 px-2 py-2 transition-all duration-500 ease-in-out">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-full transition-all duration-500 ease-in-out ${
              theme === 'light'
                ? 'bg-neutral-700/50 text-neutral-50 scale-100 opacity-100'
                : isExpanded
                ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/30 scale-100 opacity-100'
                : 'scale-0 opacity-0 w-0 p-0'
            }`}
          >
            <Sun className="h-5 w-5" />
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-full transition-all duration-500 ease-in-out ${
              theme === 'dark'
                ? 'bg-neutral-700/50 text-neutral-50 scale-100 opacity-100'
                : isExpanded
                ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/30 scale-100 opacity-100'
                : 'scale-0 opacity-0 w-0 p-0'
            }`}
          >
            <Moon className="h-5 w-5" />
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-3 rounded-full transition-all duration-500 ease-in-out ${
              theme === 'system'
                ? 'bg-neutral-700/50 text-neutral-50 scale-100 opacity-100'
                : isExpanded
                ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/30 scale-100 opacity-100'
                : 'scale-0 opacity-0 w-0 p-0'
            }`}
          >
            <Monitor className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

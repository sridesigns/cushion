"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="inline-flex items-center rounded-2xl bg-muted/80 backdrop-blur-xl border border-border/50 p-1.5 shadow-lg">
        <button className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all h-12 w-12">
          <Sun className="h-6 w-6" />
        </button>
        <button className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all h-12 w-12">
          <Moon className="h-6 w-6" />
        </button>
        <button className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all h-12 w-12">
          <Monitor className="h-6 w-6" />
        </button>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center rounded-2xl bg-muted/80 backdrop-blur-xl border border-border/50 p-1.5 shadow-lg">
      <button
        onClick={() => setTheme("light")}
        className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all h-12 w-12 ${
          theme === "light"
            ? "bg-background text-foreground shadow-md scale-105"
            : "text-muted-foreground hover:text-foreground hover:scale-105"
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-6 w-6" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all h-12 w-12 ${
          theme === "dark"
            ? "bg-background text-foreground shadow-md scale-105"
            : "text-muted-foreground hover:text-foreground hover:scale-105"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-6 w-6" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all h-12 w-12 ${
          theme === "system"
            ? "bg-background text-foreground shadow-md scale-105"
            : "text-muted-foreground hover:text-foreground hover:scale-105"
        }`}
        aria-label="System theme"
      >
        <Monitor className="h-6 w-6" />
      </button>
    </div>
  )
}

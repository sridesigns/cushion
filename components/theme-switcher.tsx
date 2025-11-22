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
      <div className="inline-flex items-center rounded-lg border border-border bg-background p-1 shadow-sm">
        <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all h-8 w-8">
          <Sun className="h-4 w-4" />
        </button>
        <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all h-8 w-8">
          <Moon className="h-4 w-4" />
        </button>
        <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all h-8 w-8">
          <Monitor className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-muted/50 p-1 shadow-sm backdrop-blur-sm">
      <button
        onClick={() => setTheme("light")}
        className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all h-8 w-8 ${
          theme === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all h-8 w-8 ${
          theme === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all h-8 w-8 ${
          theme === "system"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  )
}

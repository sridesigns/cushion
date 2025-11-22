"use client"

import { Home, Settings, Plus } from "lucide-react"
import { useState } from "react"

interface BottomNavProps {
  onAddClick: () => void
}

export function BottomNav({ onAddClick }: BottomNavProps) {
  const [active, setActive] = useState("home")

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="relative">
        {/* Glassmorphic container */}
        <div className="flex items-center justify-around bg-background/70 backdrop-blur-2xl border border-border/50 rounded-[2rem] px-6 py-3 shadow-2xl shadow-black/10 dark:shadow-black/40">
          {/* Home */}
          <button
            onClick={() => setActive("home")}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-300 ${
              active === "home"
                ? "bg-primary/10 text-primary scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className={`h-6 w-6 transition-transform ${active === "home" ? "scale-110" : ""}`} />
            <span className="text-xs font-medium">Home</span>
          </button>

          {/* Add Button (Center) */}
          <button
            onClick={onAddClick}
            className="relative -mt-8 group"
          >
            <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 active:scale-95 transition-transform duration-300">
              <Plus className="h-8 w-8 transition-transform duration-300 group-hover:rotate-90" />
            </div>
          </button>

          {/* Settings */}
          <button
            onClick={() => setActive("settings")}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-300 ${
              active === "settings"
                ? "bg-primary/10 text-primary scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className={`h-6 w-6 transition-transform ${active === "settings" ? "scale-110" : ""}`} />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

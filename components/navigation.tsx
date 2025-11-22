"use client"

import { Wallet } from "lucide-react"
import { ThemeSwitcher } from "./theme-switcher"

export function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-background/60 backdrop-blur-2xl border border-border/50 rounded-3xl px-6 py-4 shadow-lg">
          <div className="flex items-center gap-3 font-bold text-xl">
            <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-3 shadow-lg">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Cushion
            </span>
          </div>

          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}

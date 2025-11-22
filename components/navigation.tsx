"use client"

import { PiggyBank, Wallet } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function Navigation() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 font-bold text-xl">
            <div className="rounded-lg bg-primary p-2 shadow-md">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Cushion</span>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="hidden sm:flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-primary px-3 py-1.5 rounded-lg hover:bg-accent"
          >
            <PiggyBank className="h-4 w-4" />
            Savings
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

"use client"

import { PiggyBank, Wallet } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function Navigation() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Wallet className="h-6 w-6 text-primary" />
            <span>Cushion</span>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
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

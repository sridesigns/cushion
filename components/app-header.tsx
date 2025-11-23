"use client"

import { Settings, Squirrel } from 'lucide-react'
import { useUser } from '@/lib/user-context'

interface AppHeaderProps {
  onSettingsClick: () => void
}

export function AppHeader({ onSettingsClick }: AppHeaderProps) {
  const { userName, getGreeting } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Left: Logo + Greeting */}
        <div className="flex items-center gap-3">
          {/* Squirrel Logo */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <Squirrel className="h-6 w-6 text-primary" />
          </div>

          {/* Greeting Text */}
          <div className="flex flex-col">
            <h1 className="text-base font-semibold leading-tight">
              {getGreeting()}{userName ? `, ${userName}` : ''}!
            </h1>
            <p className="text-xs text-muted-foreground leading-tight">
              One line description of the tagline goes here
            </p>
          </div>
        </div>

        {/* Right: Settings Icon */}
        <button
          onClick={onSettingsClick}
          className="rounded-full p-2.5 hover:bg-accent transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      </div>
    </header>
  )
}

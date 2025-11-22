"use client"

import { Wallet } from "lucide-react"

export function AppLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Wallet Icon */}
        <div className="relative">
          {/* Outer pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: '1.5s' }} />
          </div>

          {/* Center icon */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-6 shadow-2xl animate-bounce" style={{ animationDuration: '1s' }}>
              <Wallet className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-pulse">
            Cushion
          </h2>
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

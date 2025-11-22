"use client"

import { useEffect, useState } from "react"

export function AppLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 15)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 w-full max-w-xs px-8">
        {/* App Name */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Cushion</h1>
          <p className="text-sm text-muted-foreground">Financial tracking made simple</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Loading</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

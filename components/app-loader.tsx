"use client"

import { useEffect, useState } from "react"

interface AppLoaderProps {
  onLoadComplete?: () => void
}

export function AppLoader({ onLoadComplete }: AppLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsComplete(true)
          // Trigger swipe up animation after a brief delay
          setTimeout(() => {
            onLoadComplete?.()
          }, 300)
          return 100
        }
        return prev + 2
      })
    }, 15)

    return () => clearInterval(timer)
  }, [onLoadComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-primary transition-transform duration-700 ease-in-out ${
        isComplete ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-xs px-8">
        {/* App Name */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground">Cushion</h1>
          <p className="text-sm text-primary-foreground/80">Financial tracking made simple</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="h-1 w-full bg-primary-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-foreground transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-primary-foreground/70">
            <span>Loading</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

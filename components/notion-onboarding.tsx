"use client"

import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useUser } from '@/lib/user-context'

export function NotionOnboarding() {
  const [name, setName] = useState('')
  const { setUserName, completeNotionLogin } = useUser()

  const handleContinue = () => {
    if (name.trim()) {
      setUserName(name.trim())
      completeNotionLogin(name.trim())
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo/Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Welcome to Cushion!</h1>
            <p className="text-muted-foreground">
              Your Notion account is connected. Let&apos;s personalize your experience.
            </p>
          </div>
        </div>

        {/* Name Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              What should we call you?
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
              className="w-full h-14 px-6 rounded-2xl bg-muted/30 border border-border/50 text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              autoFocus
            />
          </div>

          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue to Cushion
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Your name will be saved to your Notion workspace
        </p>
      </div>
    </div>
  )
}

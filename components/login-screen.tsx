"use client"

import { useState, useEffect } from 'react'
import { Database, User, ArrowRight } from 'lucide-react'
import { useUser } from '@/lib/user-context'
import { useNotion } from '@/lib/notion-context'

export function LoginScreen() {
  const [showGuestForm, setShowGuestForm] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [isNotionConfigured, setIsNotionConfigured] = useState(false)
  const { startNotionLogin, completeNotionLogin, loginAsGuest } = useUser()
  const { connect, isConnecting } = useNotion()

  // Check if Notion is configured
  useEffect(() => {
    setIsNotionConfigured(!!process.env.NEXT_PUBLIC_NOTION_CLIENT_ID)
  }, [])

  const handleNotionLogin = () => {
    startNotionLogin()
    connect((userName) => {
      completeNotionLogin(userName)
    })
  }

  const handleGuestLogin = () => {
    if (guestName.trim()) {
      loginAsGuest(guestName.trim())
    }
  }

  if (showGuestForm) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Logo/Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome!</h1>
            <p className="text-muted-foreground">What should we call you?</p>
          </div>

          {/* Guest Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGuestLogin()}
                className="w-full h-14 px-6 rounded-2xl bg-muted/30 border border-border/50 text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                autoFocus
              />
            </div>

            <button
              onClick={handleGuestLogin}
              disabled={!guestName.trim()}
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowGuestForm(false)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to login options
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo/Title */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">Cushion</h1>
          <p className="text-lg text-muted-foreground">Your personal savings tracker</p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          {/* Continue with Notion - Only show if configured */}
          {isNotionConfigured && (
            <>
              <button
                onClick={handleNotionLogin}
                disabled={isConnecting}
                className="group w-full p-6 rounded-2xl border-2 border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-background border border-border group-hover:border-primary/50 transition-colors">
                    <Database className="h-6 w-6 text-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold">Continue with Notion</h3>
                    <p className="text-sm text-muted-foreground">
                      {isConnecting ? 'Connecting...' : 'Sync your data automatically'}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground">or</span>
                </div>
              </div>
            </>
          )}

          {/* Continue as Guest */}
          <button
            onClick={() => setShowGuestForm(true)}
            className="group w-full p-6 rounded-2xl border-2 border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 p-3 rounded-xl bg-background border border-border group-hover:border-primary/50 transition-colors">
                <User className="h-6 w-6 text-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-semibold">Continue as Guest</h3>
                <p className="text-sm text-muted-foreground">
                  Track your savings locally
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Your data is stored locally and never shared without your permission
        </p>
      </div>
    </div>
  )
}

"use client"

import { useUser } from '@/lib/user-context'

export function WelcomeMessage() {
  const { userName, getGreeting } = useUser()

  return (
    <div className="space-y-1">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        {getGreeting()}{userName ? `, ${userName}` : ''}
      </h1>
      <p className="text-muted-foreground text-lg">
        Here&apos;s your financial overview
      </p>
    </div>
  )
}

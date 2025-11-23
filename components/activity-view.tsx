"use client"

import { useState, useEffect } from 'react'
import { Clock, TrendingUp, TrendingDown } from 'lucide-react'
import type { SavingsEntry } from '@/lib/types'

interface ActivityViewProps {
  entries: SavingsEntry[]
}

export function ActivityView({ entries }: ActivityViewProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Get recent entries (last 10)
  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div
        className={`transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-lg font-semibold mb-1">Activity</h2>
        <p className="text-sm text-muted-foreground">Recent transactions</p>
      </div>

      {/* Activity List */}
      <div className="space-y-2">
        {recentEntries.length === 0 ? (
          <div
            className={`p-6 rounded-xl bg-muted/30 border border-border/50 text-center transition-all duration-700 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No activity yet</p>
          </div>
        ) : (
          recentEntries.map((entry, index) => (
            <div
              key={entry.id}
              className={`p-3 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-all duration-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: `${100 + index * 50}ms`,
              }}
            >
              <div className="flex items-start gap-2">
                {/* Icon */}
                <div className="mt-0.5">
                  {entry.type === 'deposit' ? (
                    <div className="p-1.5 rounded-lg bg-green-500/10">
                      <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-lg bg-red-500/10">
                      <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{entry.category}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p
                    className={`text-xs font-semibold ${
                      entry.type === 'deposit'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {entry.type === 'deposit' ? '+' : '-'}₹
                    {entry.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

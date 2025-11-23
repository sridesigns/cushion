"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@/lib/user-context'
import { TrendingUp, TrendingDown, Minus, Plus, Receipt } from 'lucide-react'
import type { SavingsSummary } from '@/lib/types'

interface FeedViewProps {
  summary: SavingsSummary
  onAddInvestment: () => void
  onAddExpense: () => void
}

export function FeedView({ summary, onAddInvestment, onAddExpense }: FeedViewProps) {
  const { userName, getGreeting } = useUser()
  const [showGreeting, setShowGreeting] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [showActions, setShowActions] = useState(false)

  // Progressive reveal animation
  useEffect(() => {
    const timer1 = setTimeout(() => setShowGreeting(true), 100)
    const timer2 = setTimeout(() => setShowSummary(true), 600)
    const timer3 = setTimeout(() => setShowQuestion(true), 1100)
    const timer4 = setTimeout(() => setShowActions(true), 1400)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  // Calculate day-over-day change (mock for now - would compare with yesterday's data)
  const dailyChange = summary.thisMonth * 0.05 // Placeholder calculation
  const changePercentage = summary.totalSavings > 0
    ? ((dailyChange / summary.totalSavings) * 100).toFixed(1)
    : '0.0'
  const isPositive = dailyChange >= 0
  const isNeutral = Math.abs(dailyChange) < 0.01

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Greeting */}
        <div
          className={`transition-all duration-700 ease-out ${
            showGreeting
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-left">
            <h1 className="text-2xl font-semibold text-foreground">
              {getGreeting()}{userName ? `, ${userName}` : ''}
            </h1>
          </div>
        </div>

        {/* Net Worth Summary Card */}
        <div
          className={`transition-all duration-700 ease-out delay-100 ${
            showSummary
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Net Worth</p>
                <h2 className="text-4xl font-bold tracking-tight">
                  ₹{summary.totalSavings.toLocaleString('en-IN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </h2>
              </div>

              {/* Day Change */}
              {!isNeutral && (
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        +₹{Math.abs(dailyChange).toLocaleString('en-IN')} ({changePercentage}%)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                      <TrendingDown className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        -₹{Math.abs(dailyChange).toLocaleString('en-IN')} ({changePercentage}%)
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">vs yesterday</span>
                </div>
              )}

              {isNeutral && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Minus className="h-4 w-4" />
                    <span className="text-sm font-medium">No change</span>
                  </div>
                  <span className="text-xs text-muted-foreground">vs yesterday</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question */}
        <div
          className={`transition-all duration-700 ease-out delay-200 ${
            showQuestion
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-left">
            <p className="text-base text-foreground">
              What would you like to do?
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`transition-all duration-700 ease-out delay-300 ${
            showActions
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Record Investment */}
            <button
              onClick={onAddInvestment}
              className="group relative p-6 rounded-2xl border-2 border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all duration-200 text-left"
            >
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">Record Investment</h3>
                  <p className="text-xs text-muted-foreground">Track your savings</p>
                </div>
              </div>
            </button>

            {/* Record Expense */}
            <button
              onClick={onAddExpense}
              className="group relative p-6 rounded-2xl border-2 border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all duration-200 text-left"
            >
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-xl bg-muted border border-border group-hover:bg-muted/80 transition-colors">
                  <Receipt className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">Record Expense</h3>
                  <p className="text-xs text-muted-foreground">Log your spending</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

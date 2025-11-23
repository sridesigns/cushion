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

/**
 * Generates a natural language summary of net worth changes
 * @param totalSavings - Current total net worth
 * @param changeAmount - Amount changed (positive or negative)
 * @param comparisonPeriod - Period to compare against (default: 'yesterday')
 * @returns Object with summary text and metadata
 */
function generateNetWorthSummary(
  totalSavings: number,
  changeAmount: number,
  comparisonPeriod: string = 'yesterday'
) {
  const changePercentage = totalSavings > 0
    ? Math.abs((changeAmount / totalSavings) * 100)
    : 0
  const isNeutral = Math.abs(changeAmount) < 0.01
  const isPositive = changeAmount > 0

  let summaryText = ''
  let icon: 'up' | 'down' | 'neutral' = 'neutral'

  if (isNeutral) {
    summaryText = `Your net worth is ₹${totalSavings.toLocaleString('en-IN')} with no change compared to ${comparisonPeriod}.`
    icon = 'neutral'
  } else if (isPositive) {
    summaryText = `Your net worth is ₹${totalSavings.toLocaleString('en-IN')} and has increased by ${changePercentage.toFixed(1)}% compared to ${comparisonPeriod}.`
    icon = 'up'
  } else {
    summaryText = `Your net worth is ₹${totalSavings.toLocaleString('en-IN')} and has decreased by ${changePercentage.toFixed(1)}% compared to ${comparisonPeriod}.`
    icon = 'down'
  }

  return {
    text: summaryText,
    icon,
    changeAmount,
    changePercentage,
    isPositive,
    isNeutral,
  }
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
  // TODO: Replace with actual historical data comparison
  const dailyChange = summary.thisMonth * 0.05 // Placeholder calculation

  // Generate natural language summary
  const netWorthSummary = generateNetWorthSummary(summary.totalSavings, dailyChange, 'yesterday')

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

        {/* Net Worth Summary - Natural Language */}
        <div
          className={`transition-all duration-700 ease-out delay-100 ${
            showSummary
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              {netWorthSummary.icon === 'up' && (
                <div className="p-2 rounded-full bg-green-500/10">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              )}
              {netWorthSummary.icon === 'down' && (
                <div className="p-2 rounded-full bg-red-500/10">
                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
              )}
              {netWorthSummary.icon === 'neutral' && (
                <div className="p-2 rounded-full bg-muted/50">
                  <Minus className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Text Summary */}
            <div className="flex-1">
              <p className="text-base leading-relaxed text-foreground/90">
                {netWorthSummary.text}
              </p>
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

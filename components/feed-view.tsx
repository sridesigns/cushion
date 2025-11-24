"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@/lib/user-context'
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, Plus, Receipt } from 'lucide-react'
import { useCurrency } from '@/lib/currency-context'
import type { SavingsSummary, SavingsEntry } from '@/lib/types'

interface FeedViewProps {
  summary: SavingsSummary
  entries: SavingsEntry[]
  onAddInvestment: () => void
  onAddExpense: () => void
}

/**
 * Generates a natural language summary of net worth changes
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

export function FeedView({ summary, entries, onAddInvestment, onAddExpense }: FeedViewProps) {
  const { formatCurrency } = useCurrency()
  const [showSummary, setShowSummary] = useState(false)
  const [showNetWorth, setShowNetWorth] = useState(false)
  const [showCards, setShowCards] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0)

  // Progressive reveal animation
  useEffect(() => {
    const timer1 = setTimeout(() => setShowSummary(true), 100)
    const timer2 = setTimeout(() => setShowNetWorth(true), 300)
    const timer3 = setTimeout(() => setShowCards(true), 600)
    const timer4 = setTimeout(() => setShowActions(true), 900)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  // Load monthly budget
  useEffect(() => {
    const savedBudget = localStorage.getItem('monthlyBudget')
    if (savedBudget) {
      setMonthlyBudget(parseFloat(savedBudget))
    }
  }, [])

  // Calculate this month's savings and expenses
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  let savingsThisMonth = 0
  let expensesThisMonth = 0

  entries.forEach(entry => {
    const entryDate = new Date(entry.date)
    if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
      if (entry.type === 'deposit') {
        savingsThisMonth += entry.amount
      } else {
        expensesThisMonth += entry.amount
      }
    }
  })

  // Calculate budget progress
  const budgetRemaining = monthlyBudget - expensesThisMonth
  const budgetPercentage = monthlyBudget > 0 ? (expensesThisMonth / monthlyBudget) * 100 : 0
  const isOverBudget = budgetPercentage > 100

  // Calculate day-over-day change (mock for now - would compare with yesterday's data)
  const dailyChange = summary.thisMonth * 0.05 // Placeholder calculation

  // Generate natural language summary
  const netWorthSummary = generateNetWorthSummary(summary.totalSavings, dailyChange, 'yesterday')

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div
        className={`transition-all duration-700 ${
          showSummary ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-lg font-semibold mb-1">Feed</h2>
        <p className="text-sm text-muted-foreground">Your financial snapshot</p>
      </div>

      {/* Net Worth Summary - Natural Language */}
      <div
        className={`transition-all duration-700 ease-out ${
          showNetWorth ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
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
            <p className="text-sm leading-relaxed text-foreground/90">
              {netWorthSummary.text}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Summary Cards */}
      <div
        className={`transition-all duration-700 ease-out ${
          showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="space-y-3">
          {/* Saved This Month */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Saved This Month</p>
                  <p className="text-xl font-bold">{formatCurrency(savingsThisMonth)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expense This Month */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border border-red-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Expense This Month</p>
                  <p className="text-xl font-bold">{formatCurrency(expensesThisMonth)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Progress (only show if budget is set) */}
          {monthlyBudget > 0 && (
            <div className={`p-4 rounded-xl border ${
              isOverBudget
                ? 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-red-500/20'
                : 'bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Monthly Budget</p>
                  <p className={`text-xs font-semibold ${
                    isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {Math.min(budgetPercentage, 100).toFixed(0)}% used
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isOverBudget ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {isOverBudget ? 'Over by' : 'Remaining'}:
                  </span>
                  <span className={`font-semibold ${
                    isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-foreground'
                  }`}>
                    {formatCurrency(Math.abs(budgetRemaining))}
                  </span>
                </div>
              </div>
            </div>
          )}
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
        <div className="grid grid-cols-2 gap-2">
          {/* Record Investment */}
          <button
            onClick={onAddInvestment}
            className="group relative p-3 rounded-xl border border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all duration-200"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-xs font-semibold">Investment</h3>
              </div>
            </div>
          </button>

          {/* Record Expense */}
          <button
            onClick={onAddExpense}
            className="group relative p-3 rounded-xl border border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all duration-200"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-2 rounded-lg bg-muted border border-border group-hover:bg-muted/80 transition-colors">
                <Receipt className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-xs font-semibold">Expense</h3>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

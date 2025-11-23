"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@/lib/user-context'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Plus, Receipt } from 'lucide-react'
import { useCurrency } from '@/lib/currency-context'
import type { SavingsSummary, SavingsEntry } from '@/lib/types'

interface FeedViewProps {
  summary: SavingsSummary
  entries: SavingsEntry[]
  onAddInvestment: () => void
  onAddExpense: () => void
}

export function FeedView({ summary, entries, onAddInvestment, onAddExpense }: FeedViewProps) {
  const { formatCurrency } = useCurrency()
  const [showSummary, setShowSummary] = useState(false)
  const [showCards, setShowCards] = useState(false)
  const [showActions, setShowActions] = useState(false)

  // Progressive reveal animation
  useEffect(() => {
    const timer1 = setTimeout(() => setShowSummary(true), 100)
    const timer2 = setTimeout(() => setShowCards(true), 400)
    const timer3 = setTimeout(() => setShowActions(true), 700)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
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

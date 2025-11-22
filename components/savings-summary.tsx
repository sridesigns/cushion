"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { useCurrency } from "@/lib/currency-context"
import type { SavingsSummary } from "@/lib/types"

interface SavingsSummaryProps {
  summary: SavingsSummary
}

export function SavingsSummaryCards({ summary }: SavingsSummaryProps) {
  const { formatCurrency } = useCurrency()
  const monthlyChange = summary.thisMonth - summary.lastMonth
  const isPositive = monthlyChange >= 0

  return (
    <div className="space-y-6">
      {/* Primary Balance */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Balance</p>
        <h1 className="text-6xl font-bold tracking-tight">{formatCurrency(summary.totalSavings)}</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        {/* This Month */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">This Month</p>
          <p className="text-2xl font-semibold tracking-tight">{formatCurrency(summary.thisMonth)}</p>
          <div className="flex items-center gap-1 text-xs">
            {isPositive ? (
              <>
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500 font-medium">
                  {formatCurrency(Math.abs(monthlyChange))}
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-red-500 font-medium">
                  {formatCurrency(Math.abs(monthlyChange))}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Last Month */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Month</p>
          <p className="text-2xl font-semibold tracking-tight">{formatCurrency(summary.lastMonth)}</p>
          <p className="text-xs text-muted-foreground">Previous period</p>
        </div>

        {/* Monthly Average */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Average</p>
          <p className="text-2xl font-semibold tracking-tight">{formatCurrency(summary.averageMonthly)}</p>
          <p className="text-xs text-muted-foreground">Per month</p>
        </div>
      </div>
    </div>
  )
}

"use client"

import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { SavingsSummary } from "@/lib/types"

interface SavingsSummaryProps {
  summary: SavingsSummary
}

export function SavingsSummaryCards({ summary }: SavingsSummaryProps) {
  const monthlyChange = summary.thisMonth - summary.lastMonth
  const isPositive = monthlyChange >= 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalSavings)}</div>
          <p className="text-xs text-muted-foreground">
            Your total accumulated savings
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.thisMonth)}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {isPositive ? (
              <>
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">
                  +{formatCurrency(Math.abs(monthlyChange))} from last month
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-red-500">
                  {formatCurrency(Math.abs(monthlyChange))} from last month
                </span>
              </>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.lastMonth)}</div>
          <p className="text-xs text-muted-foreground">
            Previous month&apos;s savings
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.averageMonthly)}</div>
          <p className="text-xs text-muted-foreground">
            Average monthly savings
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

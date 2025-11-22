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
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
      {/* Main Total Card - Takes up more space */}
      <Card className="md:col-span-2 lg:col-span-2 md:row-span-2 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-medium text-muted-foreground">Total Savings</CardTitle>
          <div className="rounded-full bg-primary/10 p-3 transition-transform duration-300 group-hover:scale-110">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-5xl font-bold tracking-tight">{formatCurrency(summary.totalSavings)}</div>
          <p className="text-sm text-muted-foreground">
            Your financial cushion is growing
          </p>
          {summary.totalSavings > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-1000"
                  style={{ width: `${Math.min((summary.totalSavings / (summary.totalSavings + 1000)) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* This Month Card */}
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:scale-110" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.thisMonth)}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {isPositive ? (
              <>
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">
                  +{formatCurrency(Math.abs(monthlyChange))}
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-red-500">
                  {formatCurrency(Math.abs(monthlyChange))}
                </span>
              </>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Last Month Card */}
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:scale-110" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.lastMonth)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Previous month&apos;s savings
          </p>
        </CardContent>
      </Card>

      {/* Monthly Average Card */}
      <Card className="md:col-span-1 lg:col-span-2 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:scale-110" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.averageMonthly)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Your consistent savings habit
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

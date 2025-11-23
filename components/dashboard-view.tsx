"use client"

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, PieChart as PieChartIcon } from 'lucide-react'
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type { SavingsEntry, SavingsSummary } from '@/lib/types'

interface DashboardViewProps {
  summary: SavingsSummary
  entries: SavingsEntry[]
}

// Generate trend data from entries
function generateTrendData(entries: SavingsEntry[]) {
  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Calculate running total for each date
  let runningTotal = 0
  const trendData: { date: string; total: number; displayDate: string }[] = []

  sortedEntries.forEach((entry) => {
    runningTotal += entry.type === 'deposit' ? entry.amount : -entry.amount
    const date = new Date(entry.date)
    const displayDate = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })

    trendData.push({
      date: entry.date,
      total: runningTotal,
      displayDate,
    })
  })

  // If no data, show placeholder
  if (trendData.length === 0) {
    return [
      { date: new Date().toISOString(), total: 0, displayDate: 'Today' }
    ]
  }

  return trendData
}

// Generate category breakdown
function generateCategoryData(entries: SavingsEntry[]) {
  const categoryTotals: Record<string, number> = {}

  entries.forEach((entry) => {
    if (entry.type === 'deposit') {
      categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.amount
    }
  })

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // Top 5 categories

  if (data.length === 0) {
    return [{ name: 'No data', value: 1 }]
  }

  return data
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']

export function DashboardView({ summary, entries }: DashboardViewProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const trendData = generateTrendData(entries)
  const categoryData = generateCategoryData(entries)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Calculate month-over-month change
  const monthChange = summary.thisMonth - summary.lastMonth
  const monthChangePercentage = summary.lastMonth > 0
    ? ((monthChange / summary.lastMonth) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Net Worth Card */}
        <div
          className={`p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-sm transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            {monthChange >= 0 ? (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                <span>{monthChangePercentage}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm font-medium">
                <TrendingDown className="h-4 w-4" />
                <span>{Math.abs(parseFloat(monthChangePercentage))}%</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Net Worth</p>
            <h3 className="text-3xl font-bold tracking-tight">
              ₹{summary.totalSavings.toLocaleString('en-IN')}
            </h3>
          </div>
        </div>

        {/* This Month Deposits */}
        <div
          className={`p-6 rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/20 backdrop-blur-sm transition-all duration-700 delay-100 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <h3 className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-400">
              +₹{summary.thisMonth.toLocaleString('en-IN')}
            </h3>
          </div>
        </div>

        {/* Last Month Deposits */}
        <div
          className={`p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 backdrop-blur-sm transition-all duration-700 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <ArrowDownRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Month</p>
            <h3 className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              ₹{summary.lastMonth.toLocaleString('en-IN')}
            </h3>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Savings Trend Chart - Takes 2 columns */}
        <div
          className={`lg:col-span-2 p-6 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm transition-all duration-700 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">Savings Trend</h3>
            <p className="text-sm text-muted-foreground">Your net worth growth over time</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="displayDate"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '8px 12px',
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Total']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorTotal)"
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown - Takes 1 column */}
        <div
          className={`p-6 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm transition-all duration-700 delay-400 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">Top Categories</h3>
            <p className="text-sm text-muted-foreground">Investment breakdown</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      opacity={0.9}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '8px 12px',
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {categoryData.slice(0, 5).map((category, index) => (
              <div key={category.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{category.name}</span>
                </div>
                <span className="font-medium">₹{category.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

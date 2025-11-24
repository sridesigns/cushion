"use client"

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, PieChart as PieChartIcon } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
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

// Generate monthly savings vs expenses data
function generateMonthlySavingsExpenses(entries: SavingsEntry[]) {
  const monthlyData: Record<string, { month: string; savings: number; expenses: number }> = {}

  entries.forEach((entry) => {
    const date = new Date(entry.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthDisplay = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { month: monthDisplay, savings: 0, expenses: 0 }
    }

    if (entry.type === 'deposit') {
      monthlyData[monthKey].savings += entry.amount
    } else {
      monthlyData[monthKey].expenses += entry.amount
    }
  })

  const data = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value)

  if (data.length === 0) {
    const now = new Date()
    const monthDisplay = now.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    return [{ month: monthDisplay, savings: 0, expenses: 0 }]
  }

  return data
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']

export function DashboardView({ summary, entries }: DashboardViewProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const trendData = generateTrendData(entries)
  const categoryData = generateCategoryData(entries)
  const monthlyData = generateMonthlySavingsExpenses(entries)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div
        className={`transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-lg font-semibold mb-1">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Analytics & insights</p>
      </div>

      {/* Charts - Stacked Vertically */}
      <div className="space-y-6">
        {/* Net Worth Growth Chart */}
        <div
          className={`p-5 rounded-xl bg-muted/30 border border-border/50 backdrop-blur-sm transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-0.5">Net Worth Growth</h3>
            <p className="text-xs text-muted-foreground">Your net worth over time</p>
          </div>
          <div className="h-56">
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

        {/* Monthly Savings vs Expenses Chart */}
        <div
          className={`p-5 rounded-xl bg-muted/30 border border-border/50 backdrop-blur-sm transition-all duration-700 delay-100 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-0.5">Monthly Overview</h3>
            <p className="text-xs text-muted-foreground">Savings and expenses by month</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="month"
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
                  formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <Bar
                  dataKey="savings"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
                <Bar
                  dataKey="expenses"
                  fill="#ef4444"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div
          className={`p-5 rounded-xl bg-muted/30 border border-border/50 backdrop-blur-sm transition-all duration-700 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-0.5">Top Categories</h3>
            <p className="text-xs text-muted-foreground">Investment breakdown</p>
          </div>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
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
          <div className="mt-3 space-y-1.5">
            {categoryData.slice(0, 5).map((category, index) => (
              <div key={category.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground truncate">{category.name}</span>
                </div>
                <span className="font-medium ml-2 flex-shrink-0">₹{category.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

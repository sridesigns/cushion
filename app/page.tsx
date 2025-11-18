"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AddSavingsDialog } from "@/components/add-savings-dialog"
import { SavingsSummaryCards } from "@/components/savings-summary"
import { SavingsList } from "@/components/savings-list"
import type { SavingsEntry, SavingsSummary } from "@/lib/types"

export default function Home() {
  const [entries, setEntries] = useState<SavingsEntry[]>([])
  const [summary, setSummary] = useState<SavingsSummary>({
    totalSavings: 0,
    thisMonth: 0,
    lastMonth: 0,
    averageMonthly: 0,
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('savingsEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Calculate summary whenever entries change
  useEffect(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    let total = 0
    let thisMonthTotal = 0
    let lastMonthTotal = 0
    const monthlyTotals: { [key: string]: number } = {}

    entries.forEach(entry => {
      const entryDate = new Date(entry.date)
      const entryMonth = entryDate.getMonth()
      const entryYear = entryDate.getFullYear()
      const monthKey = `${entryYear}-${entryMonth}`
      const amount = entry.type === 'deposit' ? entry.amount : -entry.amount

      total += amount

      if (entryMonth === currentMonth && entryYear === currentYear) {
        thisMonthTotal += amount
      }

      if (entryMonth === lastMonth && entryYear === lastMonthYear) {
        lastMonthTotal += amount
      }

      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + amount
    })

    const monthCount = Object.keys(monthlyTotals).length || 1
    const averageMonthly = total / monthCount

    setSummary({
      totalSavings: total,
      thisMonth: thisMonthTotal,
      lastMonth: lastMonthTotal,
      averageMonthly,
    })

    // Save to localStorage
    localStorage.setItem('savingsEntries', JSON.stringify(entries))
  }, [entries])

  const handleAddEntry = (entry: Omit<SavingsEntry, 'id'>) => {
    const newEntry: SavingsEntry = {
      ...entry,
      id: Date.now().toString(),
    }
    setEntries([newEntry, ...entries])
  }

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Savings Dashboard</h1>
              <p className="text-muted-foreground">
                Track and manage your savings goals
              </p>
            </div>
            <AddSavingsDialog onAdd={handleAddEntry} />
          </div>

          <SavingsSummaryCards summary={summary} />

          <SavingsList entries={entries} onDelete={handleDeleteEntry} />
        </div>
      </main>
    </div>
  )
}

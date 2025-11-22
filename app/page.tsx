"use client"

import { useState, useEffect } from "react"
import { SplitBottomNav } from "@/components/split-bottom-nav"
import { ExpandableThemeToggle } from "@/components/expandable-theme-toggle"
import { AddSavingsForm } from "@/components/add-savings-form"
import { SavingsSummaryCards } from "@/components/savings-summary"
import { SavingsList } from "@/components/savings-list"
import { SettingsView } from "@/components/settings-view"
import { CurrencyProvider } from "@/lib/currency-context"
import type { SavingsEntry, SavingsSummary } from "@/lib/types"

export default function Home() {
  const [entries, setEntries] = useState<SavingsEntry[]>([])
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [activeView, setActiveView] = useState<'home' | 'settings'>('home')
  const [isLoaded, setIsLoaded] = useState(false)
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
    // Trigger loading animation
    setTimeout(() => setIsLoaded(true), 100)
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
    setShowAddPanel(false)
  }

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Main Content */}
        <main className="pt-8 pb-28 px-8 sm:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {activeView === 'home' ? (
              <>
                {/* Welcome Section */}
                <div className={isLoaded ? 'animate-stagger-1' : 'opacity-0'}>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">Your Financial Cushion</h1>
                  <p className="text-lg text-muted-foreground">
                    Track your savings journey
                  </p>
                </div>

                {/* Summary Cards */}
                <div className={isLoaded ? 'animate-stagger-2' : 'opacity-0'}>
                  <SavingsSummaryCards summary={summary} />
                </div>

                {/* Transactions List */}
                <div className={isLoaded ? 'animate-stagger-3' : 'opacity-0'}>
                  <SavingsList entries={entries} onDelete={handleDeleteEntry} />
                </div>
              </>
            ) : (
              /* Settings View */
              <div className="animate-scale-in">
                <SettingsView />
              </div>
            )}
          </div>
        </main>

        {/* Bottom Navigation - Split into two menus */}
        <SplitBottomNav
          onAddClick={() => setShowAddPanel(true)}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Expandable Theme Toggle - Separate floating menu */}
        <ExpandableThemeToggle />

        {/* Add Panel */}
        {showAddPanel && (
          <div className="fixed inset-0 z-[60] animate-fade-in">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddPanel(false)}
            />
            <div className="absolute inset-0 flex items-end sm:items-center justify-center p-4">
              <div className="w-full max-w-md animate-modal-slide-in" onClick={(e) => e.stopPropagation()}>
                <AddSavingsForm onAdd={handleAddEntry} onClose={() => setShowAddPanel(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </CurrencyProvider>
  )
}

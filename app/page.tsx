"use client"

import { useState, useEffect } from "react"
import { SplitBottomNav } from "@/components/split-bottom-nav"
import { AddSavingsForm } from "@/components/add-savings-form"
import { SavingsSummaryCards } from "@/components/savings-summary"
import { SavingsList } from "@/components/savings-list"
import { SettingsView } from "@/components/settings-view"
import { AppLoader } from "@/components/app-loader"
import { AutoSync } from "@/components/auto-sync"
import { LoginScreen } from "@/components/login-screen"
import { WelcomeMessage } from "@/components/welcome-message"
import { NotionOnboarding } from "@/components/notion-onboarding"
import { FeedView } from "@/components/feed-view"
import { CurrencyProvider } from "@/lib/currency-context"
import { NotionProvider } from "@/lib/notion-context"
import { UserProvider, useUser } from "@/lib/user-context"
import { STORAGE_KEYS } from "@/lib/constants"
import type { SavingsEntry, SavingsSummary } from "@/lib/types"

function HomeContent() {
  const { isAuthenticated, isPending, needsOnboarding } = useUser()
  const [entries, setEntries] = useState<SavingsEntry[]>([])
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [addPanelType, setAddPanelType] = useState<'deposit' | 'withdrawal'>('deposit')
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'settings'>('home')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [summary, setSummary] = useState<SavingsSummary>({
    totalSavings: 0,
    thisMonth: 0,
    lastMonth: 0,
    averageMonthly: 0,
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEYS.SAVINGS_ENTRIES)
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  const handleLoadComplete = () => {
    setIsInitialLoading(false)
    setTimeout(() => setIsLoaded(true), 100)
  }

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
    localStorage.setItem(STORAGE_KEYS.SAVINGS_ENTRIES, JSON.stringify(entries))
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

  // Show login screen if not authenticated and not pending
  if (!isAuthenticated && !isPending && !needsOnboarding) {
    return <LoginScreen />
  }

  // Show loading while pending Notion OAuth
  if (isPending) {
    return <AppLoader onLoadComplete={() => {}} />
  }

  // Show onboarding if user needs to enter their name
  if (needsOnboarding) {
    return <NotionOnboarding />
  }

  return (
    <>
      <AutoSync entries={entries} />
      {isInitialLoading && <AppLoader onLoadComplete={handleLoadComplete} />}
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Main Content */}
        <main className="pt-16 pb-24 px-6 sm:px-8 lg:px-12">
          <div className="max-w-5xl mx-auto">
            {activeView === 'home' && (
              /* Feed View */
              <FeedView
                summary={summary}
                onAddInvestment={() => {
                  setAddPanelType('deposit')
                  setShowAddPanel(true)
                }}
                onAddExpense={() => {
                  setAddPanelType('withdrawal')
                  setShowAddPanel(true)
                }}
              />
            )}

            {activeView === 'dashboard' && (
              /* Dashboard View */
              <div className="space-y-12">
                {/* Welcome Message */}
                <div className={isLoaded ? 'animate-stagger-1' : 'opacity-0'}>
                  <WelcomeMessage />
                </div>

                {/* Summary Cards */}
                <div className={isLoaded ? 'animate-stagger-2' : 'opacity-0'}>
                  <SavingsSummaryCards summary={summary} />
                </div>

                {/* Transactions List */}
                <div className={isLoaded ? 'animate-stagger-3' : 'opacity-0'}>
                  <SavingsList entries={entries} onDelete={handleDeleteEntry} />
                </div>
              </div>
            )}

            {activeView === 'settings' && (
              /* Settings View */
              <div className="animate-scale-in">
                <SettingsView />
              </div>
            )}
          </div>
        </main>

        {/* Bottom Navigation */}
        <SplitBottomNav
          onAddClick={() => setShowAddPanel(true)}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Add Panel */}
        {showAddPanel && (
          <div className="fixed inset-0 z-[60] animate-fade-in">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddPanel(false)}
            />
            <div className="absolute inset-0 flex items-end sm:items-center justify-center p-4">
              <div className="w-full max-w-md animate-modal-slide-in" onClick={(e) => e.stopPropagation()}>
                <AddSavingsForm
                  onAdd={handleAddEntry}
                  onClose={() => setShowAddPanel(false)}
                  initialType={addPanelType}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default function Home() {
  return (
    <UserProvider>
      <NotionProvider>
        <CurrencyProvider>
          <HomeContent />
        </CurrencyProvider>
      </NotionProvider>
    </UserProvider>
  )
}

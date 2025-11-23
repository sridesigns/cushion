"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { AddSavingsForm } from "@/components/add-savings-form"
import { SettingsView } from "@/components/settings-view"
import { AppLoader } from "@/components/app-loader"
import { AutoSync } from "@/components/auto-sync"
import { LoginScreen } from "@/components/login-screen"
import { NotionOnboarding } from "@/components/notion-onboarding"
import { AppHeader } from "@/components/app-header"
import { FeedView } from "@/components/feed-view"
import { DashboardView } from "@/components/dashboard-view"
import { ActivityView } from "@/components/activity-view"
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
  const [showSettings, setShowSettings] = useState(false)
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
        {/* Header */}
        <AppHeader onSettingsClick={() => setShowSettings(true)} />

        {/* Main Content - 12 Column Grid with 40px padding */}
        <main className="px-10 py-10">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Feed Section - 3 columns on xl screens */}
              <div className="xl:col-span-3 space-y-6">
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
              </div>

              {/* Dashboard Section - 6 columns on xl screens */}
              <div className="xl:col-span-6 space-y-6">
                <DashboardView summary={summary} entries={entries} />
              </div>

              {/* Activity Section - 3 columns on xl screens */}
              <div className="xl:col-span-3 space-y-6">
                <ActivityView entries={entries} />
              </div>
            </div>
          </div>
        </main>

        {/* Settings Sidebar */}
        {showSettings && (
          <div className="fixed inset-0 z-[60]">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
              onClick={() => setShowSettings(false)}
            />

            {/* Sidebar */}
            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[500px] bg-background/95 backdrop-blur-2xl border-l border-border/50 shadow-2xl animate-slide-in-right overflow-auto">
              <div className="p-10">
                {/* Close Button */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="rounded-full p-2 bg-muted hover:bg-muted/80 transition-colors border border-border/50"
                    aria-label="Close settings"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Settings Content */}
                <SettingsView />
              </div>
            </div>
          </div>
        )}

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

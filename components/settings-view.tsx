"use client"

import { useState, useEffect } from 'react'
import { Moon, Sun, Monitor, Database, CheckCircle2, Loader2, LogOut, Target } from "lucide-react"
import { useTheme } from "next-themes"
import { useCurrency, currencyConfig, type Currency } from "@/lib/currency-context"
import { useNotion } from "@/lib/notion-context"
import { useUser } from "@/lib/user-context"
import { Input } from "@/components/ui/input"

export function SettingsView() {
  const { currency, setCurrency, formatCurrency } = useCurrency()
  const { theme, setTheme } = useTheme()
  const { isConnected, isConnecting, connect, disconnect } = useNotion()
  const { userName, loginMethod, logout } = useUser()
  const [isNotionConfigured, setIsNotionConfigured] = useState(false)
  const [monthlyBudget, setMonthlyBudget] = useState<string>('')

  // Check if Notion is configured
  useEffect(() => {
    setIsNotionConfigured(!!process.env.NEXT_PUBLIC_NOTION_CLIENT_ID)
  }, [])

  // Load budget from localStorage
  useEffect(() => {
    const savedBudget = localStorage.getItem('monthlyBudget')
    if (savedBudget) {
      setMonthlyBudget(savedBudget)
    }
  }, [])

  // Save budget to localStorage
  const handleBudgetChange = (value: string) => {
    setMonthlyBudget(value)
    if (value) {
      localStorage.setItem('monthlyBudget', value)
    } else {
      localStorage.removeItem('monthlyBudget')
    }
  }

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency)
  }

  const currencies: Currency[] = ['INR', 'USD', 'EUR', 'SGD', 'HKD', 'CNY', 'JPY']

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Settings</p>
        <h1 className="text-4xl font-bold tracking-tight">Preferences</h1>
      </div>

      {/* Appearance Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="text-sm text-muted-foreground">Choose your preferred theme mode</p>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-3 gap-3">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon
            const isSelected = theme === themeOption.value

            return (
              <button
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className={`relative p-4 rounded-2xl border transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                )}
                <div className="space-y-2">
                  <Icon className={`h-8 w-8 ${isSelected ? 'text-primary' : 'text-foreground'}`} />
                  <p className="text-xs font-medium text-muted-foreground">{themeOption.label}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Currency Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Display Currency</h2>
          <p className="text-sm text-muted-foreground">Choose how amounts are displayed throughout the app</p>
        </div>

        {/* Currency Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {currencies.map((curr) => {
            const config = currencyConfig[curr]
            const isSelected = currency === curr

            return (
              <button
                key={curr}
                onClick={() => handleCurrencyChange(curr)}
                className={`relative p-3 rounded-xl border transition-all duration-200 text-center ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
                <div className="space-y-0.5">
                  <div className={`text-xl font-bold ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}>
                    {config.symbol}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{config.code}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Monthly Budget Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Monthly Budget</h2>
          <p className="text-sm text-muted-foreground">Set your target spending limit for each month</p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <label htmlFor="budget" className="text-sm font-medium mb-2 block">
                Monthly Budget ({currencyConfig[currency].code})
              </label>
              <Input
                id="budget"
                type="number"
                value={monthlyBudget}
                onChange={(e) => handleBudgetChange(e.target.value)}
                placeholder="Enter your monthly budget"
                className="h-12 text-base"
              />
              {monthlyBudget && (
                <p className="text-xs text-muted-foreground mt-2">
                  Your monthly budget is set to {formatCurrency(parseFloat(monthlyBudget))}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Integrations Section - Only show if Notion is configured */}
      {isNotionConfigured && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Integrations</h2>
            <p className="text-sm text-muted-foreground">Connect your favorite apps to sync and backup your data</p>
          </div>

          {/* Notion Integration Card */}
          <div className="relative p-5 rounded-xl border border-border bg-muted/30 transition-all duration-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2.5 rounded-lg bg-background border border-border">
                  <Database className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold">Notion</h3>
                    {isConnected && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-medium text-primary">Connected</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sync your savings data to Notion automatically
                  </p>
                </div>
              </div>
              <button
                onClick={isConnected ? disconnect : () => connect()}
                disabled={isConnecting}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  isConnected
                    ? 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isConnecting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting
                  </span>
                ) : isConnected ? (
                  'Disconnect'
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Account</h2>
          <p className="text-sm text-muted-foreground">Manage your account settings</p>
        </div>

        {/* User Info - Compact Layout */}
        <div className="p-5 rounded-xl border border-border bg-muted/30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Signed in as</p>
              <p className="text-base font-semibold">{userName || 'Guest'}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">
                {loginMethod === 'notion' ? 'Notion Account' : 'Guest Account'}
              </p>
            </div>

            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 bg-muted hover:bg-muted/80 text-foreground border border-border flex items-center gap-2 whitespace-nowrap"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

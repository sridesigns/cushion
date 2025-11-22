"use client"

import { Moon, Sun, Monitor, Database, CheckCircle2, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import { useCurrency, currencyConfig, type Currency } from "@/lib/currency-context"
import { useNotion } from "@/lib/notion-context"

export function SettingsView() {
  const { currency, setCurrency } = useCurrency()
  const { theme, setTheme } = useTheme()
  const { isConnected, isConnecting, connect, disconnect } = useNotion()

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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currencies.map((curr) => {
            const config = currencyConfig[curr]
            const isSelected = currency === curr

            return (
              <button
                key={curr}
                onClick={() => handleCurrencyChange(curr)}
                className={`relative p-4 rounded-2xl border transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                )}
                <div className="space-y-1">
                  <div className={`text-3xl font-bold ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}>
                    {config.symbol}
                  </div>
                  <div className="space-y-0">
                    <p className="text-xs font-medium text-muted-foreground">{config.code}</p>
                    <p className="text-xs text-muted-foreground/70">{config.name}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Integrations Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Integrations</h2>
          <p className="text-sm text-muted-foreground">Connect your favorite apps to sync and backup your data</p>
        </div>

        {/* Notion Integration Card */}
        <div className="relative p-6 rounded-2xl border border-border bg-muted/30 transition-all duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-background border border-border">
                <Database className="h-6 w-6 text-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold">Notion</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Automatically sync your savings data to Notion. Your entries will be saved as a database for easy access and analysis.
                </p>
                {isConnected && (
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-primary">Connected</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={isConnected ? disconnect : connect}
              disabled={isConnecting}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap ${
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
    </div>
  )
}

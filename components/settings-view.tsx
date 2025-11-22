"use client"

import { useCurrency, currencyConfig, type Currency } from "@/lib/currency-context"

export function SettingsView() {
  const { currency, setCurrency } = useCurrency()

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency)
  }

  const currencies: Currency[] = ['INR', 'USD', 'EUR', 'SGD', 'HKD', 'CNY', 'JPY']

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Settings</p>
        <h1 className="text-4xl font-bold tracking-tight">Preferences</h1>
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

      {/* Additional Settings Placeholder */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="text-sm text-muted-foreground">Theme is controlled via the theme toggle in the bottom right</p>
        </div>
      </div>
    </div>
  )
}

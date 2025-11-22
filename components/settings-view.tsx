"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { useCurrency, currencyConfig, type Currency } from "@/lib/currency-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SettingsView() {
  const { currency, setCurrency } = useCurrency()
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currency)

  const handleCurrencyChange = (newCurrency: Currency) => {
    setSelectedCurrency(newCurrency)
    setCurrency(newCurrency)
  }

  const currencies: Currency[] = ['INR', 'USD', 'EUR', 'SGD', 'HKD', 'CNY', 'JPY']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your Cushion experience
        </p>
      </div>

      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle>Currency</CardTitle>
          <CardDescription>Select your preferred currency for displaying amounts</CardDescription>
        </CardHeader>
        <CardContent className="px-0 space-y-2">
          {currencies.map((curr) => {
            const config = currencyConfig[curr]
            const isSelected = selectedCurrency === curr

            return (
              <button
                key={curr}
                onClick={() => handleCurrencyChange(curr)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-2xl font-semibold w-12 text-left ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {config.symbol}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{config.name}</div>
                    <div className="text-sm text-muted-foreground">{config.code}</div>
                  </div>
                </div>
                {isSelected && (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

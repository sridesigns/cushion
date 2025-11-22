"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Currency = 'INR' | 'USD' | 'EUR' | 'SGD' | 'HKD' | 'CNY' | 'JPY'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatCurrency: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const currencyConfig = {
  INR: { symbol: '₹', locale: 'en-IN', code: 'INR', name: 'Indian Rupee' },
  USD: { symbol: '$', locale: 'en-US', code: 'USD', name: 'US Dollar' },
  EUR: { symbol: '€', locale: 'de-DE', code: 'EUR', name: 'Euro' },
  SGD: { symbol: 'S$', locale: 'en-SG', code: 'SGD', name: 'Singapore Dollar' },
  HKD: { symbol: 'HK$', locale: 'en-HK', code: 'HKD', name: 'Hong Kong Dollar' },
  CNY: { symbol: '¥', locale: 'zh-CN', code: 'CNY', name: 'Chinese Yuan' },
  JPY: { symbol: '¥', locale: 'ja-JP', code: 'JPY', name: 'Japanese Yen' },
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currency') as Currency
      if (saved && currencyConfig[saved]) {
        return saved
      }
    }
    return 'INR'
  })

  useEffect(() => {
    // Sync with localStorage on mount
    const saved = localStorage.getItem('currency') as Currency
    if (saved && currencyConfig[saved]) {
      setCurrencyState(saved)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('currency', newCurrency)
  }

  const formatCurrency = (amount: number): string => {
    const config = currencyConfig[currency]
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

export { currencyConfig }

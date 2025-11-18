export interface SavingsEntry {
  id: string
  amount: number
  category: string
  description: string
  date: string
  type: 'deposit' | 'withdrawal'
}

export interface SavingsSummary {
  totalSavings: number
  thisMonth: number
  lastMonth: number
  averageMonthly: number
}

"use client"

import { useState } from "react"
import { X, ShoppingCart, Coffee, Heart, Plane, Car, UtensilsCrossed, Package, ChevronRight, Check } from "lucide-react"
import { ModernDatePicker } from "./modern-date-picker"
import { useCurrency, currencyConfig } from "@/lib/currency-context"

interface ExpenseTrackerFlowProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (expense: {
    amount: number
    category: string
    date: Date
    note?: string
  }) => void
}

type Step = 'amount' | 'category' | 'date' | 'note' | 'confirm'

const categories = [
  { id: 'groceries', label: 'Monthly Groceries', icon: ShoppingCart, color: 'text-emerald-500' },
  { id: 'essentials', label: 'Daily Essentials', icon: Package, color: 'text-blue-500' },
  { id: 'health', label: 'Health', icon: Heart, color: 'text-red-500' },
  { id: 'travel', label: 'Travel', icon: Plane, color: 'text-purple-500' },
  { id: 'transport', label: 'Transportation', icon: Car, color: 'text-orange-500' },
  { id: 'coffee', label: 'Coffee Spends', icon: Coffee, color: 'text-amber-500' },
  { id: 'dining', label: 'Dine-in/Takeaway', icon: UtensilsCrossed, color: 'text-pink-500' },
]

export function ExpenseTrackerFlow({ isOpen, onClose, onSubmit }: ExpenseTrackerFlowProps) {
  const { currency } = useCurrency()
  const symbol = currencyConfig[currency].symbol
  const [step, setStep] = useState<Step>('amount')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [date, setDate] = useState(new Date())
  const [note, setNote] = useState('')

  const handleAmountSubmit = () => {
    if (amount && parseFloat(amount) > 0) {
      setStep('category')
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId)
    setTimeout(() => setStep('date'), 300)
  }

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate)
    setTimeout(() => setStep('note'), 300)
  }

  const handleSkipNote = () => {
    setStep('confirm')
  }

  const handleAddNote = () => {
    setStep('confirm')
  }

  const handleConfirm = () => {
    if (amount && category) {
      onSubmit({
        amount: parseFloat(amount),
        category,
        date,
        note: note || undefined,
      })
      resetFlow()
      onClose()
    }
  }

  const resetFlow = () => {
    setStep('amount')
    setAmount('')
    setCategory(null)
    setDate(new Date())
    setNote('')
  }

  const handleClose = () => {
    resetFlow()
    onClose()
  }

  const selectedCategory = categories.find(c => c.id === category)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Floating Sidebar with 4px margins */}
      <div className="absolute inset-1 right-0 left-auto w-full sm:w-[500px] sm:max-w-[calc(100vw-8px)]">
        <div className="h-full bg-background/95 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl animate-slide-in-right overflow-hidden flex flex-col">
          {/* Progress Bar */}
          <div className="flex-shrink-0 h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{
                width: step === 'amount' ? '25%' : step === 'category' ? '50%' : step === 'date' ? '75%' : '100%'
              }}
            />
          </div>

          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 pt-6 pb-4">
            <div>
              <h2 className="text-lg font-semibold">Track Expense</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {step === 'amount' && 'How much did you spend?'}
                {step === 'category' && 'Which category?'}
                {step === 'date' && 'When did you spend?'}
                {step === 'note' && 'Add a note? (Optional)'}
                {step === 'confirm' && 'Confirm your expense'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {/* Step 1: Amount */}
            {step === 'amount' && (
              <div className="space-y-6 animate-slide-in">
                <div className="flex items-center justify-center gap-3 py-8">
                  <span className="text-4xl font-bold text-muted-foreground">{symbol}</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAmountSubmit()}
                    placeholder="0"
                    autoFocus
                    className="text-5xl font-bold bg-transparent border-none outline-none w-full max-w-xs text-center"
                  />
                </div>

                <button
                  onClick={handleAmountSubmit}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Step 2: Category */}
            {step === 'category' && (
              <div className="space-y-4 animate-slide-in">
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className="p-5 rounded-xl border border-border hover:border-primary/50 hover:bg-accent transition-all duration-200 text-left group"
                      >
                        <Icon className={`h-6 w-6 mb-3 ${cat.color} group-hover:scale-110 transition-transform`} />
                        <p className="text-sm font-medium">{cat.label}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Date */}
            {step === 'date' && (
              <div className="space-y-6 animate-slide-in">
                <ModernDatePicker
                  selectedDate={date}
                  onDateSelect={handleDateSelect}
                  maxDate={new Date()}
                />
              </div>
            )}

            {/* Step 4: Note */}
            {step === 'note' && (
              <div className="space-y-4 animate-slide-in">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Weekly groceries at the supermarket..."
                  rows={4}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleSkipNote}
                    className="flex-1 py-3 rounded-xl border border-border hover:bg-accent transition-all duration-200"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Confirm */}
            {step === 'confirm' && (
              <div className="space-y-6 animate-slide-in">
                {/* Summary Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Amount</p>
                      <p className="text-3xl font-bold">{symbol}{parseFloat(amount).toLocaleString('en-IN')}</p>
                    </div>
                    {selectedCategory && (
                      <div className={`p-3 rounded-xl bg-background border border-border`}>
                        <selectedCategory.icon className={`h-6 w-6 ${selectedCategory.color}`} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{selectedCategory?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    {note && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-muted-foreground mb-1">Note</p>
                        <p className="text-foreground">{note}</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Confirm Expense
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

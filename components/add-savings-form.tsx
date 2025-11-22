"use client"

import { useState } from "react"
import { X, ArrowRight, ArrowLeft, Calendar as CalendarIcon, DollarSign, Tag, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SavingsEntry } from "@/lib/types"

interface AddSavingsFormProps {
  onAdd: (entry: Omit<SavingsEntry, 'id'>) => void
  onClose: () => void
}

export function AddSavingsForm({ onAdd, onClose }: AddSavingsFormProps) {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [type, setType] = useState<'deposit' | 'withdrawal'>('deposit')

  const handleSubmit = () => {
    if (!amount || !category) return

    onAdd({
      amount: parseFloat(amount),
      category,
      description,
      date,
      type,
    })

    // Reset form
    setAmount("")
    setCategory("")
    setDescription("")
    setDate(new Date().toISOString().split('T')[0])
    setType('deposit')
    setStep(1)
  }

  const canProceed = () => {
    if (step === 1) return type !== undefined
    if (step === 2) return amount !== ""
    if (step === 3) return category !== ""
    return true
  }

  return (
    <div className="bg-background/95 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold">Add Entry</h2>
          <p className="text-sm text-muted-foreground">Step {step} of 4</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 hover:bg-accent transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Step 1: Type Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">What type of transaction?</h3>
              <p className="text-muted-foreground">Choose whether you&apos;re adding money or taking it out</p>
            </div>
            <div className="grid gap-4">
              <button
                onClick={() => setType('deposit')}
                className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                  type === 'deposit'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-border hover:border-green-500/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className={`inline-flex rounded-full p-3 ${
                      type === 'deposit' ? 'bg-green-500/20' : 'bg-muted'
                    }`}>
                      <ArrowRight className="h-6 w-6 text-green-600 dark:text-green-400 rotate-[-45deg]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Deposit</h4>
                      <p className="text-sm text-muted-foreground">Add money to your savings</p>
                    </div>
                  </div>
                  {type === 'deposit' && (
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setType('withdrawal')}
                className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                  type === 'withdrawal'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-border hover:border-red-500/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className={`inline-flex rounded-full p-3 ${
                      type === 'withdrawal' ? 'bg-red-500/20' : 'bg-muted'
                    }`}>
                      <ArrowRight className="h-6 w-6 text-red-600 dark:text-red-400 rotate-[135deg]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Withdrawal</h4>
                      <p className="text-sm text-muted-foreground">Take money from your savings</p>
                    </div>
                  </div>
                  {type === 'withdrawal' && (
                    <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Amount */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">How much?</h3>
              <p className="text-muted-foreground">Enter the amount for this {type}</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <DollarSign className="h-6 w-6" />
                </div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-16 pl-14 text-2xl font-semibold bg-muted/30"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['10', '50', '100', '200', '500', '1000'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className="rounded-xl border bg-muted/50 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Category */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">What&apos;s this for?</h3>
              <p className="text-muted-foreground">Add a category to organize your savings</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Tag className="h-5 w-5" />
                </div>
                <Input
                  type="text"
                  placeholder="e.g., Emergency Fund, Vacation"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-14 pl-14 text-lg bg-muted/30"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Quick categories:</p>
                <div className="flex flex-wrap gap-2">
                  {['Emergency Fund', 'Vacation', 'New Car', 'Home Down Payment', 'Retirement', 'Education'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setCategory(preset)}
                      className="rounded-full border border-border/50 bg-muted/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Details */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Final details</h3>
              <p className="text-muted-foreground">Add optional notes and set the date</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description (optional)
                </Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Add a note..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-12 bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-base flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-12 bg-muted/30"
                />
              </div>

              {/* Summary Card */}
              <div className="mt-6 rounded-2xl border-2 border-dashed border-border/50 bg-muted/30 backdrop-blur-sm p-6 space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-semibold capitalize">{type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">${amount || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-semibold">{category || 'None'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 px-6 py-4 space-y-3 bg-muted/20 backdrop-blur-sm">
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 h-12 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1 h-12 rounded-xl"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!amount || !category}
              className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Save Entry
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

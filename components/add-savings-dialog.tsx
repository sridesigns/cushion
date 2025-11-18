"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SavingsEntry } from "@/lib/types"

interface AddSavingsDialogProps {
  onAdd: (entry: Omit<SavingsEntry, 'id'>) => void
}

export function AddSavingsDialog({ onAdd }: AddSavingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [type, setType] = useState<'deposit' | 'withdrawal'>('deposit')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

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
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        <Plus className="h-4 w-4" />
        Add Savings
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Savings Entry</DialogTitle>
            <DialogDescription>
              Track your savings by adding a new entry here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={type === 'deposit' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setType('deposit')}
                >
                  Deposit
                </Button>
                <Button
                  type="button"
                  variant={type === 'withdrawal' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setType('withdrawal')}
                >
                  Withdrawal
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Emergency Fund, Vacation"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Add a note..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { SavingsEntry } from "@/lib/types"

interface SavingsListProps {
  entries: SavingsEntry[]
  onDelete: (id: string) => void
}

export function SavingsList({ entries, onDelete }: SavingsListProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your savings history will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <ArrowUpCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No savings entries yet. Click &ldquo;Add Savings&rdquo; to get started!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest savings activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-2 ${
                  entry.type === 'deposit'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-red-500/10 text-red-500'
                }`}>
                  {entry.type === 'deposit' ? (
                    <ArrowUpCircle className="h-4 w-4" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{entry.category}</p>
                  {entry.description && (
                    <p className="text-xs text-muted-foreground">{entry.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-right ${
                  entry.type === 'deposit' ? 'text-green-500' : 'text-red-500'
                }`}>
                  <p className="text-sm font-semibold">
                    {entry.type === 'deposit' ? '+' : '-'}{formatCurrency(entry.amount)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(entry.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

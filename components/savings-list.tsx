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
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your savings history will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-4 mb-6 animate-pulse">
              <ArrowUpCircle className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ready to start building your financial cushion? Tap the button below to add your first savings entry!
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
        <CardDescription>{entries.length} {entries.length === 1 ? 'entry' : 'entries'} recorded</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="group flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-2.5 transition-transform duration-300 group-hover:scale-110 ${
                  entry.type === 'deposit'
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/10 text-green-600 dark:text-green-400'
                    : 'bg-gradient-to-br from-red-500/20 to-rose-500/10 text-red-600 dark:text-red-400'
                }`}>
                  {entry.type === 'deposit' ? (
                    <ArrowUpCircle className="h-5 w-5" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{entry.category}</p>
                  {entry.description && (
                    <p className="text-xs text-muted-foreground">{entry.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-right font-mono ${
                  entry.type === 'deposit'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  <p className="text-base font-bold">
                    {entry.type === 'deposit' ? '+' : '-'}{formatCurrency(entry.amount)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(entry.id)}
                  className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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

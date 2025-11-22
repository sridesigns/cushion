"use client"

import { ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCurrency } from "@/lib/currency-context"
import { formatDate } from "@/lib/utils"
import type { SavingsEntry } from "@/lib/types"

interface SavingsListProps {
  entries: SavingsEntry[]
  onDelete: (id: string) => void
}

export function SavingsList({ entries, onDelete }: SavingsListProps) {
  const { formatCurrency } = useCurrency()
  if (entries.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Activity</h2>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm text-muted-foreground max-w-sm">
            No transactions yet
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Activity</h2>
        <p className="text-xs text-muted-foreground">{entries.length} {entries.length === 1 ? 'transaction' : 'transactions'}</p>
      </div>
      <div className="space-y-0 divide-y divide-border/50">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="group flex items-center justify-between py-4 transition-all duration-200 hover:bg-muted/30 px-3 -mx-3"
            style={{
              animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex flex-col">
                <p className="text-sm font-medium">{entry.category}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(entry.date)}</span>
                  {entry.description && (
                    <>
                      <span>·</span>
                      <span className="truncate max-w-[200px]">{entry.description}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-right tabular-nums ${
                entry.type === 'deposit'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                <p className="text-base font-semibold">
                  {entry.type === 'deposit' ? '+' : '-'}{formatCurrency(entry.amount)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(entry.id)}
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Calendar,
  CreditCard,
  Hash,
  Copy,
  Check,
} from 'lucide-react'
import { format } from 'date-fns'

import { getTransactionById } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ResultDisplay } from '@/components/result-display'

export default function ResultPage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false)
  const transaction = getTransactionById(params.id)

  if (!transaction) {
    notFound()
  }

  const handleCopy = () => {
    if (!transaction) return
    navigator.clipboard.writeText(transaction.transactionId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isSuccess = transaction.status === 'Success'

  const details = [
    {
      icon: Hash,
      label: 'Transaction ID',
      value: transaction.transactionId,
      isMono: true,
      copyable: true,
    },
    {
      icon: Calendar,
      label: 'Date & Time',
      value: format(new Date(transaction.date), "dd MMM yyyy, HH:mm:ss"),
    },
    {
      icon: CreditCard,
      label: 'Card Used',
      value: `${transaction.cardType} ending in ${transaction.cardNumber.slice(-4)}`,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader className="items-center text-center">
          {isSuccess ? (
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500" />
          )}
          <CardTitle className="font-headline text-3xl">
            Payment {transaction.status}
          </CardTitle>
          <CardDescription className="text-lg">
            {formatCurrency(transaction.amount)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 rounded-lg border bg-secondary/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Response Code</span>
              <span className="font-mono text-sm font-semibold">{transaction.responseCode}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Gateway Message</span>
              <span className="text-right font-semibold">{transaction.gatewayMessage}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Transaction Details</h3>
            <ul className="space-y-3 text-sm">
              {details.map(({ icon: Icon, label, value, isMono, copyable }) => (
                <li key={label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="h-4 w-4" /> {label}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={isMono ? 'font-mono text-xs' : ''}>{value}</span>
                    {copyable && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <ResultDisplay transaction={transaction} />

          <div className="flex items-center gap-4 pt-4">
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/dashboard/payment">Make Another Payment</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
               <Link href="/dashboard/history">View History</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
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

export default function ResultPage() {
  const params = useParams<{ id: string }>()
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const transaction = getTransactionById(params.id)

  if (!transaction) {
    notFound()
  }

  const handleCopy = (key: string, text: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(prev => ({ ...prev, [key]: true }))
    setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000)
  }

  const isSuccess = transaction.status === 'Success'

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
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold">{transaction.responseCode}</span>
                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy('code', transaction.responseCode)}>
                    {copied['code'] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Gateway Message</span>
              <div className="flex items-center gap-2 text-right">
                <span className="text-right font-semibold">{transaction.gatewayMessage}</span>
                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy('msg', transaction.gatewayMessage)}>
                    {copied['msg'] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Transaction Details</h3>
            <ul className="space-y-3 text-sm">
               <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Hash className="h-4 w-4" /> Transaction ID
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={'font-mono text-xs'}>{transaction.transactionId}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy('txid', transaction.transactionId)}>
                          {copied['txid'] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                  </div>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" /> Date & Time
                  </span>
                   <span>{format(new Date(transaction.date), "dd MMM yyyy, HH:mm:ss")}</span>
                </li>
                 <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" /> Card Used
                  </span>
                  <span>{`${transaction.cardType} ending in ${transaction.cardNumber.slice(-4)}`}</span>
                </li>
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

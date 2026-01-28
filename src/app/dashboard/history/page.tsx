'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CreditCard, History } from 'lucide-react'
import { format } from 'date-fns'

import { getTransactions } from '@/lib/data'
import { formatCurrency, getCardType } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Icons } from '@/components/icons'

export default function HistoryPage() {
  const router = useRouter()
  const transactions = getTransactions()

  if (transactions.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <History className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-2xl font-bold tracking-tight font-headline">
              No Transaction History
            </h3>
            <p className="text-sm text-muted-foreground">
              You haven't made any test payments yet.
            </p>
            <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/dashboard/payment">Make a Payment</Link>
            </Button>
          </div>
        </div>
      )
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Transaction History
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>A complete log of all your test payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Card</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="text-right">Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(tx => {
                const cardType = getCardType(tx.cardNumber)
                const CardIcon = cardType === 'Other' ? CreditCard : Icons[cardType.toLowerCase() as keyof typeof Icons]
                return (
                  <TableRow key={tx.id} className="cursor-pointer" onClick={() => router.push(`/dashboard/result/${tx.id}`)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <CardIcon className="h-8 w-auto" />
                           <div>
                              <div className="font-medium">{tx.cardType}</div>
                              <div className="text-xs text-muted-foreground">
                                **** {tx.cardNumber.slice(-4)}
                              </div>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={tx.status === 'Success' ? 'border-chart-2/60 bg-chart-2/10 text-chart-2' : 'border-destructive/60 bg-destructive/10 text-destructive'}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(tx.amount)}</TableCell>
                      <TableCell className="text-right">
                        {format(new Date(tx.date), "dd MMM yyyy, HH:mm")}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">{tx.transactionId}</TableCell>
                  </TableRow>
                )}
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

import Link from 'next/link'
import { CreditCard } from 'lucide-react'
import { format } from 'date-fns'

import { getTransactions } from '@/lib/data'
import { formatCurrency, getCardType } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
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
  const transactions = getTransactions()

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
                  <TableRow key={tx.id} asChild>
                    <Link href={`/dashboard/result/${tx.id}`} className="cursor-pointer">
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
                        <Badge variant={tx.status === 'Success' ? 'default' : 'destructive'} className={tx.status === 'Success' ? `bg-green-100 text-green-800` : ''}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(tx.amount)}</TableCell>
                      <TableCell className="text-right">
                        {format(new Date(tx.date), "dd MMM yyyy, HH:mm")}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">{tx.transactionId}</TableCell>
                    </Link>
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

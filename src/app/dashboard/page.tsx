'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'

import { getTransactions, getTransactionStats } from '@/lib/data'
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
import { TransactionChart } from '@/components/transaction-chart'

export default function DashboardPage() {
  const router = useRouter()
  const stats = getTransactionStats()
  const recentTransactions = getTransactions().slice(0, 5)

  if (stats.total === 0) {
      return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" >
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight font-headline">
              No transactions yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Make your first test payment to see your dashboard.
            </p>
            <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/dashboard/payment">New Payment</Link>
            </Button>
          </div>
        </div>
      )
  }


  return (
    <>
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Dashboard
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Test Transactions
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Across all test cards
            </p>
          </CardContent>
        </Card>
        <Card className="border-chart-2/50 bg-chart-2/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-chart-2">
              Successful Payments
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{stats.success}</div>
            <p className="text-xs text-chart-2/80">
              {stats.total > 0 ? `${((stats.success / stats.total) * 100).toFixed(0)}% success rate` : 'No transactions yet'}
            </p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Failed Payments</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
             <p className="text-xs text-destructive/80">
              {stats.total > 0 ? `${((stats.failed / stats.total) * 100).toFixed(0)}% failure rate` : 'No transactions yet'}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                The last 5 test payments made.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/history">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map(tx => {
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
                      <TableCell className="text-center">
                        <Badge variant="outline" className={tx.status === 'Success' ? 'border-chart-2/60 bg-chart-2/10 text-chart-2' : 'border-destructive/60 bg-destructive/10 text-destructive'}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(tx.amount)}</TableCell>
                      <TableCell className="text-right">{format(new Date(tx.date), "dd MMM, yyyy")}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
         <div className="lg:col-span-3 flex flex-col gap-4">
          <TransactionChart stats={stats} />
          {stats.topFailureReasons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Top Failure Reasons
                </CardTitle>
                <CardDescription>
                  Most common errors in your test transactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {stats.topFailureReasons.map(({ reason, count }) => (
                    <li key={reason} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{reason}</span>
                      <span className="font-semibold">{count} {count > 1 ? 'times' : 'time'}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

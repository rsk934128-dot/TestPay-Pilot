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
              এখনও কোনো লেনদেন হয়নি
            </h3>
            <p className="text-sm text-muted-foreground">
              আপনার ড্যাশবোর্ড দেখতে আপনার প্রথম পরীক্ষা পেমেন্ট করুন।
            </p>
            <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/dashboard/payment">নতুন পেমেন্ট</Link>
            </Button>
          </div>
        </div>
      )
  }


  return (
    <>
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          ড্যাশবোর্ড
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              মোট টেস্ট লেনদেন
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              সমস্ত টেস্ট কার্ড জুড়ে
            </p>
          </CardContent>
        </Card>
        <Card className="border-chart-2/50 bg-chart-2/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-chart-2">
              সফল পেমেন্ট
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{stats.success}</div>
            <p className="text-xs text-chart-2/80">
              {stats.total > 0 ? `${((stats.success / stats.total) * 100).toFixed(0)}% সফলতার হার` : 'এখনও কোনো লেনদেন হয়নি'}
            </p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">ব্যর্থ পেমেন্ট</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
             <p className="text-xs text-destructive/80">
              {stats.total > 0 ? `${((stats.failed / stats.total) * 100).toFixed(0)}% ব্যর্থতার হার` : 'এখনও কোনো লেনদেন হয়নি'}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>সাম্প্রতিক লেনদেন</CardTitle>
              <CardDescription>
                শেষ ৫টি টেস্ট পেমেন্ট।
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/history">
                সব দেখুন
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>কার্ড</TableHead>
                  <TableHead className="text-center">স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">পরিমাণ</TableHead>
                  <TableHead className="text-right">তারিখ</TableHead>
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
                          {tx.status === 'Success' ? 'সফল' : 'ব্যর্থ'}
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
                  শীর্ষ ব্যর্থতার কারণ
                </CardTitle>
                <CardDescription>
                  আপনার টেস্ট লেনদেনের সবচেয়ে সাধারণ ত্রুটি।
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {stats.topFailureReasons.map(({ reason, count }) => (
                    <li key={reason} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{reason}</span>
                      <span className="font-semibold">{count} {count > 1 ? 'বার' : 'বার'}</span>
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

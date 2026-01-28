'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  DollarSign,
  Users,
  ListChecks,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

import { getTransactions, getTransactionStats } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { TransactionChart } from '@/components/transaction-chart'
import { PlaceHolderImages } from '@/lib/placeholder-images'

export default function DashboardPage() {
  const transactions = getTransactions().slice(0, 5) // Get last 5 for recent
  const stats = getTransactionStats()
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar')

  const totalVolume = getTransactions().reduce((sum, tx) => tx.status === 'Success' ? sum + tx.amount : sum, 0)
  const successRate = stats.total > 0 ? (stats.success / stats.total) * 100 : 0

  // Mock data for reconciliation and 2FA status
  const reconciliationStatus = 'সফল' // 'সফল' or 'ব্যর্থ'
  const twoFactorStatus = 'সক্রিয়' // 'সক্রিয়' or 'নিষ্ক্রিয়'

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট লেনদেন</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalVolume)}</div>
            <p className="text-xs text-muted-foreground">
              সমস্ত সফল লেনদেনের মোট পরিমাণ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">সফলতার হার</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.total}টি লেনদেনের মধ্যে {stats.success}টি সফল
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">দৈনিক পুনর্মিলন</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {reconciliationStatus === 'সফল' ? (
                <div className="flex items-center gap-2 text-2xl font-bold text-chart-2">
                    <CheckCircle className="h-6 w-6"/> 
                    <span>সফল</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-2xl font-bold text-destructive">
                    <AlertCircle className="h-6 w-6"/>
                    <span>ব্যর্থ</span>
                </div>
            )}
            <p className="text-xs text-muted-foreground">আজকের ডেটা সম্পূর্ণ মিলেছে</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2FA নিরাপত্তা</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {twoFactorStatus === 'সক্রিয়' ? (
                <div className="flex items-center gap-2 text-2xl font-bold text-chart-2">
                    <ShieldCheck className="h-6 w-6"/> 
                    <span>সক্রিয়</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-2xl font-bold text-yellow-500">
                    <AlertCircle className="h-6 w-6"/>
                    <span>নিষ্ক্রিয়</span>
                </div>
            )}
            <p className="text-xs text-muted-foreground">সকল অ্যাডমিন অ্যাকাউন্টে সক্রিয়</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>সাম্প্রতিক লেনদেন</CardTitle>
              <CardDescription>
                আপনার স্টোর থেকে শেষ ৫টি লেনদেন।
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
                  <TableHead>গ্রাহক</TableHead>
                  <TableHead className="text-center">স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">পরিমাণ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {userAvatar && (
                          <Avatar className="hidden h-9 w-9 sm:flex">
                              <AvatarImage src={userAvatar.imageUrl} alt="Avatar" data-ai-hint={userAvatar.imageHint} />
                              <AvatarFallback>??</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="font-medium">**** {tx.cardNumber.slice(-4)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={tx.status === 'Success' ? 'border-chart-2/60 bg-chart-2/10 text-chart-2' : 'border-destructive/60 bg-destructive/10 text-destructive'}>
                          {tx.status === 'Success' ? 'সফল' : 'ব্যর্থ'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(tx.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="space-y-4 md:space-y-8">
            <TransactionChart stats={stats} />
             <Card>
                <CardHeader>
                <CardTitle>শীর্ষ ব্যর্থতার কারণ</CardTitle>
                <CardDescription>
                    যে কারণে সবচেয়ে বেশি পেমেন্ট ব্যর্থ হয়েছে।
                </CardDescription>
                </CardHeader>
                <CardContent>
                {stats.topFailureReasons.length > 0 ? (
                    <ul className="space-y-3">
                    {stats.topFailureReasons.map((reason, index) => (
                        <li key={index} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground truncate pr-4">{reason.reason}</span>
                            <span className="font-medium">{reason.count}</span>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">কোনো ব্যর্থ লেনদেন নেই।</p>
                )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}

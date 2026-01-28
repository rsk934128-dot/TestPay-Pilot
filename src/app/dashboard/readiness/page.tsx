'use client'

import { CheckCircle, AlertCircle, XCircle, ShieldCheck, PieChart, Activity, DatabaseZap } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

// This data would come from a backend monitoring service in a real app.
const readinessData = {
  core: {
    sandboxStability: { status: 'স্থিতিশীল', code: 'UP' },
    criticalIssues: 0,
    failureAnalysis: { status: 'সম্পূর্ণ', issues: 0 },
    governance: { status: 'সক্রিয়' },
  },
  environment: {
    current: 'স্টেজিং',
    dataSegregation: { status: 'যাচাইকৃত' },
  },
  isReady: true,
}

const statusIcons = {
    UP: <CheckCircle className="h-5 w-5 text-chart-2" />,
    DEGRADED: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    DOWN: <XCircle className="h-5 w-5 text-destructive" />,
}

const renderStatus = (status: 'স্থিতিশীল' | 'সম্পূর্ণ' | 'সক্রিয়' | 'যাচাইকৃত') => (
  <div className="flex items-center gap-2">
    <CheckCircle className="h-5 w-5 text-chart-2" />
    <span className="font-semibold">{status}</span>
  </div>
);

export default function ReadinessPage() {
    const { core, environment, isReady } = readinessData;

  return (
    <>
      <div className="flex flex-col items-start mb-6">
        <h1 className="font-headline text-2xl font-semibold md:text-3xl">
          সিস্টেম প্রস্তুতি ও নিয়ন্ত্রণ
        </h1>
        <p className="text-muted-foreground mt-1">
          লাইভ প্রোমোশনের আগে চূড়ান্ত সিস্টেম-স্তরের পরীক্ষা।
        </p>
      </div>

       <Card className={`mb-8 border-2 ${isReady ? 'border-chart-2 bg-chart-2/10' : 'border-destructive bg-destructive/10'}`}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                 {isReady ? <ShieldCheck className="h-8 w-8 text-chart-2" /> : <XCircle className="h-8 w-8 text-destructive" />}
                <div>
                    <CardTitle className={`text-lg font-bold ${isReady ? 'text-chart-2' : 'text-destructive'}`}>
                        {isReady ? 'সিস্টেম লাইভ প্রোমোশনের জন্য প্রস্তুত' : 'লাইভ প্রোমোশন ব্লক করা হয়েছে'}
                    </CardTitle>
                     <p className="text-sm text-muted-foreground">সমস্ত স্বয়ংক্রিয় পরীক্ষা সফলভাবে পাস হয়েছে।</p>
                </div>
            </CardHeader>
      </Card>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <Activity className="w-8 h-8 text-primary" />
            <CardTitle>কোর সিস্টেম পরীক্ষা</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-md">
              <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">স্যান্ডবক্স স্থিতিশীলতা</span>
                  <div className="flex items-center gap-2">
                    {statusIcons[core.sandboxStability.code as keyof typeof statusIcons]}
                    <span className="font-semibold">{core.sandboxStability.status}</span>
                  </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">গুরুতর খোলা সমস্যা</span>
                  <span className={`font-bold text-lg ${core.criticalIssues > 0 ? 'text-destructive' : 'text-chart-2'}`}>{core.criticalIssues}</span>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <PieChart className="w-8 h-8 text-primary" />
            <CardTitle>বিশ্লেষণ ও প্রশাসন</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-md">
              <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ব্যর্থতা বিশ্লেষণ</span>
                  {renderStatus(core.failureAnalysis.status)}
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">প্রশাসন ও নিরীক্ষা</span>
                  {renderStatus(core.governance.status)}
              </div>
          </CardContent>
        </Card>
      </div>

       <Card className="mt-8">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <DatabaseZap className="w-8 h-8 text-primary" />
          <CardTitle>পরিবেশ নিয়ন্ত্রণ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-md">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">বর্তমান পরিবেশ</span>
                <span className="font-mono font-bold text-lg rounded-md bg-accent/20 text-accent-foreground px-2 py-1">{environment.current}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ডেটা পৃথকীকরণ</span>
                {renderStatus(environment.dataSegregation.status)}
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button size="lg" disabled={!isReady}>
            লাইভ প্রোমোশনের জন্য অনুরোধ করুন
        </Button>
      </div>
    </>
  )
}

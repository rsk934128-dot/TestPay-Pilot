'use client'

import { CheckCircle, AlertCircle, XCircle, Rocket, ShieldCheck, FileCheck, Server, Activity } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'


const readinessData = {
  currentEnvironment: 'STAGING',
  sandboxStability: { status: 'Stable', code: 'UP' },
  criticalIssues: 0,
  unresolvedIssues: 0,
  lastResetDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
  failureRate: 0.2,
  successRate: 99.8,
  isReady: true,
  apiUptime: 99.9,
  avgLatency: 120, // in ms
}

const statusIcons = {
    UP: <CheckCircle className="h-5 w-5 text-green-500" />,
    DEGRADED: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    DOWN: <XCircle className="h-5 w-5 text-red-500" />,
}

function CircularProgress({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-48 w-48">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-muted/20"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        <circle
          className="text-green-500"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-green-600 dark:text-green-400">{value}%</span>
        <span className="text-sm text-muted-foreground">Success Rate</span>
      </div>
    </div>
  );
}


export default function ReadinessPage() {
    const {
        currentEnvironment,
        sandboxStability,
        criticalIssues,
        lastResetDate,
        isReady,
        unresolvedIssues,
        failureRate,
        successRate,
        apiUptime,
        avgLatency
    } = readinessData;

  return (
    <>
      <div className="flex flex-col items-start mb-6">
        <h1 className="font-headline text-2xl font-semibold md:text-3xl">
          Go-Live Approval
        </h1>
        <p className="text-muted-foreground mt-1">
          Based on controlled evidence & Staging stability, the system is ready to promote to LIVE.
        </p>
      </div>

       <Card className={`mb-6 border-2 ${isReady ? 'border-green-500 bg-green-950/10' : 'border-red-500 bg-red-950/20'}`}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                 {isReady ? <ShieldCheck className="h-10 w-10 text-green-600" /> : <XCircle className="h-10 w-10 text-red-600" />}
                <div>
                <CardTitle className={`text-xl font-headline ${isReady ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                    {isReady ? 'Safe to Proceed to LIVE' : 'Promotion to LIVE is Blocked'}
                </CardTitle>
                <CardDescription className={isReady ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                    {isReady ? 'All readiness checks have passed successfully.' : 'Critical issues require attention before promotion.'}
                </CardDescription>
                </div>
                 <Button className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90" size="lg" disabled={!isReady}>
                    <Rocket className="mr-2 h-5 w-5" />
                    Approve for LIVE
                 </Button>
            </CardHeader>
      </Card>
      
       <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Stability</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
                <CircularProgress value={successRate} />
            </div>
            <div className="w-full flex-1 space-y-6">
                <h3 className="text-lg font-semibold text-center md:text-left">Key Achievements</h3>
                <ul className="space-y-4 text-md">
                    <li className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground"><span className="font-semibold text-foreground">Zero</span> unresolved critical issues</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">Failure rate below <span className="font-semibold text-foreground">0.2%</span> threshold</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">All failures <span className="font-semibold text-foreground">explained & resolved</span></span>
                    </li>
                </ul>
            </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="font-headline text-xl font-semibold md:text-2xl mb-4">Evidence: Staging Stability Checklist</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Server className="text-muted-foreground"/>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Environment</span>
                <Badge variant="outline" className="font-mono text-orange-600 border-orange-500">{currentEnvironment}</Badge>
              </div>
              <Separator />
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Gateway Stability</span>
                <div className="flex items-center gap-2">
                  {statusIcons[sandboxStability.code as keyof typeof statusIcons]}
                  <span className="font-semibold">{sandboxStability.status}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">API Uptime (24h)</span>
                <span className="font-semibold text-green-500">{apiUptime}%</span>
              </div>
               <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg. Latency</span>
                <span className="font-semibold">{avgLatency}ms</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="text-muted-foreground" />Issue Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Critical Issues</span>
                <span className={`font-bold text-2xl ${criticalIssues > 0 ? 'text-red-500' : 'text-green-500'}`}>{criticalIssues}</span>
              </div>
               <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Unresolved Items</span>
                <span className="font-bold text-2xl">{unresolvedIssues}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Failure Rate</span>
                  <span className={`font-semibold ${failureRate > 1 ? 'text-red-500' : 'text-green-500'}`}>{failureRate.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileCheck className="text-muted-foreground" />Governance & Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Data Reset</span>
                <span className="font-semibold">{new Date(lastResetDate).toLocaleDateString()}</span>
              </div>
               <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Audit Log Status</span>
                <span className="font-semibold text-green-500">Enabled</span>
              </div>
              <Separator />
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Data Retention</span>
                <span className="font-semibold">14 Days</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

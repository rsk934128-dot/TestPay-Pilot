'use client'

import { CheckCircle, AlertCircle, XCircle, ShieldCheck } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const readinessData = {
  currentEnvironment: 'TEST',
  sandboxStability: { status: 'Stable', code: 'UP' },
  criticalIssues: 0,
  lastResetDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  isReady: true,
}

const statusIcons = {
    UP: <CheckCircle className="h-5 w-5 text-chart-2" />,
    DEGRADED: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    DOWN: <XCircle className="h-5 w-5 text-destructive" />,
}


export default function ReadinessPage() {
    const {
        currentEnvironment,
        sandboxStability,
        criticalIssues,
        lastResetDate,
        isReady,
    } = readinessData;

  return (
    <>
      <div className="flex flex-col items-start mb-6">
        <h1 className="font-headline text-2xl font-semibold md:text-3xl">
          Payment Readiness & Reliability Platform
        </h1>
        <p className="text-muted-foreground mt-1">
          Now a robust platform, not a prototype or QA tool.
        </p>
      </div>

       <Card className={`mb-6 border-2 ${isReady ? 'border-chart-2 bg-chart-2/10' : 'border-destructive bg-destructive/10'}`}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                 {isReady ? <ShieldCheck className="h-8 w-8 text-chart-2" /> : <XCircle className="h-8 w-8 text-destructive" />}
                <div>
                    <CardTitle className={`text-lg font-semibold ${isReady ? 'text-chart-2' : 'text-destructive'}`}>
                        {isReady ? 'This system is safe to proceed to STAGING' : 'Promotion to STAGING is Blocked'}
                    </CardTitle>
                </div>
            </CardHeader>
      </Card>
      
       <Card className="mb-6">
        <CardHeader>
          <CardTitle>Launch Summary & Status Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-md">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Environment</span>
                <Badge variant="outline" className="font-mono text-orange-600 border-orange-500">{currentEnvironment}</Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sandbox Stability</span>
                 <div className="flex items-center gap-2">
                  {statusIcons[sandboxStability.code as keyof typeof statusIcons]}
                  <span className="font-semibold">{sandboxStability.status}</span>
                </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Critical Issues</span>
                 <span className={`font-bold text-lg ${criticalIssues > 0 ? 'text-destructive' : 'text-chart-2'}`}>{criticalIssues}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Reset Date</span>
                <span className="font-semibold">{new Date(lastResetDate).toLocaleDateString()}</span>
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" disabled={!isReady}>
            Promote to STAGING
        </Button>
      </div>
    </>
  )
}

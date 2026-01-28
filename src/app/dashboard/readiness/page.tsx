
'use client'

import { CheckCircle, AlertCircle, XCircle, Rocket } from 'lucide-react'
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

// Mock data - in a real app, this would come from a service
const readinessData = {
  currentEnvironment: 'TEST',
  sandboxStability: { status: 'Stable', code: 'UP' },
  criticalIssues: 0,
  unresolvedIssues: 2,
  lastResetDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  errorRate: 1.5, // as percentage
  isReady: true,
}

const statusIcons = {
    UP: <CheckCircle className="h-5 w-5 text-green-500" />,
    DEGRADED: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    DOWN: <XCircle className="h-5 w-5 text-red-500" />,
}


export default function ReadinessPage() {
    const {
        currentEnvironment,
        sandboxStability,
        criticalIssues,
        lastResetDate,
        isReady,
        unresolvedIssues,
        errorRate
    } = readinessData;

  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Launch Readiness
        </h1>
      </div>

       <Card className={`mb-6 border-2 ${isReady ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                 {isReady ? <CheckCircle className="h-10 w-10 text-green-600" /> : <XCircle className="h-10 w-10 text-red-600" />}
                <div>
                <CardTitle className={`text-xl font-headline ${isReady ? 'text-green-900' : 'text-red-900'}`}>
                    {isReady ? 'Ready to Promote to STAGING' : 'Promotion to STAGING is Blocked'}
                </CardTitle>
                <CardDescription className={isReady ? 'text-green-800' : 'text-red-800'}>
                    {isReady ? 'All checks have passed successfully.' : 'Critical issues require attention before promotion.'}
                </CardDescription>
                </div>
                 <Button className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90" size="sm">
                    <Rocket className="mr-2 h-4 w-4" />
                    Promote to Staging
                 </Button>
            </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current operational state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Environment</span>
              <Badge variant="outline" className="font-mono text-blue-600 border-blue-500">{currentEnvironment}</Badge>
            </div>
            <Separator />
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Sandbox Stability</span>
              <div className="flex items-center gap-2">
                {statusIcons[sandboxStability.code as keyof typeof statusIcons]}
                <span className="font-semibold">{sandboxStability.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue Summary</CardTitle>
            <CardDescription>Overview of unresolved items.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Critical Issues</span>
              <span className={`font-bold text-2xl ${criticalIssues > 0 ? 'text-red-500' : 'text-green-500'}`}>{criticalIssues}</span>
            </div>
             <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Other Unresolved</span>
              <span className="font-bold text-2xl">{unresolvedIssues}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Health & Metrics</CardTitle>
            <CardDescription>Integrity of the test data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Last Data Reset</span>
              <span className="font-semibold">{new Date(lastResetDate).toLocaleDateString()}</span>
            </div>
             <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Failure Rate</span>
              <span className={`font-semibold ${errorRate > 5 ? 'text-red-500' : 'text-green-500'}`}>{errorRate.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </>
  )
}

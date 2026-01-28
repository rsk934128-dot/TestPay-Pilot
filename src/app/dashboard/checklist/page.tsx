'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

const ChecklistItem = ({ children, id, defaultChecked = false }: { children: React.ReactNode; id: string, defaultChecked?: boolean }) => (
  <div className="flex items-center space-x-3 rounded-lg border p-4 bg-muted/30">
    <Checkbox id={id} defaultChecked={defaultChecked} />
    <label
      htmlFor={id}
      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  </div>
)

export default function ChecklistPage() {

  const checklistData = [
    { id: 'bank-confidence', label: 'Bank-Confidence Ready', checked: true },
    { id: 'management-signoff', label: 'Management Sign-off', checked: false },
    { id: 'demo-audit-ready', label: 'Demo & Audit Ready', checked: true },
    { id: 'qa-approved', label: 'QA Approved', checked: true },
    { id: 'ai-explanations-locked', label: 'AI Explanations Locked', checked: true },
    { id: 'all-issues-resolved', label: 'All Issues Resolved', checked: true },
    { id: 'admin-reviewed', label: 'Admin Reviewed', checked: true },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
       <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-semibold md:text-3xl">
            Go-Live Readiness Checklist
          </h1>
          <p className="text-muted-foreground mt-1">
            Ensures no payment system reaches production without being proven safe, and explainable.
          </p>
        </div>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
           <CardTitle>Final Sign-off</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="p-4 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-900 dark:border-yellow-600/50 dark:bg-yellow-950/50 dark:text-yellow-200">
                <p className="text-sm font-semibold">Gateway latency slightly elevated, consider re-testing before final approval.</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checklistData.map(item => (
                    <ChecklistItem key={item.id} id={item.id} defaultChecked={item.checked}>
                        {item.label}
                    </ChecklistItem>
                ))}
            </div>
            <div className="flex justify-end">
                <Button size="lg" disabled>
                    <Lock className="mr-2 h-4 w-4" />
                    Admin Reviewed
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

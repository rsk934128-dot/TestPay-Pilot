'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const ChecklistItem = ({ children, id }: { children: React.ReactNode; id: string }) => (
  <div className="flex items-start space-x-3">
    <Checkbox id={id} />
    <label
      htmlFor={id}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  </div>
)

const ChecklistSection = ({ title, itemsLeft, itemsRight }: { title: string; itemsLeft: string[]; itemsRight: string[] }) => (
  <section className="mb-8">
    <h2 className="text-lg font-semibold font-headline mb-4 pb-2 border-b">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
      <div className="space-y-4">
        {itemsLeft.map((item, index) => (
          <ChecklistItem key={index} id={`${title}-left-${index}`}>{item}</ChecklistItem>
        ))}
      </div>
      <div className="space-y-4">
        {itemsRight.map((item, index) => (
          <ChecklistItem key={index} id={`${title}-right-${index}`}>{item}</ChecklistItem>
        ))}
      </div>
    </div>
  </section>
)

export default function ChecklistPage() {

  const handlePrint = () => {
    window.print()
  }
  
  const checklistData = [
    {
      title: '1. Environment & Safety',
      itemsLeft: [
        'Current environment confirmed as STAGING',
        'LIVE environment access is locked and restricted',
      ],
      itemsRight: [
        'No test/sandbox credentials configured in LIVE',
        'Rollback mechanism verified and documented',
      ],
    },
    {
      title: '2. Stability & Performance',
      itemsLeft: [
        'Minimum required test volume completed',
        'Failure rate within approved threshold',
        'No unresolved critical errors',
      ],
      itemsRight: [
        'Gateway uptime verified',
        'Average response time within limits',
      ],
    },
    {
      title: '3. Failure Analysis & Resolution',
      itemsLeft: [
        'All failure types reviewed and categorized',
        'Root cause identified for each critical failure',
      ],
      itemsRight: [
        'Fixes implemented and re-tested successfully',
        'No unexplained or silent failures remain',
      ],
    },
     {
      title: '4. AI Explanation & Human Review',
      itemsLeft: [
        'AI explanations reviewed by QA/Admin',
        'Low-confidence explanations manually verified',
      ],
      itemsRight: [
        'Misleading or incorrect explanations corrected or locked',
        'AI clearly marked as advisory only',
      ],
    },
    {
      title: '5. Governance & Audit',
      itemsLeft: [
        'Audit logging enabled and verified',
        'Role-based access control enforced',
      ],
      itemsRight: [
        'Destructive actions protected with confirmation',
        'All STAGING actions traceable',
      ],
    },
     {
      title: '6. Launch Readiness Decision',
      itemsLeft: [
        'Launch Readiness indicator = 🟢 READY',
        'No open incidents or unresolved investigations',
      ],
      itemsRight: [
        'Risk level assessed as LOW / ACCEPTABLE',
      ],
    },
     {
      title: '7. Reporting & Transparency',
      itemsLeft: [
        'Executive summary generated',
        'Sensitive data redacted',
      ],
      itemsRight: [
        'Reports reviewed by stakeholders',
      ],
    },
  ]

  return (
    <div className="bg-muted/20 p-4 sm:p-8 -m-6 print:p-0 print:bg-white print:-m-6">
       <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-section, #print-section * {
            visibility: visible;
          }
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: auto;
            margin: 0.5in;
          }
        }
      `}</style>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="font-headline text-2xl font-semibold md:text-3xl">
            Promotion Checklist
          </h1>
          <p className="text-muted-foreground mt-1">
            Official record for STAGING → LIVE promotion approval.
          </p>
        </div>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print / Save as PDF
        </Button>
      </div>

      <Card className="w-full max-w-5xl mx-auto shadow-lg" id="print-section">
        <CardHeader className="text-center p-8 border-b">
          <div className="flex items-center justify-center gap-2">
            <Icons.logo />
            <span className="text-xl font-bold font-headline">TestPay</span>
          </div>
          <p className="text-muted-foreground text-sm pt-1">Payment Readiness & Reliability Platform</p>
          <h1 className="text-2xl font-bold font-headline pt-4">STAGING → LIVE Promotion Checklist</h1>
          <p className="text-muted-foreground">Official Launch Approval Record</p>
        </CardHeader>
        <CardContent className="p-8 md:p-12">
            {checklistData.map(section => (
                <ChecklistSection key={section.title} {...section} />
            ))}
            <Separator className="my-8" />
            <section>
              <h2 className="text-lg font-semibold font-headline mb-4 pb-2 border-b">8. Final Approval</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-semibold">Role</th>
                      <th className="py-2 px-4 text-left font-semibold">Name</th>
                      <th className="py-2 px-4 text-left font-semibold">Signature</th>
                      <th className="py-2 px-4 text-left font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Product Owner', 'Tech Lead', 'Tech / Risk', 'QA / Risk'].map(role => (
                       <tr key={role} className="border-b">
                          <td className="py-3 px-4 font-medium">{role}</td>
                          <td className="py-3 px-4"><div className="h-8"></div></td>
                          <td className="py-3 px-4"><div className="h-8"></div></td>
                          <td className="py-3 px-4"><div className="h-8"></div></td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <Separator className="my-8" />
            <section className="text-center">
                <h3 className="font-bold text-lg font-headline">Final Declaration</h3>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    All checks above have been completed and verified. The system is approved for promotion from STAGING to LIVE.
                </p>
            </section>
        </CardContent>
        <div className="border-t text-center text-xs text-muted-foreground p-4">
          Confidential Document | TestPay | {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </Card>
    </div>
  )
}

'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const ChecklistItem = ({ children, id }: { children: React.ReactNode; id: string }) => (
    <div className="flex items-start space-x-3">
        <Checkbox id={id} className="mt-1" />
        <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
            {children}
        </label>
    </div>
)

export default function PromotionChecklistPage() {

    const sections = {
        "1. Environment & Safety": [
            "Current environment confirmed as STAGING",
            "LIVE environment access is locked and restricted",
            "No test/sandbox credentials configured in LIVE",
            "Rollback mechanism verified and documented",
        ],
        "2. Stability & Performance": [
            "Minimum required test volume completed",
            "Failure rate within approved threshold",
            "No unresolved critical errors",
            "Gateway uptime verified",
            "Average response time within limits",
        ],
        "3. Failure Analysis & Resolution": [
            "All failure types reviewed and categorized",
            "Root cause identified for each critical failure",
            "Fixes implemented and re-tested successfully",
            "No unexplained or silent failures remain",
        ],
        "4. AI Explanation & Human Review": [
            "AI explanations reviewed by QA/Admin",
            "Low-confidence explanations manually verified",
            "Misleading or incorrect explanations corrected or locked",
            "AI clearly marked as advisory only",
        ],
        "5. Governance & Audit": [
            "Audit logging enabled and verified",
            "Role-based access control enforced",
            "Destructive actions protected with confirmation",
            "All STAGING actions traceable",
        ],
        "6. Launch Readiness Decision": [
            "Launch Readiness indicator = 🟢 READY",
            "No open incidents or unresolved investigations",
            "Risk level assessed as LOW / ACCEPTABLE",
        ],
        "7. Reporting & Transparency": [
            "Executive summary generated",
            "Sensitive data redacted",
            "Reports reviewed by stakeholders",
        ]
    }

    const approvalRoles = [
        "Product Owner",
        "Tech Lead",
        "QA / Risk",
        "Bank / Gateway (if required)",
    ]

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
            <div className="text-center space-y-2">
                <h1 className="font-headline text-3xl font-semibold">
                    STAGING → LIVE Promotion Checklist
                </h1>
                <p className="text-muted-foreground">
                    Formal approval checklist for promoting the payment system from STAGING to LIVE.
                </p>
            </div>

            <div className="space-y-6">
                {Object.entries(sections).map(([title, items]) => (
                     <Card key={title}>
                        <CardHeader>
                            <CardTitle className="text-lg">{title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map((item, index) => (
                                <ChecklistItem key={index} id={`${title.replace(/[^a-zA-Z]/g, '')}-${index}`}>{item}</ChecklistItem>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">8. Final Approval</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Role</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Signature</TableHead>
                                    <TableHead className="text-right w-[150px]">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {approvalRoles.map(role => (
                                    <TableRow key={role}>
                                        <TableCell className="font-medium">{role}</TableCell>
                                        <TableCell><div className="h-8 border-b"></div></TableCell>
                                        <TableCell><div className="h-8 border-b"></div></TableCell>
                                        <TableCell><div className="h-8 border-b"></div></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-primary/50 bg-primary/10">
                <CardHeader>
                    <CardTitle className="text-base text-primary-foreground/90 font-bold">Final Declaration</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm font-semibold text-primary-foreground">
                        All checks above have been completed and verified. The system is approved for promotion from STAGING to LIVE.
                    </p>
                </CardContent>
            </Card>
            
            <div className="text-center text-xs text-muted-foreground pt-4">
                <p>Document Status: Official Launch Approval Record</p>
            </div>
        </div>
    )
}

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
        "1. Environment & Credentials": [
            "Current environment confirmed as STAGING.",
            "LIVE environment access is locked and restricted to authorized personnel.",
            "No test/sandbox credentials or keys (e.g., ShurjoPay) are configured in LIVE.",
            "Configuration for LIVE has been validated and peer-reviewed.",
        ],
        "2. Pre-Launch Checks": [
            "Staging/Sandbox stability and performance tests passed.",
            "Legal and compliance checks for the LIVE environment are complete.",
            "A documented rollback mechanism has been verified and is ready.",
            "The environment switch mechanism is confirmed to be ready for activation.",
        ],
        "3. Launch Readiness & Testing": [
            "Stability & Performance: Minimum required test volume completed in STAGING.",
            "Failure Analysis: All failure types from STAGING have been reviewed and categorized.",
            "Failure Rate: The observed failure rate is within the approved threshold.",
            "Resolution: Root causes for all critical failures are identified, and fixes are verified.",
            "No unresolved critical or unexplained errors remain.",
        ],
        "4. Safety & Governance": [
            "Audit logging is enabled and verified for all critical actions in LIVE.",
            "Role-Based Access Control (RBAC) is enforced for the LIVE environment.",
            "Destructive actions (e.g., data reset) are protected with multi-factor confirmation.",
        ],
        "5. Post-Launch Readiness": [
            "Executive summary reports for the STAGING phase have been generated.",
            "All reports have been reviewed by stakeholders and sensitive data is redacted.",
            "Risk level for LIVE promotion is assessed as LOW / ACCEPTABLE.",
            "There are no open incidents or unresolved investigations from the STAGING phase.",
        ],
        "6. Final Decision": [
            "Launch Readiness Indicator = 🟢 READY",
            "System is recommended for safe promotion to LIVE.",
        ],
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
                    Sandbox → Live ENV Switch Checklist
                </h1>
                <p className="text-muted-foreground">
                    Formal approval checklist for promoting the payment system to a real-like testing environment.
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
                    <CardTitle className="text-lg">Final Approval Sign-off</CardTitle>
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

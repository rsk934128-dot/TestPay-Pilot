'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GitCompareArrows, Terminal, Puzzle, Cloud, Lightbulb } from 'lucide-react'

const mainScript = `// src/scripts/dailyReconciliation.ts

import { getAppTransactions } from "../lib/appTransactions";
import { fetchShurjoPaySettlement } from "../lib/shurjopay";
import { fetchBankStatement } from "../lib/bank";
import { generateDailyReconciliationReport } from "../lib/report";
import { sendAdminAlert } from "../lib/notifications";
import { updateDashboard } from "../lib/dashboard";

interface Transaction {
  order_id: string;
  amount: number;
  status: string;
  txn_id?: string;
  date: string;
}

// Main Function
export async function runDailyReconciliation(date: string) {
  console.log(\`[\${new Date().toISOString()}] Starting daily reconciliation for \${date}...\`);

  // Step 1: Fetch Data
  const appTxns: Transaction[] = await getAppTransactions(date);
  const spTxns: Transaction[] = await fetchShurjoPaySettlement(date);
  const bankTxns: Transaction[] = await fetchBankStatement(date);

  // Step 2: Match Transactions
  const mismatches: Transaction[] = [];

  for (const txn of appTxns) {
    const spMatch = spTxns.find(t => t.order_id === txn.order_id && t.amount === txn.amount && t.status === "SUCCESS");
    const bankMatch = bankTxns.find(t => t.amount === txn.amount && t.date === txn.date);

    if (!spMatch || !bankMatch) {
      mismatches.push(txn);
    }
  }

  // Step 3: Generate Daily Report
  await generateDailyReconciliationReport(date, mismatches);

  // Step 4: Auto Alert
  if (mismatches.length > 0) {
    await sendAdminAlert(mismatches);
    console.warn(\`[\${new Date().toISOString()}] Mismatches found! Admin alerted.\`);
  } else {
    console.log(\`[\${new Date().toISOString()}] All transactions reconciled successfully ✅\`);
  }

  // Step 5: Update Dashboard
  await updateDashboard(date, mismatches.length === 0);
}

// Optional Cron Job / Cloud Function Wrapper
if (require.main === module) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  runDailyReconciliation(today).catch(err => {
    console.error(\`[\${new Date().toISOString()}] Error in reconciliation:\`, err);
    process.exit(1);
  });
}
`

const supportingModules = [
    { 
        title: 'lib/appTransactions.ts',
        code: `export async function getAppTransactions(date: string) {
  // Fetch transactions from your Firestore or DB
  // Filter by LIVE environment and given date
  return [];
}`
    },
    { 
        title: 'lib/shurjopay.ts',
        code: `import fetch from "node-fetch";

export async function fetchShurjoPaySettlement(date: string) {
  // Call ShurjoPay API to get settlement report
  // Filter by date
  return [];
}`
    },
    { 
        title: 'lib/bank.ts',
        code: `export async function fetchBankStatement(date: string) {
  // Read CSV / API from bank
  // Filter by date
  return [];
}`
    },
     { 
        title: 'lib/report.ts',
        code: `export async function generateDailyReconciliationReport(date: string, mismatches: any[]) {
  // Generate CSV or PDF report
  console.log(\`[REPORT] \${date}: \${mismatches.length} mismatches\`);
}`
    },
    { 
        title: 'lib/notifications.ts',
        code: `export async function sendAdminAlert(mismatches: any[]) {
  // Send email or Slack alert
  console.log("[ALERT] Admin notified of mismatches");
}`
    },
    { 
        title: 'lib/dashboard.ts',
        code: `export async function updateDashboard(date: string, success: boolean) {
  // Update LIVE dashboard with reconciliation status
  console.log(\`[DASHBOARD] \${date}: success = \${success}\`);
}`
    },
]

export default function ReconciliationPage() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
        <div className="text-center space-y-2">
            <div className="inline-block bg-primary/10 p-3 rounded-lg">
                <GitCompareArrows className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-headline text-3xl font-semibold">
                দৈনিক লাইভ পুনর্মিলন অটোমেশন (Node.js/TypeScript)
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                একটি প্রোডাকশন-রেডি স্ক্রিপ্ট যা ShurjoPay + Bank + App ডেটা প্রতিদিন মিলিয়ে স্বয়ংক্রিয়ভাবে চেক করে।
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    <span>মূল স্ক্রিপ্ট: `dailyReconciliation.ts`</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                    <code>{mainScript}</code>
                </pre>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Puzzle className="h-5 w-5 text-primary" />
                    <span>সহায়ক মডিউল (Supporting Modules)</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supportingModules.map(module => (
                    <div key={module.title} className="bg-muted/50 p-3 rounded-lg space-y-2">
                        <h4 className="font-mono text-sm font-semibold">{module.title}</h4>
                        <pre className="bg-background p-2 rounded-md text-xs overflow-x-auto">
                            <code>{module.code}</code>
                        </pre>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-primary" />
                    <span>ডিপ্লয়মেন্ট (Deployment)</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">Schedule:</strong> Vercel Cron, Google Cloud Function, AWS Lambda + EventBridge</p>
                <p><strong className="text-foreground">Time:</strong> Run daily after bank settlement (12:30 AM recommended)</p>
                <p><strong className="text-foreground">Audit:</strong> Logs + Reports auto-save → Audit-ready</p>
            </CardContent>
        </Card>

        <Card className="border-accent bg-accent/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent-foreground/90">
                    <Lightbulb className="h-5 w-5" />
                    <span>বিশেষ পরামর্শ (Pro Tip)</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-accent-foreground/80">
                <p>» প্রথম সপ্তাহ ম্যানুয়ালি ক্রস-চেক করুন, পরে পুরোপুরি অটোমেশন চালু করুন।</p>
                <p>» আপনি চাইলে পরবর্তী ধাপে Slack + Email alert + PDF generation সহ সম্পূর্ণ প্রোডাকশন-রেডি প্যাকেজ তৈরি করা যেতে পারে।</p>
            </CardContent>
        </Card>
    </div>
  )
}

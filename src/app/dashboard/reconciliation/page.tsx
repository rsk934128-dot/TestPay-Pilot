'use client'

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
import { CheckCircle, Award, GitCompareArrows, Target, SlidersHorizontal, Workflow, Calendar, Lightbulb } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const components = [
    { name: 'App DB', responsibility: 'সমস্ত LIVE লেনদেন সঞ্চয় করে (order_id, amount, status, txn_id, timestamp)' },
    { name: 'ShurjoPay API', responsibility: 'দৈনিক সেটেলমেন্ট রিপোর্ট প্রদান করে (সফল লেনদেন + ব্যাচ আইডি)' },
    { name: 'Bank API / Statement CSV', responsibility: 'জমা হওয়া অর্থের পরিমাণ নিশ্চিত করে' },
    { name: 'Automation Script', responsibility: 'উপরের ৩টি ডেটা উৎস তুলনা করে এবং অমিল খুঁজে বের করে' },
    { name: 'Admin Notification', responsibility: 'ব্যতিক্রমের জন্য ইমেল / স্ল্যাক / ড্যাশবোর্ড সতর্কতা পাঠায়' },
]

const workflowSteps = [
    { 
        title: "ধাপ ১: ডেটা আনুন (Fetch Data)",
        code: `// 1. App transactions
const appTxns = await getAppTransactions(date);

// 2. ShurjoPay settlement report
const spTxns = await fetchShurjoPaySettlement(date);

// 3. Bank statement
const bankTxns = await fetchBankStatement(date);`
    },
    { 
        title: "ধাপ ২: লেনদেন মেলান (Match Transactions)",
        description: "order_id + amount দিয়ে মেলান। App এবং ShurjoPay-তে স্ট্যাটাস SUCCESS হতে হবে। ব্যাংকে জমা হওয়া পরিমাণ অবশ্যই মিলতে হবে।",
        code: `const mismatches = [];
for (const txn of appTxns) {
  const spMatch = spTxns.find(t => t.order_id === txn.order_id && t.amount === txn.amount);
  const bankMatch = bankTxns.find(t => t.amount === txn.amount && t.date === txn.date);

  if (!spMatch || !bankMatch) mismatches.push(txn);
}`
    },
    { 
        title: "ধাপ ৩: দৈনিক রিপোর্ট তৈরি করুন (Generate Daily Report)",
        description: "CSV / PDF ফরম্যাট। কলাম: Order ID | Amount | App Status | Gateway Status | Bank Credit | Notes",
        code: `await generateDailyReconciliationReport(date, mismatches);`
    },
    { 
        title: "ধাপ ৪: স্বয়ংক্রিয় সতর্কতা (Auto Alert)",
        description: "যদি অমিল পাওয়া যায় তবে অ্যাডমিনকে স্ল্যাক / ইমেল বিজ্ঞপ্তি পাঠান।",
        code: `if (mismatches.length > 0) {
  await sendAdminAlert(mismatches);
}`
    },
     { 
        title: "ধাপ ৫: ড্যাশবোর্ড আপডেট (Dashboard Update)",
        description: "দৈনিক পুনর্মিলন স্ট্যাটাস। সবকিছু মিললে সবুজ ✅, অমিল থাকলে লাল ❌।",
        code: `updateDashboard(date, mismatches.length === 0);`
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
                দৈনিক লাইভ পুনর্মিলন অটোমেশন
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                ShurjoPay + Bank + App ডেটা প্রতিদিন মিলিয়ে স্বয়ংক্রিয়ভাবে চেক করার একটি সম্পূর্ণ প্রক্রিয়া।
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>১. উদ্দেশ্য (Objective)</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
                <p>প্রতিদিনের LIVE ট্রানজ্যাকশনগুলো স্বয়ংক্রিয়ভাবে যাচাই করা যাতে কোনো অমিল বা অনুপস্থিত সেটেলমেন্ট না থাকে।</p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Badge variant="secondary">App → ShurjoPay → Bank</Badge>
                    <Badge variant="secondary">অমিলের জন্য স্বয়ংক্রিয় সতর্কতা</Badge>
                    <Badge variant="secondary">অডিট-প্রস্তুত লগ</Badge>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    <span>২. উপাদান (Components)</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">উপাদান</TableHead>
                            <TableHead>দায়িত্ব</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {components.map(component => (
                            <TableRow key={component.name}>
                                <TableCell className="font-medium">{component.name}</TableCell>
                                <TableCell>{component.responsibility}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-primary" />
                    <span>৩. ওয়ার্কফ্লো ধাপ (Workflow Steps)</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {workflowSteps.map(step => (
                    <div key={step.title}>
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                        {step.description && <p className="text-sm text-muted-foreground mb-3">{step.description}</p>}
                        <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                            <code>{step.code}</code>
                        </pre>
                    </div>
                ))}
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>৪. সময়সূচী (Schedule)</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                    <p><strong className="text-foreground">সময়:</strong> রাত ১২:৩০ (ব্যাংক সেটেলমেন্টের পর)</p>
                    <p><strong className="text-foreground">প্ল্যাটফর্ম:</strong> Google Cloud Function / AWS Lambda / Vercel Cron</p>
                    <p><strong className="text-foreground">ট্রিগার:</strong> স্বয়ংক্রিয় দৈনিক</p>
                    <p><strong className="text-foreground">পুনঃচেষ্টা:</strong> API ব্যর্থ হলে, ৩ বার পুনঃচেষ্টা করবে</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <span>৫. সুবিধা (Benefits)</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                    <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-chart-2" /> অডিট-প্রস্তুত দৈনিক লগ।</p>
                    <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-chart-2" /> ত্রুটি দ্রুত শনাক্তকরণ → আর্থিক ক্ষতি প্রতিরোধ।</p>
                    <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-chart-2" /> ন্যূনতম ম্যানুয়াল প্রচেষ্টা।</p>
                    <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-chart-2" /> ড্যাশবোর্ড রিয়েল-টাইম পুনর্মিলন স্বাস্থ্য দেখায়।</p>
                </CardContent>
            </Card>
        </div>

        <Card className="border-accent bg-accent/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent-foreground/90">
                    <Lightbulb className="h-5 w-5" />
                    <span>বিশেষ পরামর্শ (Pro Tip)</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-accent-foreground/80">
                <p>» প্রথম ৭ দিন ম্যানুয়াল চেকের সাথে অটোমেশন চালান।</p>
                <p>» নিশ্চিত করুন যে Bank CSV ফরম্যাট অটোমেশনের সাথে মেলে।</p>
                <p>» তাত্ক্ষণিক বিজ্ঞপ্তির জন্য স্ল্যাক এবং ইমেল উভয়ই ব্যবহার করুন।</p>
            </CardContent>
        </Card>
    </div>
  )
}

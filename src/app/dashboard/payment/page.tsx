import { PaymentForm } from '@/components/payment-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function PaymentPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          নতুন টেস্ট পেমেন্ট
        </h1>
      </div>
      <div className="flex-1 rounded-xl bg-muted/30 p-4">
        <div className="mx-auto max-w-xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>কার্ড টেস্ট পেমেন্ট</CardTitle>
              <CardDescription>
                একটি লেনদেন সিমুলেট করতে একটি ডামি কার্ড ব্যবহার করুন। কোনো আসল টাকা চার্জ করা হবে না।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

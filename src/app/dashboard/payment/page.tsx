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
          New Test Payment
        </h1>
      </div>
      <div className="flex-1 rounded-xl bg-muted/30 p-4">
        <div className="mx-auto max-w-xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Card Test Payment</CardTitle>
              <CardDescription>
                Use a dummy card to simulate a transaction. No real money will be charged.
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

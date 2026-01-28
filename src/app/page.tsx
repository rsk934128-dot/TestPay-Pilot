'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = () => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setCountdown(30);
    }, 1000);
  };


  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault()
    // In a real app, you'd handle OTP verification here.
    // For this pilot, we'll just navigate to the dashboard.
    router.push('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
               <Phone className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">
              Welcome to TestPay
            </CardTitle>
            <CardDescription>
              Enter a dummy mobile number and OTP to access the pilot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex gap-2">
                    <Input
                      id="country-code"
                      type="text"
                      className="w-20"
                      defaultValue="+880"
                    />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="1700000000"
                      defaultValue="1712345678"
                      className="flex-1"
                    />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="otp">One-Time Password (OTP)</Label>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-xs text-accent-foreground/80 hover:text-accent-foreground disabled:text-muted-foreground disabled:no-underline"
                    onClick={handleSendOtp}
                    disabled={countdown > 0 || isSending}
                  >
                    {isSending
                      ? 'Sending...'
                      : countdown > 0
                      ? `Resend in ${countdown}s`
                      : 'Send OTP'}
                  </Button>
                </div>
                <Input id="otp" type="text" placeholder="123456" defaultValue="123456" />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TestPay Pilot. For demonstration purposes only.</p>
      </footer>
    </main>
  )
}

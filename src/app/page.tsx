'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

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
import { Icons } from '@/components/icons'

export default function LoginPage() {
  const router = useRouter()

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
            <div className="mx-auto mb-4">
              <Icons.logo />
            </div>
            <CardTitle className="font-headline text-3xl">
              Welcome to TestPay
            </CardTitle>
            <CardDescription>
              Enter a dummy email and OTP to access the pilot dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="pilot@testpay.app"
                  defaultValue="pilot@testpay.app"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="otp">One-Time Password (OTP)</Label>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-xs text-accent-foreground/80 hover:text-accent-foreground"
                  >
                    Send OTP
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

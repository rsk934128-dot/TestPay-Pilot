'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Phone, ShieldCheck, TrendingUp, Zap } from 'lucide-react'
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
import { Icons } from '@/components/icons'

const rotatingTaglines = [
  "Building trust, one transaction at a time.",
  "From sandbox to live, with confidence.",
  "The platform for reliable payment systems.",
  "Data-driven decisions for your payment gateway.",
  "Ensuring your launch is flawless."
];

export default function LandingPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  useEffect(() => {
    const taglineTimer = setInterval(() => {
      setCurrentTaglineIndex((prevIndex) => (prevIndex + 1) % rotatingTaglines.length);
    }, 3000); // Change tagline every 3 seconds

    return () => clearInterval(taglineTimer);
  }, []);

  useEffect(() => {
    let otpTimer: NodeJS.Timeout;
    if (countdown > 0) {
      otpTimer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(otpTimer);
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
    <main className="flex min-h-screen w-full bg-secondary/30">
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        {/* Left side - Hero section */}
        <div className="flex flex-col justify-center items-center bg-card p-8 md:p-12">
            <div className="max-w-md w-full space-y-8">
                 <div className="flex items-center gap-4">
                    <Icons.logo />
                    <h1 className="font-headline text-4xl font-bold">
                        TestPay
                    </h1>
                 </div>
                 <div>
                    <h2 className="font-headline text-5xl font-bold tracking-tighter text-primary">
                        Launch with Confidence.
                    </h2>
                    <div className="mt-4 h-12">
                        <p className="text-xl text-muted-foreground transition-opacity duration-500">
                            {rotatingTaglines[currentTaglineIndex]}
                        </p>
                    </div>
                 </div>
                 <div className="space-y-4 pt-4">
                     <div className="flex items-start gap-4">
                        <ShieldCheck className="h-6 w-6 text-accent mt-1"/>
                        <div>
                            <h3 className="font-semibold">Risk-Controlled Testing</h3>
                            <p className="text-muted-foreground text-sm">Simulate failures in a safe sandbox before they impact real users.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <TrendingUp className="h-6 w-6 text-accent mt-1"/>
                        <div>
                            <h3 className="font-semibold">Data-Driven Decisions</h3>
                            <p className="text-muted-foreground text-sm">Replace guesswork with clear metrics and AI-powered insights.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <Zap className="h-6 w-6 text-accent mt-1"/>
                        <div>
                            <h3 className="font-semibold">Accelerate Go-Live</h3>
                            <p className="text-muted-foreground text-sm">Move from staging to production faster and with greater reliability.</p>
                        </div>
                     </div>
                 </div>
            </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-md">
                <Card className="shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-3xl">
                    Pilot Access
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
                        Enter Pilot
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    </form>
                </CardContent>
                </Card>
                <footer className="mt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} TestPay Pilot. For demonstration purposes only.</p>
                </footer>
            </div>
        </div>
      </div>
    </main>
  )
}

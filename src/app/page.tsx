'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  TrendingUp,
  Zap,
  Loader2,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth'
import { doc, serverTimestamp } from 'firebase/firestore'

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
import { useAuth, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase'
import { useToast } from '@/hooks/use-toast'

const featureBanners = [
  {
    icon: ShieldCheck,
    title: 'Risk-Controlled Testing',
    description:
      'Simulate failures in a safe sandbox before they impact real users.',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-blue-500',
  },
  {
    icon: TrendingUp,
    title: 'Data-Driven Decisions',
    description: 'Replace guesswork with clear metrics and AI-powered insights.',
    bgColor: 'bg-green-50 dark:bg-green-950',
    iconColor: 'text-green-500',
  },
  {
    icon: Zap,
    title: 'Accelerate Go-Live',
    description:
      'Move from staging to production faster and with greater reliability.',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    iconColor: 'text-purple-500',
  },
]

export default function LandingPage() {
  const router = useRouter()
  const auth = useAuth()
  const firestore = useFirestore()
  const { user, isUserLoading } = useUser()
  const { toast } = useToast()

  const [phoneNumber, setPhoneNumber] = useState('+8801712345678')
  const [otp, setOtp] = useState('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null)

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentBannerIndex(prevIndex => (prevIndex + 1) % featureBanners.length)
    }, 5000) // Change banner every 5 seconds

    return () => clearInterval(bannerTimer)
  }, [])

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard')
    }
  }, [user, isUserLoading, router])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSendOtp = async () => {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Authentication service not available. Please refresh.',
      });
      return;
    }
    setIsSendingOtp(true)
    try {
      // Lazy initialization of RecaptchaVerifier, create only if it doesn't exist
      if (!recaptchaVerifier.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
          }
        )
      }

      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.current
      )
      setConfirmationResult(result)
      setCountdown(60)
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${phoneNumber}. (For this pilot, use 123456)`,
      })
    } catch (error: any) {
      console.error('Error sending OTP:', error)
      toast({
        variant: 'destructive',
        title: 'Error Sending OTP',
        description: error.message,
      })
      // If an error occurs, nullify the verifier ref to allow re-creation on next attempt.
      recaptchaVerifier.current = null;
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault()
    
    // For pilot/demo purposes, allow login with a dummy OTP without sending one
    if (otp === '123456' && !confirmationResult) {
      setIsVerifyingOtp(true)
       try {
        // Since we don't have a real user, we can't create a document yet.
        // We'll redirect and let the auth state handle it.
        // This part is tricky without a real confirmation.
        // For the demo, let's just assume a dummy login for navigation.
        // In a real flow, you'd force OTP sending.
        
        // This is a placeholder for the demo to work.
        // In a real app, you would force the user to get a real OTP.
        const mockConfirmation = {
            confirm: async (code: string) => {
                if (code === '123456') {
                    // This won't create a real user session, so this is just for navigation in the demo
                    return Promise.resolve({} as any);
                } else {
                    return Promise.reject(new Error("Invalid code"));
                }
            }
        }
        await mockConfirmation.confirm(otp);
        router.push('/dashboard');

      } catch (e) {
         toast({ variant: 'destructive', title: 'Invalid OTP' });
      } finally {
        setIsVerifyingOtp(false);
      }
      return;
    }


    if (!confirmationResult) {
      toast({
        variant: 'destructive',
        title: 'OTP Required',
        description: 'Please click "Send OTP" first.',
      })
      return
    }

    setIsVerifyingOtp(true)
    try {
      const credential = await confirmationResult.confirm(otp)
      const loggedInUser = credential.user

      const userRef = doc(firestore, 'users', loggedInUser.uid)
      setDocumentNonBlocking(
        userRef,
        {
          id: loggedInUser.uid,
          mobileNumber: loggedInUser.phoneNumber,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      )

      toast({
        title: 'Login Successful',
        description: 'Welcome to TestPay Pilot!',
      })
      // The useEffect will handle the redirect to /dashboard
    } catch (error: any) {
      console.error('Error verifying OTP:', error)
      toast({
        variant: 'destructive',
        title: 'Error Verifying OTP',
        description: 'The OTP is incorrect. Please try again.',
      })
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const CurrentBannerIcon = featureBanners[currentBannerIndex].icon

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  
  return (
    <main className="flex min-h-screen w-full bg-secondary/30">
      <div id="recaptcha-container"></div>
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        {/* Left side - Hero section */}
        <div className="flex flex-col justify-center items-center bg-card p-8 md:p-12">
          <div className="max-w-md w-full space-y-8">
            <div className="flex items-center gap-4">
              <Icons.logo />
              <h1 className="font-headline text-4xl font-bold">TestPay</h1>
            </div>
            <div>
              <h2 className="font-headline text-5xl font-bold tracking-tighter text-primary">
                Launch with Confidence.
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Building trust, one transaction at a time.
              </p>
            </div>

            {/* Rotating Banner Section */}
            <div className="pt-4">
              <div
                className={`p-6 rounded-lg transition-all duration-500 ${featureBanners[currentBannerIndex].bgColor}`}
              >
                <div className="flex items-start gap-4">
                  <CurrentBannerIcon
                    className={`h-8 w-8 mt-1 flex-shrink-0 ${featureBanners[currentBannerIndex].iconColor}`}
                  />
                  <div>
                    <h3
                      className={`font-semibold text-lg ${featureBanners[currentBannerIndex].iconColor}`}
                    >
                      {featureBanners[currentBannerIndex].title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {featureBanners[currentBannerIndex].description}
                    </p>
                  </div>
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
                  Enter your mobile number to get an OTP and access the pilot.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="+8801700000000"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-28"
                        onClick={handleSendOtp}
                        disabled={countdown > 0 || isSendingOtp}
                      >
                        {isSendingOtp ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : countdown > 0 ? (
                          `${countdown}s`
                        ) : (
                          'Send OTP'
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password (OTP)</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      For demo, you can use OTP: 123456
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isVerifyingOtp}
                  >
                    {isVerifyingOtp ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Enter Pilot'
                    )}
                    {!isVerifyingOtp && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <footer className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                &copy; {new Date().getFullYear()} TestPay Pilot. For
                demonstration purposes only.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  )
}

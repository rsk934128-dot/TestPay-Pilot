'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Phone,
  Loader2,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuth, useUser, useFirestore } from '@/firebase'
import { Input } from '@/components/ui/input'
import { createUserProfileNonBlocking } from '@/firebase/non-blocking-login'


export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isLoading: isUserLoading } = useUser();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSendOtp = async () => {
    setError(null);
    if (!auth) {
      setError('Firebase is not initialized.');
      return;
    }
    if (!phoneNumber || !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      setError('Please enter a valid phone number with country code.');
      return;
    }

    setIsSendingOtp(true);
    
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
      }
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${phoneNumber}.`,
      });
    } catch (e: any) {
      setError(e.message || 'Failed to send OTP.');
      toast({
        variant: 'destructive',
        title: 'Failed to Send OTP',
        description: e.message || 'Please try again.',
      });
      if (recaptchaVerifierRef.current) {
        // @ts-ignore
        grecaptcha.reset(recaptchaVerifierRef.current.widgetId);
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    if (!confirmationResult) {
      setError('Please request an OTP first.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const userCredential = await confirmationResult.confirm(otp);
      const loggedInUser = userCredential.user;
      
      if (loggedInUser && firestore && loggedInUser.phoneNumber) {
        // Create user profile in Firestore if it doesn't exist
        createUserProfileNonBlocking(firestore, loggedInUser.uid, loggedInUser.phoneNumber);
      }

      toast({
        title: 'Login Successful',
        description: 'You are now logged in.',
      });
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message || 'Failed to verify OTP.');
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: e.message || 'The OTP is incorrect. Please try again.',
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };


  if (isUserLoading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen w-full bg-secondary/30 items-center justify-center">
        <div className="w-full max-w-md p-4">
            <Card className="shadow-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">
                  TestPay Pilot Access
                </CardTitle>
                <CardDescription>
                  Enter your phone number to receive a login code.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {!confirmationResult ? (
                    <div className="space-y-4">
                        <Input
                            type="tel"
                            placeholder="+8801712345678"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={isSendingOtp}
                        />
                        <Button
                            onClick={handleSendOtp}
                            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                            disabled={isSendingOtp}
                        >
                            {isSendingOtp ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                            <ArrowRight className="mr-2 h-4 w-4" />
                            )}
                            Send OTP
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            disabled={isVerifyingOtp}
                        />
                        <Button
                            onClick={handleVerifyOtp}
                            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                            disabled={isVerifyingOtp}
                        >
                            {isVerifyingOtp ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                            <ArrowRight className="mr-2 h-4 w-4" />
                            )}
                            Verify & Login
                        </Button>
                         <Button variant="link" onClick={() => {
                             setConfirmationResult(null);
                             setPhoneNumber('');
                             setOtp('');
                             }}>
                            Use a different phone number
                        </Button>
                    </div>
                )}
                <div id="recaptcha-container"></div>
              </CardContent>
            </Card>
            <footer className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                &copy; {new Date().getFullYear()} TestPay Pilot. For
                demonstration purposes only.
              </p>
            </footer>
        </div>
    </main>
  )
}

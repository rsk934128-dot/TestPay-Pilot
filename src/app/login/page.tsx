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
      setError('অনুগ্রহ করে দেশের কোড সহ একটি বৈধ ফোন নম্বর লিখুন।');
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
        title: 'ওটিপি পাঠানো হয়েছে',
        description: `${phoneNumber}-এ একটি ওটিপি পাঠানো হয়েছে।`,
      });
    } catch (e: any) {
      setError(e.message || 'ওটিপি পাঠাতে ব্যর্থ।');
      toast({
        variant: 'destructive',
        title: 'ওটিপি পাঠাতে ব্যর্থ',
        description: e.message || 'অনুগ্রহ করে আবার চেষ্টা করুন।',
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
      setError('অনুগ্রহ করে একটি বৈধ ৬-সংখ্যার ওটিপি লিখুন।');
      return;
    }
    if (!confirmationResult) {
      setError('অনুগ্রহ করে প্রথমে একটি ওটিপি অনুরোধ করুন।');
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
        title: 'লগইন সফল হয়েছে',
        description: 'আপনি এখন লগইন করেছেন।',
      });
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message || 'ওটিপি যাচাই করতে ব্যর্থ।');
      toast({
        variant: 'destructive',
        title: 'যাচাইকরণ ব্যর্থ হয়েছে',
        description: e.message || 'ওটিপি ভুল। অনুগ্রহ করে আবার চেষ্টা করুন।',
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
                  টেস্ট-পে পাইলট অ্যাক্সেস
                </CardTitle>
                <CardDescription>
                  লগইন কোড পেতে আপনার ফোন নম্বর লিখুন।
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>ত্রুটি</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {!confirmationResult ? (
                    <div className="space-y-4">
                        <Input
                            type="tel"
                            placeholder="+৮৮০১৭..."
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
                            ওটিপি পাঠান
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder="৬-সংখ্যার ওটিপি লিখুন"
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
                            যাচাই করে লগইন করুন
                        </Button>
                         <Button variant="link" onClick={() => {
                             setConfirmationResult(null);
                             setPhoneNumber('');
                             setOtp('');
                             }}>
                            অন্য ফোন নম্বর ব্যবহার করুন
                        </Button>
                    </div>
                )}
                <div id="recaptcha-container"></div>
              </CardContent>
            </Card>
            <footer className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                &copy; {new Date().getFullYear()} টেস্ট-পে পাইলট। শুধুমাত্র
                প্রদর্শনের উদ্দেশ্যে।
              </p>
            </footer>
        </div>
    </main>
  )
}

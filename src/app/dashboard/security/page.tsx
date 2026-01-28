'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert, QrCode, Server, Smartphone, UserCog, Lock } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const backendSetupCode = `
// src/actions/auth-actions.ts
'use server'

import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { saveUserSecret, getUserSecret } from '@/lib/db'; // Placeholder DB functions

// 1. Generate Secret & QR Code for a user
export async function generateTotpSecret(userId: string) {
  const secret = authenticator.generateSecret();
  // IMPORTANT: In a real app, encrypt this secret before saving
  await saveUserSecret(userId, secret);

  const otpauth = authenticator.keyuri(userId, 'TestPayPilot', secret);
  const qrCodeDataURL = await QRCode.toDataURL(otpauth);
  
  return { qrCode: qrCodeDataURL };
}

// 2. Validate OTP during login
export async function validateTotp(userId: string, token: string) {
  const secret = await getUserSecret(userId); // Fetch unencrypted secret
  if (!secret) {
    return { isValid: false, message: '2FA not set up for user.' };
  }

  const isValid = authenticator.check(token, secret);
  
  if (!isValid) {
    return { isValid: false, message: 'Invalid OTP' };
  }

  return { isValid: true, message: 'OTP valid, login success' };
}
`

const frontendSetupCode = `
// components/OtpSetup.tsx
'use client'

import { useEffect, useState } from 'react';
import { generateTotpSecret } from '@/actions/auth-actions';
import Image from 'next/image';

export default function OtpSetup({ userId }: { userId: string }) {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function setup() {
      const { qrCode } = await generateTotpSecret(userId);
      setQrCode(qrCode);
      setLoading(false);
    }
    setup();
  }, [userId]);

  if (loading) return <p>Generating QR Code...</p>;

  return (
    <div>
      <h3 className="font-semibold">Scan with your Authenticator App</h3>
      {qrCode && <Image src={qrCode} alt="OTP QR Code" width={200} height={200} />}
      <p className="text-sm text-muted-foreground mt-2">
        Once scanned, your app will generate a new 6-digit code every 30 seconds.
      </p>
    </div>
  );
}
`

const frontendLoginCode = `
// components/OtpLogin.tsx
'use client'
import { useState } from 'react';
import { validateTotp } from '@/actions/auth-actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function OtpLogin({ userId }: { userId: string }) {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyOtp = async () => {
    setIsVerifying(true);
    const result = await validateTotp(userId, token);
    setMessage(result.message);
    if (result.isValid) {
      // Handle successful login
    }
    setIsVerifying(false);
  };

  return (
    <div className="space-y-4">
      <Input 
        value={token} 
        onChange={e => setToken(e.target.value)} 
        maxLength={6} 
        placeholder="6-digit OTP"
      />
      <Button onClick={verifyOtp} disabled={isVerifying}>
        {isVerifying ? 'Verifying...' : 'Verify OTP'}
      </Button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
`
const securityBestPractices = [
    "শুধুমাত্র HTTPS ব্যবহার করুন।",
    "OTP চেষ্টার সংখ্যা সীমিত করুন (যেমন, প্রতি ঘন্টায় ৫ বার)।",
    "ডাটাবেসে Secret এনক্রিপ্ট করে সংরক্ষণ করুন।",
    "সর্বোচ্চ নিরাপত্তার জন্য ফোন OTP এবং TOTP একসাথে ব্যবহার করুন।",
]

export default function SecurityPage() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
        <div className="text-center space-y-2">
            <div className="inline-block bg-primary/10 p-3 rounded-lg">
                <ShieldAlert className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-headline text-3xl font-semibold">
                পূর্ণাঙ্গ নিরাপত্তা: Google Authenticator (TOTP) ইন্টিগ্রেশন
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                অ্যাপের নিরাপত্তাকে হ্যাক-প্রুফ করার জন্য টাইম-বেসড ওয়ান-টাইম পাসওয়ার্ড (TOTP) ব্যবহারের একটি ব্লুপ্রিন্ট।
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    <span>ব্যবহারকারীর জন্য 2FA সেটআপ ফ্লো</span>
                </CardTitle>
                 <CardDescription>
                    ব্যবহারকারীরা কীভাবে তাদের অ্যাকাউন্টে 2FA সক্রিয় করবে তার একটি ভিজ্যুয়াল ডেমো।
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">ধাপসমূহ:</h3>
                    <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>প্রোফাইল সেটিংসে গিয়ে "Enable 2FA"-তে ক্লিক করুন।</li>
                        <li>Google Authenticator বা অন্য কোনো TOTP অ্যাপ দিয়ে QR কোডটি স্ক্যান করুন।</li>
                        <li>আপনার অ্যাপে একটি নতুন "TestPayPilot" অ্যাকাউন্ট যুক্ত হবে।</li>
                        <li>লগইন করার সময় এই অ্যাপ থেকে প্রাপ্ত ৬-সংখ্যার কোডটি ব্যবহার করুন।</li>
                    </ul>
                </div>
                 <div className="flex flex-col items-center justify-center bg-muted p-6 rounded-lg">
                     <Image 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/TestPayPilot:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=TestPayPilot" 
                        width={150} 
                        height={150}
                        alt="Sample QR Code" 
                        data-ai-hint="qr code"
                    />
                    <p className="mt-4 text-sm font-semibold">আপনার Authenticator অ্যাপ দিয়ে স্ক্যান করুন</p>
                </div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    <span>ব্যাকএন্ড বাস্তবায়ন (Next.js Server Actions)</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                    <code>{backendSetupCode}</code>
                </pre>
            </CardContent>
        </Card>

         <div className="grid md:grid-cols-2 gap-8">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <span>ফ্রন্টএন্ড: সেটআপ কম্পোনেন্ট</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                        <code>{frontendSetupCode}</code>
                    </pre>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <span>ফ্রন্টএন্ড: লগইন কম্পোনেন্ট</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                        <code>{frontendLoginCode}</code>
                    </pre>
                </CardContent>
            </Card>
         </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-primary" />
                    <span>অ্যাডমিন ড্যাশবোর্ড কন্ট্রোল</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">অ্যাডমিনরা ব্যবহারকারীদের 2FA স্ট্যাটাস নিরীক্ষণ এবং পরিচালনা করতে পারবেন।</p>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr className="text-left">
                                <th className="p-3 font-semibold">User ID</th>
                                <th className="p-3 font-semibold">2FA Status</th>
                                <th className="p-3 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t">
                                <td className="p-3 font-mono">user_1a2b3c</td>
                                <td className="p-3"><Badge className="bg-chart-2/20 text-chart-2 border-chart-2/40">Enabled</Badge></td>
                                <td className="p-3"><Button variant="destructive" size="sm">Reset</Button></td>
                            </tr>
                            <tr className="border-t">
                                <td className="p-3 font-mono">user_4d5e6f</td>
                                <td className="p-3"><Badge variant="secondary">Disabled</Badge></td>
                                <td className="p-3"><Button variant="outline" size="sm" disabled>Reset</Button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
        
        <Card className="border-accent bg-accent/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent-foreground/90">
                    <Lock className="h-5 w-5" />
                    <span>নিরাপত্তার সেরা অনুশীলন</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-accent-foreground/80">
                <ul className="list-disc list-inside space-y-1">
                    {securityBestPractices.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
            </CardContent>
        </Card>
    </div>
  )
}

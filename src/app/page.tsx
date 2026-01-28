'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Zap,
  Wallet,
  Loader2,
} from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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
  const { toast } = useToast()

  const [account, setAccount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentBannerIndex(
        prevIndex => (prevIndex + 1) % featureBanners.length
      )
    }, 5000) // Change banner every 5 seconds

    return () => clearInterval(bannerTimer)
  }, [])
  
  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (localStorage.getItem('userAccount')) {
        router.push('/dashboard');
      }
      setIsLoading(false);
    }
    checkConnection();
  }, [router]);

  const handleConnectWallet = async () => {
    setIsLoading(true)
    setError(null)
    if ((window as any).ethereum) {
      try {
        const accounts: string[] = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        })
        if (accounts.length > 0) {
          const userAccount = accounts[0]
          setAccount(userAccount)
          localStorage.setItem('userAccount', userAccount)
          toast({
            title: 'Wallet Connected',
            description: `Connected with address: ${userAccount.substring(
              0,
              6
            )}...${userAccount.substring(userAccount.length - 4)}`,
          })
          router.push('/dashboard')
        }
      } catch (e: any) {
        setError(e.message || 'An error occurred while connecting the wallet.')
        toast({
          variant: 'destructive',
          title: 'Connection Failed',
          description: e.message || 'Could not connect to MetaMask.',
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      setError('MetaMask is not installed. Please install it to continue.')
      toast({
        variant: 'destructive',
        title: 'MetaMask Not Found',
        description: 'Please install the MetaMask browser extension.',
      })
      setIsLoading(false)
    }
  }

  const CurrentBannerIcon = featureBanners[currentBannerIndex].icon

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <main className="flex min-h-screen w-full bg-secondary/30">
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
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">
                  Web3 Pilot Access
                </CardTitle>
                <CardDescription>
                  Connect your MetaMask wallet to access the pilot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={handleConnectWallet}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  Connect with MetaMask
                </Button>
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

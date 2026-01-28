'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  CreditCard,
  History,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Settings,
  AlertTriangle,
  Trash2,
  ShieldCheck,
  ClipboardCheck,
  Mic,
  Projector,
  Loader2,
  Menu,
  Info,
  GitCompareArrows,
} from 'lucide-react'
import { useEffect } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Icons } from '@/components/icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ResetDataDialog } from '@/components/reset-data-dialog'
import { useUser, signOutNonBlocking, useAuth } from '@/firebase'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'


const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
  { href: '/dashboard/payment', icon: CreditCard, label: 'নতুন পেমেন্ট' },
  { href: '/dashboard/history', icon: History, label: 'ইতিহাস' },
  { href: '/dashboard/reconciliation', icon: GitCompareArrows, label: 'দৈনিক পুনর্মিলন' },
  { href: '/dashboard/readiness', icon: ShieldCheck, label: 'সিস্টেম প্রস্তুতি' },
  { href: '/dashboard/checklist', icon: ClipboardCheck, label: 'প্রোমোশন চেকলিস্ট' },
  { href: '/dashboard/pitch', icon: Mic, label: 'পিচ গাইড' },
  { href: '/dashboard/deck', icon: Projector, label: 'এক্সিকিউটিভ ডেক' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const { user, isLoading } = useUser()
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const handleLogout = () => {
    if (auth) {
      signOutNonBlocking(auth)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold font-headline"
            >
              <Icons.logo />
              <span className="">টেস্ট-পে</span>
            </Link>
            <Badge
              variant="outline"
              className="ml-auto border-primary text-primary"
            >
              লাইভ
            </Badge>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                      isActive && 'bg-muted text-primary'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <div className="flex items-center gap-4">
              {userAvatar && (
                <Image
                  src={userAvatar.imageUrl}
                  width={40}
                  height={40}
                  alt={userAvatar.description}
                  data-ai-hint={userAvatar.imageHint}
                  className="rounded-full"
                />
              )}
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold truncate">
                  {user.phoneNumber}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  প্রমাণিত ব্যবহারকারী
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>আমার অ্যাকাউন্ট</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>সেটিংস</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <ResetDataDialog>
                    <DropdownMenuItem
                      onSelect={e => e.preventDefault()}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>পাইলট ডেটা রিসেট</span>
                    </DropdownMenuItem>
                  </ResetDataDialog>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>লগ আউট</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
         <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
                <span className="sr-only">নেভিগেশন মেনু টগল করুন</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 mb-4 text-lg font-semibold font-headline"
                >
                  <Icons.logo />
                  <span>টেস্ট-পে</span>
                   <Badge
                      variant="outline"
                      className="ml-auto border-primary text-primary"
                    >
                      লাইভ
                    </Badge>
                </Link>
                {navItems.map(({ href, icon: Icon, label }) => {
                   const isActive = pathname === href;
                   return (
                    <Link
                      key={href}
                      href={href}
                      className={cn("flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground transition-all hover:text-foreground", isActive && "bg-muted text-foreground")}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                )})}
              </nav>
              <div className="mt-auto">
                 <div className="flex items-center gap-4">
                    {userAvatar && (
                      <Image
                        src={userAvatar.imageUrl}
                        width={40}
                        height={40}
                        alt={userAvatar.description}
                        data-ai-hint={userAvatar.imageHint}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold truncate">
                        {user.phoneNumber}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        প্রমাণিত ব্যবহারকারী
                      </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>আমার অ্যাকাউন্ট</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>সেটিংস</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ResetDataDialog>
                            <DropdownMenuItem
                            onSelect={e => e.preventDefault()}
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>পাইলট ডেটা রিসেট</span>
                            </DropdownMenuItem>
                        </ResetDataDialog>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>লগ আউট</span>
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className='flex-1'>
            <h1 className='font-headline font-semibold text-lg'>
                 {navItems.find(item => item.href === pathname)?.label || 'ড্যাশবোর্ড'}
            </h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {pathname === '/dashboard' ? (
             <Alert className="border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-500/50 dark:bg-blue-500/10 dark:text-blue-200 [&>svg]:text-blue-500">
                <Info className="h-4 w-4" />
                <AlertTitle className="font-semibold">
                  আপনি লাইভ সেটেলমেন্ট ভিউতে আছেন।
                </AlertTitle>
                <AlertDescription>
                  এটি প্রথম সেটেলমেন্টের একটি প্রমাণ।
                </AlertDescription>
              </Alert>
          ) : (
            <Alert className="border-yellow-200 bg-yellow-50/50 text-yellow-900 [&>svg]:text-yellow-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold">
                আপনি স্টেজিং মোডে আছেন।
              </AlertTitle>
              <AlertDescription>
                কোনো আসল টাকা চার্জ করা হবে না। এটি একটি পাইলট টেস্টিং পরিবেশ।
              </AlertDescription>
            </Alert>
          )}
          {children}
        </main>
         <footer className="p-4 text-xs bg-primary/90 text-primary-foreground/80">
          <div className="container mx-auto flex flex-wrap justify-between items-center gap-y-2 gap-x-4">
              <span>প্রস্তুতকারী: <strong>শেখ ফরিদ</strong></span>
              <span>তারিখ: <strong>২৯-জানু-২০২৬</strong></span>
              <span>অনুমোদনের স্থিতি: <Badge variant="secondary" className="bg-yellow-400 text-black">বিচারাধীন</Badge></span>
              <span>পরবর্তী: <strong>দৈনিক পুনর্মিলন এবং সম্পূর্ণ উৎপাদন রোলআউট</strong></span>
          </div>
        </footer>
      </div>
    </div>
  )
}

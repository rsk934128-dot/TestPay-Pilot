'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CreditCard,
  History,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Settings,
  AlertTriangle,
} from 'lucide-react'

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

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/payment', icon: CreditCard, label: 'New Payment' },
  { href: '/dashboard/history', icon: History, label: 'History' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

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
              <span className="">TestPay</span>
            </Link>
             <Badge variant="outline" className="ml-auto border-orange-500 text-orange-500">
                TEST MODE
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
                <p className="font-semibold truncate">Pilot User</p>
                <p className="text-xs text-muted-foreground truncate">pilot@testpay.app</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
           <Alert className="border-yellow-200 bg-yellow-50/50 text-yellow-900 [&>svg]:text-yellow-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className='font-semibold'>You are in TEST MODE.</AlertTitle>
              <AlertDescription>
                No real money will be charged. This is a pilot testing environment.
              </AlertDescription>
            </Alert>
          {children}
        </main>
        <footer className="p-6 pt-0 text-center text-sm text-muted-foreground">
          <p>This is a pilot testing environment.</p>
        </footer>
      </div>
    </div>
  )
}

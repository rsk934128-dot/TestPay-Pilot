'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BarChart, ShieldCheck, Cpu, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Autoplay from "embla-carousel-autoplay"
import React from 'react'

const features = [
    {
        icon: <ShieldCheck className="h-10 w-10 text-primary" />,
        title: 'Risk-First Simulation',
        description: 'Safely test payment flows in a sandboxed environment without processing real card data.',
    },
    {
        icon: <Cpu className="h-10 w-10 text-primary" />,
        title: 'AI-Powered Analysis',
        description: 'Get human-readable explanations for complex gateway response codes and messages in seconds.',
    },
    {
        icon: <BarChart className="h-10 w-10 text-primary" />,
        title: 'Launch Readiness',
        description: 'Use data-driven checklists and executive decks to make confident promotion decisions.',
    },
]

export default function LandingPage() {
    const bannerImages = PlaceHolderImages.filter(img => img.id.startsWith('banner-'))
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
             <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold font-headline ml-2">TestPay Pilot</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center">
              <Button asChild>
                <Link href="/dashboard">
                  Launch App <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           <div className="absolute inset-0 z-0">
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full h-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent className="h-full">
                        {bannerImages.map((image) => (
                        <CarouselItem key={image.id}>
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill={true}
                                style={{objectFit: 'cover'}}
                                className="opacity-20"
                                data-ai-hint={image.imageHint}
                            />
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
           </div>

          <div className="container relative z-10 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Go LIVE with Confidence
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                TestPay Pilot is a risk-control platform for payment systems, moving beyond simple QA. It provides evidence-based launch readiness, ensuring every promotion to LIVE is safe, audited, and approved.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                 <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 md:py-32 bg-secondary/40">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Why TestPay Pilot?
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                A purpose-built platform designed for the final step before LIVE: authoritative, data-driven decision making.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col items-center text-center p-4">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex items-center justify-center h-16">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TestPay Pilot. For demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  )
}

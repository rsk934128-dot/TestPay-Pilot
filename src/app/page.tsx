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
        title: 'ঝুঁকি-প্রথম সিমুলেশন',
        description: 'বাস্তব কার্ড ডেটা প্রক্রিয়া না করে একটি স্যান্ডবক্স পরিবেশে নিরাপদে পেমেন্ট ফ্লো পরীক্ষা করুন।',
    },
    {
        icon: <Cpu className="h-10 w-10 text-primary" />,
        title: 'AI-চালিত বিশ্লেষণ',
        description: 'জটিল গেটওয়ে প্রতিক্রিয়া কোড এবং বার্তাগুলির জন্য সেকেন্ডের মধ্যে মানুষের পাঠযোগ্য ব্যাখ্যা পান।',
    },
    {
        icon: <BarChart className="h-10 w-10 text-primary" />,
        title: 'লঞ্চ প্রস্তুতি',
        description: 'আত্মবিশ্বাসের সাথে প্রচারের সিদ্ধান্ত নিতে ডেটা-চালিত চেকলিস্ট এবং এক্সিকিউটিভ ডেক ব্যবহার করুন।',
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
            <span className="font-bold font-headline ml-2">টেস্ট-পে পাইলট</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center">
              <Button asChild>
                <Link href="/dashboard">
                  অ্যাপ চালু করুন <ArrowRight className="ml-2 h-4 w-4" />
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
                আত্মবিশ্বাসের সাথে লাইভ করুন
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
              টেস্ট-পে পাইলট হল পেমেন্ট সিস্টেমের জন্য একটি ঝুঁকি-নিয়ন্ত্রণ প্ল্যাটফর্ম, যা সাধারণ QA-এর বাইরেও কাজ করে। এটি প্রমাণ-ভিত্তিক লঞ্চ প্রস্তুতির নিশ্চয়তা দেয়, যাতে প্রতিটি লাইভ প্রোমোশন নিরাপদ, নিরীক্ষিত এবং অনুমোদিত হয়।
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    ড্যাশবোর্ডে যান <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                 <Button size="lg" variant="outline" asChild>
                  <Link href="#features">আরও জানুন</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 md:py-32 bg-secondary/40">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                কেন টেস্ট-পে পাইলট?
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              লাইভের আগে চূড়ান্ত পদক্ষেপের জন্য নির্মিত একটি প্ল্যাটফর্ম: ಅಧಿಕೃತ, ডেটা-চালিত সিদ্ধান্ত গ্রহণ।
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
            &copy; {new Date().getFullYear()} টেস্ট-পে পাইলট। শুধুমাত্র প্রদর্শনের উদ্দেশ্যে।
          </p>
        </div>
      </footer>
    </div>
  )
}

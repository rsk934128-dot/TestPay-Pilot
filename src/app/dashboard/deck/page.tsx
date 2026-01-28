'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Shield, Target } from 'lucide-react'

const slides = [
  {
    icon: Target,
    title: 'স্লাইড ১: অনুরোধ',
    heading: 'লাইভ প্রোমোশনের জন্য অনুমোদন চাওয়া হচ্ছে',
    points: [
      'আজ, আমরা আমাদের পেমেন্ট সিস্টেমকে স্টেজিং থেকে লাইভে প্রোমোট করার জন্য অনুমোদন চাইছি।',
      'এই সুপারিশটি নিয়ন্ত্রিত টেস্টিং, নিরীক্ষিত প্রমাণ এবং স্পষ্ট ঝুঁকি মূল্যায়নের উপর ভিত্তি করে করা—অনুমানের উপর নয়।',
    ],
  },
  {
    icon: Shield,
    title: 'স্লাইড ২: প্রমাণ ও প্রশাসন',
    heading: 'ডেটা-চালিত আত্মবিশ্বাস',
    points: [
      'ব্যর্থতার হার অনুমোদিত সীমার মধ্যে।',
      'কোনো অমীমাংসিত গুরুতর সমস্যা নেই।',
      'সমস্ত ব্যর্থতার মূল কারণ চিহ্নিত করা হয়েছে।',
      'গেটওয়ের স্থিতিশীলতা পারফরম্যান্স সীমা পূরণ করে।',
      'সম্পূর্ণ অডিট লগ এবং ভূমিকা-ভিত্তিক অ্যাক্সেস প্রয়োগ করা হয়েছে।',
      'সিস্টেম লঞ্চ প্রস্তুতি সূচক সবুজ।',
    ],
  },
  {
    icon: CheckCircle,
    title: 'স্লাইড ৩: সিদ্ধান্ত',
    heading: 'সুপারিশ: এগিয়ে যাওয়া নিরাপদ',
    points: [
      'উদ্দেশ্যমূলক মানদণ্ডের উপর ভিত্তি করে, সিস্টেম সুপারিশ করে: লাইভে এগিয়ে যাওয়া নিরাপদ।',
      'নিয়ন্ত্রণ, ডেটা এবং সুরক্ষা ব্যবস্থা সহ, আমরা চূড়ান্ত অনুমোদনের জন্য অনুরোধ করছি।',
      'অনুমোদিত না হলে, সিস্টেমটি লক থাকবে—কোনো ঝুঁকি তৈরি হবে না।',
    ],
  },
]

export default function ExecutiveDeckPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="font-headline text-3xl font-semibold">
          ৩-স্লাইডের এক্সিকিউটিভ ডেক
        </h1>
        <p className="text-muted-foreground">
          সিইও/বোর্ডের অনুমোদনের জন্য একটি সংক্ষিপ্ত ভিজ্যুয়াল সারসংক্ষেপ।
        </p>
      </div>

      <Carousel className="w-full max-w-2xl">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="h-[450px] flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                        <slide.icon className="h-8 w-8 text-primary" />
                        <CardTitle className="text-xl">{slide.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center text-center flex-1 p-6">
                    <div className="space-y-6">
                        <h2 className="font-headline text-3xl font-bold">{slide.heading}</h2>
                        <ul className={`space-y-4 text-lg text-muted-foreground ${index === 1 ? 'text-left list-disc pl-6' : ''}`}>
                            {slide.points.map((point, i) => (
                                <li key={i} className={index === 1 ? 'pl-2' : ''}>
                                    {point.includes("সবুজ") ? (
                                        <>
                                            সিস্টেম লঞ্চ প্রস্তুতি সূচক <span className="font-bold text-chart-2">সবুজ।</span>
                                        </>
                                    ) : (
                                        point
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 md:-left-12" />
        <CarouselNext className="-right-4 md:-right-12" />
      </Carousel>
       <p className="text-xs text-muted-foreground mt-8">স্লাইড নেভিগেট করতে তীরচিহ্ন বা বাটন ব্যবহার করুন।</p>
    </div>
  )
}

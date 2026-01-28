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
    title: 'Slide 1: The Ask',
    heading: 'Seeking Approval for LIVE Promotion',
    points: [
      'Today, we are seeking approval to promote our payment system from STAGING to LIVE.',
      'This recommendation is based on controlled testing, audited evidence, and clear risk assessment—not assumptions.',
    ],
  },
  {
    icon: Shield,
    title: 'Slide 2: The Evidence & Governance',
    heading: 'Data-Driven Confidence',
    points: [
      'Failure rate is within approved threshold.',
      'Zero unresolved critical issues remain.',
      'All failures have identified root causes.',
      'Gateway stability meets performance limits.',
      'Full audit logs and role-based access are enforced.',
      'System Launch Readiness Indicator is GREEN.',
    ],
  },
  {
    icon: CheckCircle,
    title: 'Slide 3: The Decision',
    heading: 'Recommendation: Safe to Proceed',
    points: [
      'Based on objective criteria, the system recommends: Safe to proceed to LIVE.',
      'With the controls, data, and safeguards in place, we are requesting final approval.',
      'If not approved, the system remains locked—no risk is introduced.',
    ],
  },
]

export default function ExecutiveDeckPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="font-headline text-3xl font-semibold">
          3-Slide Executive Deck
        </h1>
        <p className="text-muted-foreground">
          A concise visual summary for CEO/Board approval.
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
                                    {point.includes("GREEN") ? (
                                        <>
                                            System Launch Readiness Indicator is <span className="font-bold text-green-600">GREEN.</span>
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
       <p className="text-xs text-muted-foreground mt-8">Use arrow keys or buttons to navigate the slides.</p>
    </div>
  )
}

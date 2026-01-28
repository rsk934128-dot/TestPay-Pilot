'use client'

import { useState } from 'react'
import { Loader2, Sparkles, ThumbsUp, ThumbsDown, Info, Lock, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

import { getInterpretation } from '@/lib/actions'
import type { Transaction } from '@/lib/definitions'
import type { InterpretApiResponseCodeOutput } from '@/ai/flows/interpret-api-response-codes'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Skeleton } from './ui/skeleton'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const renderInterpretation = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const sections: {title: string, content: string}[] = [];
    
    for (const line of lines) {
        const match = line.replace(/^- /, '').match(/\*\*(.*?):\*\*(.*)/);
        if (match) {
            const [, title, content] = match;
            sections.push({title: title.trim(), content: content.trim()});
        } else if (sections.length > 0) {
            sections[sections.length - 1].content += '\n' + line;
        } else {
             sections.push({title: '', content: line});
        }
    }
    
    if (sections.length === 0) {
        return <p className="text-muted-foreground whitespace-pre-wrap">{text}</p>;
    }

    return (
        <div className="space-y-4">
            {sections.map(({title, content}, index) => (
                 <div key={index}>
                    {title && <h4 className="font-semibold text-foreground">{title}</h4>}
                    <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
                </div>
            ))}
        </div>
    );
};

export function ResultDisplay({ transaction }: { transaction: Transaction }) {
  const [interpretation, setInterpretation] = useState<InterpretApiResponseCodeOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [interpretationMeta, setInterpretationMeta] = useState<{ version: number, timestamp: Date | null }>({ version: 1, timestamp: null });
  const [feedback, setFeedback] = useState<'helpful' | 'unhelpful' | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [reviewedBy, setReviewedBy] = useState<string | null>(null);

  const handleInterpret = async () => {
    setIsLoading(true)
    setInterpretation(null)
    const result = await getInterpretation(
      transaction.responseCode,
      transaction.gatewayMessage
    )
    if (result) {
        setInterpretation(result);
        setInterpretationMeta(prev => ({ version: isLocked ? prev.version : prev.version + 1, timestamp: new Date() }));
    } else {
        setInterpretation({
            interpretation: "এই মুহূর্তে একটি ব্যাখ্যা পাওয়া যায়নি। এআই মডেল অফলাইন হতে পারে বা একটি ত্রুটি ঘটেছে।",
            confidence: 'Low',
            explanationBasis: 'এআই পরিষেবার সাথে যোগাযোগ করার সময় একটি ত্রুটি ঘটেছে।'
        });
    }
    setIsLoading(false)
  }

  const handleFeedback = (newFeedback: 'helpful' | 'unhelpful') => {
      if (feedback === newFeedback) {
          setFeedback(null);
      } else {
          setFeedback(newFeedback);
      }
  };

  const handleLockExplanation = () => {
      setIsLocked(true);
      setReviewedBy("অ্যাডমিন");
  };

  const confidenceColor = {
    High: 'border-green-500 text-green-600',
    Medium: 'border-yellow-500 text-yellow-600',
    Low: 'border-red-500 text-red-600',
  }[interpretation?.confidence || 'Low'];

  return (
    <div className="mt-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>AI-চালিত কোড ব্যাখ্যা</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              গেটওয়ে প্রতিক্রিয়া কোড এবং বার্তার একটি মানুষের পাঠযোগ্য ব্যাখ্যা পেতে আমাদের AI টুল ব্যবহার করুন।
            </p>
            <Button
              onClick={handleInterpret}
              disabled={isLoading || isLocked}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ব্যাখ্যা করা হচ্ছে...
                </>
              ) : isLocked ? 'ব্যাখ্যা লক করা হয়েছে' : 'প্রতিক্রিয়া ব্যাখ্যা করুন'}
            </Button>
            {isLoading && (
              <div className="mt-4 space-y-4 rounded-lg border bg-secondary/50 p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
                 <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
                 <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            )}
            {interpretation && !isLoading && (
               <div className="mt-4 space-y-4 rounded-lg border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">AI আত্মবিশ্বাস:</span>
                      <Badge variant="outline" className={confidenceColor}>{interpretation.confidence}</Badge>
                    </div>
                     {isLocked && reviewedBy && (
                        <Badge variant="secondary" className="border-green-600 bg-green-100 text-green-800">
                           <CheckCircle className="mr-1 h-3 w-3" />
                           পর্যালোচনা করেছেন {reviewedBy}
                        </Badge>
                      )}
                  </div>

                  <Separator />

                  <div className="font-sans text-sm">
                    {renderInterpretation(interpretation.interpretation)}
                  </div>
                
                 <Accordion type="single" collapsible className="w-full -mb-4">
                    <AccordionItem value="why" className="border-b-0">
                        <AccordionTrigger className="py-2 text-xs text-muted-foreground hover:no-underline hover:text-primary">
                            <div className="flex items-center gap-1">
                                <Info className="h-3 w-3" />
                                এই ব্যাখ্যা কেন?
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 text-xs text-muted-foreground space-y-2">
                            <p><span className="font-semibold">ভিত্তি:</span> {interpretation.explanationBasis}</p>
                            <p><span className="font-semibold">মডেল:</span> Gemini</p>
                            {interpretationMeta.timestamp && (
                              <p><span className="font-semibold">সর্বশেষ আপডেট:</span> {format(interpretationMeta.timestamp, "dd MMM yyyy, HH:mm")}</p>
                            )}
                            <p><span className="font-semibold">ব্যাখ্যা সংস্করণ:</span> v{interpretationMeta.version}.0</p>
                            <div className="flex items-center gap-2">
                            <span className="font-semibold">পর্যালোচনা করেছেন:</span>
                             {isLocked ? 
                                <Badge variant="secondary" className="bg-green-100 text-green-800">{reviewedBy}</Badge> : 
                                <Badge variant="secondary">এখনও হয়নি</Badge>
                             }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                 <Separator />

                 <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">এটি কি সহায়ক ছিল?</span>
                    <div className="flex gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className={cn("h-7 w-7", feedback === 'helpful' && 'bg-green-100 text-green-700 hover:bg-green-100/80')} onClick={() => handleFeedback('helpful')}>
                                        <ThumbsUp className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>সহায়ক</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className={cn("h-7 w-7", feedback === 'unhelpful' && 'bg-red-100 text-red-700 hover:bg-red-100/80')} onClick={() => handleFeedback('unhelpful')}>
                                        <ThumbsDown className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>সহায়ক নয়</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                  </div>
                
                 <Separator />

                 <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-semibold text-muted-foreground">অ্যাডমিন অ্যাকশন</span>
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleLockExplanation}
                                  disabled={isLocked}
                                >
                                  <Lock className="mr-2 h-4 w-4" />
                                  {isLocked ? "লকড" : "ব্যাখ্যা লক করুন"}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>পরিবর্তন রোধ করতে এবং পর্যালোচিত হিসাবে চিহ্নিত করতে লক করুন।</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                 </div>
                 
                 <p className="pt-4 text-xs text-muted-foreground/80">
                  * এআই ব্যাখ্যা পরামর্শমূলক। টেস্ট ডেটা ১৪ দিনের মধ্যে স্বয়ংক্রিয়ভাবে মুছে ফেলা হবে।
                </p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

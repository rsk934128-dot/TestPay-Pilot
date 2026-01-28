'use client'

import { useState } from 'react'
import { Loader2, Sparkles, ThumbsUp, ThumbsDown, Info } from 'lucide-react'
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

  const handleInterpret = async () => {
    setIsLoading(true)
    setInterpretation(null)
    const result = await getInterpretation(
      transaction.responseCode,
      transaction.gatewayMessage
    )
    if (result) {
        setInterpretation(result);
        setInterpretationMeta(prev => ({ version: prev.version, timestamp: new Date() }));
    } else {
        setInterpretation({
            interpretation: "Could not get an interpretation at this time. The AI model may be offline or an error occurred.",
            confidence: 'Low',
            explanationBasis: 'An error occurred while contacting the AI service.'
        });
    }
    setIsLoading(false)
  }

  const handleFeedback = (newFeedback: 'helpful' | 'unhelpful') => {
      // In a real app, this would be sent to a logging service.
      // For this pilot, we just update the UI state to show interaction.
      if (feedback === newFeedback) {
          setFeedback(null); // Allow deselecting
      } else {
          setFeedback(newFeedback);
      }
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
              <span>AI-Powered Code Interpretation</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Use our AI tool to get a human-readable explanation of the gateway response code and message.
            </p>
            <Button
              onClick={handleInterpret}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Interpreting...
                </>
              ) : (
                'Interpret Response'
              )}
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
                      <span className="text-xs font-semibold text-muted-foreground">AI Confidence:</span>
                      <Badge variant="outline" className={confidenceColor}>{interpretation.confidence}</Badge>
                    </div>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-primary hover:underline">Official Docs (Placeholder)</a>
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
                                Why this explanation?
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 text-xs text-muted-foreground space-y-2">
                            <p><span className="font-semibold">Basis:</span> {interpretation.explanationBasis}</p>
                            <p><span className="font-semibold">Model:</span> Gemini</p>
                            {interpretationMeta.timestamp && (
                              <p><span className="font-semibold">Last Updated:</span> {format(interpretationMeta.timestamp, "dd MMM yyyy, HH:mm")}</p>
                            )}
                            <p><span className="font-semibold">Explanation Version:</span> v{interpretationMeta.version}.0</p>
                            <div className="flex items-center gap-2">
                            <span className="font-semibold">Reviewed:</span>
                            <Badge variant="secondary">Not Yet</Badge>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                 <Separator />

                 <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">Was this helpful?</span>
                    <div className="flex gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className={cn("h-7 w-7", feedback === 'helpful' && 'bg-green-100 text-green-700 hover:bg-green-100/80')} onClick={() => handleFeedback('helpful')}>
                                        <ThumbsUp className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Helpful</p>
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
                                    <p>Not Helpful</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                  </div>
                 
                 <p className="pt-2 text-xs text-muted-foreground/80">
                  * AI explanation is advisory, not official gateway documentation.
                </p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

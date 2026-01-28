'use client'

import { useState } from 'react'
import { Loader2, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react'

import { getInterpretation } from '@/lib/actions'
import type { Transaction } from '@/lib/definitions'
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
  const [interpretation, setInterpretation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInterpret = async () => {
    setIsLoading(true)
    setInterpretation(null)
    const result = await getInterpretation(
      transaction.responseCode,
      transaction.gatewayMessage
    )
    setInterpretation(result)
    setIsLoading(false)
  }

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
                      <Badge variant="outline" className="border-green-500 text-green-600">High</Badge>
                    </div>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-primary hover:underline">Official Docs (Placeholder)</a>
                  </div>

                  <Separator />

                  <div className="font-sans text-sm">
                    {renderInterpretation(interpretation)}
                  </div>
                
                 <Separator />

                 <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">Was this helpful?</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
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

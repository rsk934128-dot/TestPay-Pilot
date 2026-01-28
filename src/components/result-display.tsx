'use client'

import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'

import { getInterpretation } from '@/lib/actions'
import type { Transaction } from '@/lib/definitions'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

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
                'Interpret Response Code'
              )}
            </Button>
            {interpretation && (
              <div className="mt-4 rounded-lg border bg-secondary/50 p-4">
                <p className="font-semibold">Interpretation:</p>
                <p className="text-muted-foreground">{interpretation}</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createTestPayment, type State } from '@/lib/actions'
import { getCardType } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { Icons } from './icons'
import type { CardType } from '@/lib/definitions'

const FormSchema = z.object({
  cardNumber: z.string().refine((val) => /^\d{13,19}$/.test(val.replace(/\s/g, '')), {
    message: 'Card number must be between 13 and 19 digits.',
  }),
  expiryDate: z.string().refine((val) => /^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/.test(val), {
    message: 'Must be in MM / YY format.',
  }),
  cvv: z.string().refine((val) => /^\d{3,4}$/.test(val), {
    message: 'CVV must be 3 or 4 digits.',
  }),
  amount: z.string(),
  customAmount: z.string().optional(),
})

type FormValues = z.infer<typeof FormSchema>

const presets = [
    { name: 'Visa', number: '4242424242424242', expiry: '12/25', cvv: '123' },
    { name: 'Mastercard', number: '5555555555555555', expiry: '11/24', cvv: '123' },
    { name: 'Amex', number: '378282246310005', expiry: '01/26', cvv: '1234' },
]

export function PaymentForm() {
  const { toast } = useToast()
  const initialState: State = { message: null, errors: {} }
  const [state, formAction] = useFormState(createTestPayment, initialState)
  const [isPending, startTransition] = useTransition()

  const [detectedCardType, setDetectedCardType] = useState<CardType>('Other')

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      amount: '50',
      customAmount: '',
    },
  })

  const amountType = form.watch('amount')
  const cardNumber = form.watch('cardNumber')

  useEffect(() => {
    if (cardNumber) {
      setDetectedCardType(getCardType(cardNumber.replace(/\s/g, '')))
    } else {
      setDetectedCardType('Other')
    }
  }, [cardNumber])

  useEffect(() => {
    if (state.message && state.errors) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: state.message,
      })
    }
  }, [state, toast])

  const onSubmit = (data: FormValues) => {
    const finalAmount = data.amount === 'custom' ? data.customAmount : data.amount
    const formData = new FormData()
    formData.append('cardNumber', data.cardNumber.replace(/\s/g, ''))
    formData.append('expiryDate', data.expiryDate.replace(/\s/g, ''))
    formData.append('cvv', data.cvv)
    formData.append('amount', finalAmount || '0')
    formData.append('cardType', getCardType(data.cardNumber.replace(/\s/g, '')))

    startTransition(() => {
      formAction(formData)
    })
  }
  
  const CardIcon = {
    Visa: Icons.visa,
    Mastercard: Icons.mastercard,
    Amex: Icons.amex,
    Other: () => null,
  }[detectedCardType]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
            <FormLabel>Card Presets</FormLabel>
            <div className="flex flex-wrap gap-2">
                {presets.map(p => (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        key={p.name}
                        onClick={() => {
                            form.setValue('cardNumber', p.number)
                            form.setValue('expiryDate', p.expiry)
                            form.setValue('cvv', p.cvv)
                            form.trigger(['cardNumber', 'expiryDate', 'cvv'])
                        }}
                    >
                        {p.name}
                    </Button>
                ))}
            </div>
        </div>
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input placeholder="0000 0000 0000 0000" {...field} />
                </FormControl>
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <CardIcon className="h-8 w-auto" />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input placeholder="MM / YY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4 md:grid-cols-4"
                >
                  {['10', '50', '100'].map(val => (
                    <FormItem key={val} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={val} />
                      </FormControl>
                      <FormLabel className="font-normal">৳{val}</FormLabel>
                    </FormItem>
                  ))}
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="custom" />
                    </FormControl>
                    <FormLabel className="font-normal">Custom</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {amountType === 'custom' && (
          <FormField
            control={form.control}
            name="customAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Amount (৳)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
        )}
        
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Run Test Payment'
          )}
          {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </Form>
  )
}

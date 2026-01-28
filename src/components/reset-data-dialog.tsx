'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { resetAllData } from '@/lib/actions'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function ResetDataDialog({ children }: { children: React.ReactNode }) {
  const [isPending, setIsPending] = useState(false)
  const [open, setOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const { toast } = useToast()
  const [step, setStep] = useState(1);

  const expectedConfirmation = "RESET";

  const handleReset = async () => {
    setIsPending(true)
    const result = await resetAllData()
    setIsPending(false)
    
    if (result.success) {
      toast({
        title: "পাইলট ডেটা রিসেট সফলভাবে সম্পন্ন হয়েছে।",
        description: "সমস্ত টেস্ট লেনদেনের ডেটা সফলভাবে মুছে ফেলা হয়েছে।",
      })
      setOpen(false) 
    } else {
      toast({
        variant: "destructive",
        title: "ত্রুটি",
        description: "পাইলট ডেটা রিসেট করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
      })
    }
  }

  const onOpenChange = (isOpen: boolean) => {
      if (!isOpen) {
          setConfirmationText('');
          setStep(1);
      }
      setOpen(isOpen);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>আপনি কি পুরোপুরি নিশ্চিত?</AlertDialogTitle>
          <AlertDialogDescription as="div" className="space-y-4 pt-2">
            <p>
              এই কাজটি необратиযোগ্য। এটি স্থায়ীভাবে সমস্ত পাইলট লেনদেনের ডেটা মুছে ফেলবে।
            </p>
            {step === 1 && (
                <>
                <div className="rounded-lg border border-orange-300 bg-orange-50 p-3 text-orange-900 dark:border-orange-600/50 dark:bg-orange-950/50 dark:text-orange-200">
                    <p className="text-sm font-semibold">আপনি <span className="font-mono bg-orange-200/50 px-1 py-0.5 rounded-sm">টেস্ট</span> পরিবেশে কাজ করছেন।</p>
                </div>
                <div>
                  <Label htmlFor="confirmation-input" className="font-normal">
                    নিশ্চিত করতে, অনুগ্রহ করে নিচের বাক্সে <strong className="font-mono text-destructive">{expectedConfirmation}</strong> টাইপ করুন।
                  </Label>
                  <Input
                    id="confirmation-input"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder={expectedConfirmation}
                    autoComplete="off"
                    className="mt-2"
                  />
                </div>
              </>
            )}
             {step === 2 && (
                <div className="rounded-lg border-2 border-destructive bg-red-50 p-4 text-destructive-foreground">
                    <h4 className="font-bold text-red-800">চূড়ান্ত নিশ্চিতকরণ</h4>
                    <p className="text-sm text-red-700">এটি আপনার শেষ সুযোগ। 'রিসেট' ক্লিক করলে সমস্ত ডেটা স্থায়ীভাবে মুছে যাবে।</p>
                </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} onClick={() => setStep(1)}>বাতিল</AlertDialogCancel>
          {step === 1 ? (
            <Button
                onClick={() => setStep(2)}
                disabled={confirmationText !== expectedConfirmation}
            >
                চালিয়ে যান
            </Button>
          ) : (
            <AlertDialogAction 
              onClick={handleReset} 
              disabled={isPending} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              পাইলট ডেটা রিসেট করুন
            </AlertDialogAction>
          )}

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

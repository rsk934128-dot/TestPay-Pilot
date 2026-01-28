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
import { Label } from './ui/label'

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
        title: "Pilot data reset completed safely.",
        description: "All test transaction data has been successfully deleted.",
      })
      setOpen(false) 
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not reset pilot data. Please try again.",
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
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription as="div" className="space-y-4 pt-2">
            <p>
              This action is irreversible. It will permanently delete all pilot transaction data.
            </p>
            {step === 1 && (
                <>
                <div className="rounded-lg border border-orange-300 bg-orange-50 p-3 text-orange-900 dark:border-orange-600/50 dark:bg-orange-950/50 dark:text-orange-200">
                    <p className="text-sm font-semibold">You are operating in the <span className="font-mono bg-orange-200/50 px-1 py-0.5 rounded-sm">TEST</span> environment.</p>
                </div>
                <div>
                  <Label htmlFor="confirmation-input" className="font-normal">
                    To confirm, please type <strong className="font-mono text-destructive">{expectedConfirmation}</strong> in the box below.
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
                    <h4 className="font-bold text-red-800">Final Confirmation</h4>
                    <p className="text-sm text-red-700">This is your last chance. Clicking 'Reset' will delete all data permanently.</p>
                </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} onClick={() => setStep(1)}>Cancel</AlertDialogCancel>
          {step === 1 ? (
            <Button
                onClick={() => setStep(2)}
                disabled={confirmationText !== expectedConfirmation}
            >
                Continue
            </Button>
          ) : (
            <AlertDialogAction 
              onClick={handleReset} 
              disabled={isPending} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Pilot Data
            </AlertDialogAction>
          )}

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

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

export function ResetDataDialog({ children }: { children: React.ReactNode }) {
  const [isPending, setIsPending] = useState(false)
  const [open, setOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const { toast } = useToast()

  const handleReset = async () => {
    setIsPending(true)
    const result = await resetAllData()
    setIsPending(false)
    
    if (result.success) {
      toast({
        title: "Pilot Data Reset",
        description: "All test transaction data has been safely reset.",
      })
      setOpen(false) // Close dialog on success
      setConfirmationText('') // Reset for next time
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not reset pilot data. Please try again.",
      })
    }
  }

  // Reset confirmation text when dialog is closed
  const onOpenChange = (isOpen: boolean) => {
      if (!isOpen) {
          setConfirmationText('');
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
            <div className="rounded-lg border border-orange-300 bg-orange-50 p-3 text-orange-900 dark:border-orange-600/50 dark:bg-orange-950/50 dark:text-orange-200">
                <p className="text-sm font-semibold">You are operating in the <span className="font-mono bg-orange-200/50 px-1 py-0.5 rounded-sm">TEST</span> environment.</p>
            </div>
            <div>
              To confirm, please type <strong className="font-mono text-destructive">RESET</strong> in the box below.
            </div>
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="RESET"
              autoComplete="off"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleReset} 
            disabled={isPending || confirmationText !== 'RESET'} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Pilot Data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

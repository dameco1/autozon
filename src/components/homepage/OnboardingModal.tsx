import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { analytics } from "@/lib/analytics"

const STORAGE_KEY = "autozon_onboarding_v1"

export const OnboardingModal: React.FC = () => {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false
    return !localStorage.getItem(STORAGE_KEY)
  })
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (open) analytics.onboardingShown()
  }, [open])

  const dismiss = (reached: number) => {
    localStorage.setItem(STORAGE_KEY, "1")
    analytics.onboardingDismissed(reached)
    setOpen(false)
  }

  if (!open) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) dismiss(step)
      }}
    >
      <DialogContent className="sm:max-w-md">
        {step === 0 ? (
          <>
            <DialogHeader>
              <DialogTitle>Welcome to Autozon</DialogTitle>
              <DialogDescription>Are you mainly buying or selling a car?</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 pt-2">
              <Button className="w-full bg-orange text-orange-foreground" onClick={() => setStep(1)}>
                I want to buy
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                I want to sell
              </Button>
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => dismiss(0)}>
                Skip
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>AI-first experience</DialogTitle>
              <DialogDescription>
                Upload photos for an instant valuation, or swipe through cars with no login required until you save.
              </DialogDescription>
            </DialogHeader>
            <Button className="w-full mt-2" onClick={() => dismiss(1)}>
              Got it
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

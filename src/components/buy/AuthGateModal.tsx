import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export const AuthGateModal: React.FC<Props> = ({ open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Save this car</DialogTitle>
        <DialogDescription>Create a free account to keep your shortlist across devices.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 pt-2">
        <Link to="/login?redirect=/buy" onClick={() => onOpenChange(false)}>
          <Button className="w-full bg-orange text-orange-foreground">Log in</Button>
        </Link>
        <Link to="/signup?redirect=/buy" onClick={() => onOpenChange(false)}>
          <Button variant="outline" className="w-full">
            Register
          </Button>
        </Link>
      </div>
    </DialogContent>
  </Dialog>
)

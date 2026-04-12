import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type Props = {
  email: string
  password: string
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onPublish: () => void
  loading?: boolean
}

export const EmailConfirmStep: React.FC<Props> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onPublish,
  loading,
}) => (
  <div className="max-w-md mx-auto space-y-4">
    <p className="text-sm text-muted-foreground">
      Enter your email manually. Optionally add a password to create an account and manage this listing later.
    </p>
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        autoComplete="off"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="pw">Password (optional)</Label>
      <Input
        id="pw"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="••••••••"
      />
    </div>
    <Button
      type="button"
      className="w-full bg-orange text-orange-foreground hover:bg-orange/90 py-6"
      disabled={loading}
      onClick={onPublish}
    >
      {loading ? "Publishing…" : "Publish listing"}
    </Button>
  </div>
)

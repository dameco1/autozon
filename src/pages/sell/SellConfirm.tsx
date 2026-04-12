import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import SEO from "@/components/SEO"
import { EmailConfirmStep } from "@/components/sell/EmailConfirmStep"
import { useSellFlowStore } from "@/store/sellFlow"
import { publishListing, linkListingToUser, saveListingPatch } from "@/lib/api/sell"
import { supabase } from "@/integrations/supabase/client"
import { analytics } from "@/lib/analytics"
import { toast } from "sonner"

const SellConfirm: React.FC = () => {
  const navigate = useNavigate()
  const { listingId, sessionToken, listingDraft, setEmail, setPublished, setStep, email: storedEmail } =
    useSellFlowStore()
  const [email, setEmailLocal] = useState(storedEmail || "")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const onPublish = async () => {
    if (!listingId || !sessionToken) {
      toast.error("Session missing")
      return
    }
    if (!email.includes("@")) {
      toast.error("Enter a valid email")
      return
    }
    setLoading(true)
    try {
      await saveListingPatch(listingId, sessionToken, {
        ...listingDraft,
        price: listingDraft.price,
        year: listingDraft.year,
        mileage: listingDraft.mileage,
        title: listingDraft.title,
        description: listingDraft.description,
        make: listingDraft.make,
        model: listingDraft.model,
        colour: listingDraft.colour,
        fuel_type: listingDraft.fuel_type,
        gearbox: listingDraft.gearbox,
        condition: listingDraft.condition,
        location: listingDraft.location,
        photos: listingDraft.photos,
        email_contact: email,
      } as Record<string, unknown>)
      setEmail(email)
      analytics.emailEntered()

      let userId: string | null = null
      if (password.length >= 6) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/login` },
        })
        if (error) throw error
        userId = data.user?.id ?? null
        if (userId) await linkListingToUser(listingId, sessionToken, userId)
      } else {
        const { data: sess } = await supabase.auth.getSession()
        userId = sess.session?.user?.id ?? null
        if (userId) await linkListingToUser(listingId, sessionToken, userId)
      }

      const price = Number(listingDraft.price ?? 0)
      await publishListing(listingId, sessionToken, email, userId, price)
      setPublished(listingId)
      setStep("published")
      navigate(`/sell/published/${listingId}`)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Publish failed")
    } finally {
      setLoading(false)
    }
  }

  if (!listingId) return null

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <SEO title="Confirm email" description="Confirm your email to publish your listing." path="/sell/confirm" />
      <h1 className="text-2xl font-display font-bold text-center mb-6">Almost there</h1>
      <EmailConfirmStep
        email={email}
        password={password}
        onEmailChange={(v) => {
          setEmailLocal(v)
          setEmail(v)
        }}
        onPasswordChange={setPassword}
        onPublish={() => void onPublish()}
        loading={loading}
      />
    </div>
  )
}

export default SellConfirm

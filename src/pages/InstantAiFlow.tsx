import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import SEO from "@/components/SEO"
import { ValuationCard } from "@/components/sell/ValuationCard"
import { ListingEditor } from "@/components/sell/ListingEditor"
import { EmailConfirmStep } from "@/components/sell/EmailConfirmStep"
import { Button } from "@/components/ui/button"
import { loadListing, saveListingPatch, publishListing, linkListingToUser } from "@/lib/api/sell"
import { readInstantDraftRef } from "@/lib/instantAiFlow"
import { useSellFlowStore } from "@/store/sellFlow"
import type { ListingDraft } from "@/types/listing"
import type { Database } from "@/integrations/supabase/types"
import { supabase } from "@/integrations/supabase/client"
import { analytics } from "@/lib/analytics"
import { toast } from "sonner"

type ListingRow = Database["public"]["Tables"]["listings"]["Row"]

function rowToDraft(row: Record<string, unknown>): ListingDraft {
  return {
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    price: row.price != null ? Number(row.price) : undefined,
    year: row.year != null ? Number(row.year) : undefined,
    mileage: row.mileage != null ? Number(row.mileage) : undefined,
    make: (row.make as string) ?? "",
    model: (row.model as string) ?? "",
    colour: (row.colour as string) ?? "",
    fuel_type: (row.fuel_type as string) ?? "",
    gearbox: (row.gearbox as string) ?? "",
    condition: (row.condition as string) ?? "",
    location: (row.location as string) ?? "",
    photos: (row.photos as string[]) ?? [],
    valuation_low: row.valuation_low != null ? Number(row.valuation_low) : undefined,
    valuation_mid: row.valuation_mid != null ? Number(row.valuation_mid) : undefined,
    valuation_high: row.valuation_high != null ? Number(row.valuation_high) : undefined,
  }
}

const InstantAiFlow: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setSession, updateListingDraft, setEmail, setPublished, setStep } = useSellFlowStore()

  const [listingId, setListingId] = useState<string | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [row, setRow] = useState<ListingRow | null>(null)
  const [draft, setDraft] = useState<ListingDraft>({})
  const [email, setEmailLocal] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [bootError, setBootError] = useState<string | null>(null)

  useEffect(() => {
    const draftId = searchParams.get("draftId")
    const key = searchParams.get("key")
    const ref = draftId && key ? { draftId, key } : readInstantDraftRef()
    if (!ref) {
      setBootError("Missing draft. Start again from the homepage.")
      return
    }
    setListingId(ref.draftId)
    setSessionToken(ref.key)
    setSession(ref.draftId, ref.key)

    const run = async () => {
      const data = await loadListing(ref.draftId, ref.key)
      if (!data) {
        setBootError("Could not load this draft. It may have expired.")
        return
      }
      setRow(data as ListingRow)
      const d = rowToDraft(data as unknown as Record<string, unknown>)
      setDraft(d)
      updateListingDraft(d)
    }
    void run()
  }, [searchParams, setSession, updateListingDraft])

  const onDraftChange = (patch: Partial<ListingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }))
    analytics.listingEdited(Object.keys(patch))
  }

  const onSaveEdits = async () => {
    if (!listingId || !sessionToken) return
    setLoading(true)
    try {
      await saveListingPatch(listingId, sessionToken, {
        ...draft,
        photos: draft.photos,
      } as Record<string, unknown>)
      updateListingDraft(draft)
      toast.success("Saved")
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed")
    } finally {
      setLoading(false)
    }
  }

  const onPublish = async () => {
    if (!listingId || !sessionToken) return
    if (!email.includes("@")) {
      toast.error("Enter a valid email")
      return
    }
    setLoading(true)
    try {
      await saveListingPatch(listingId, sessionToken, {
        ...draft,
        photos: draft.photos,
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

      const price = Number(draft.price ?? 0)
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

  if (bootError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <SEO title="Draft unavailable" path="/instant-ai-flow" />
        <p className="text-muted-foreground mb-4">{bootError}</p>
        <Button asChild className="bg-orange text-orange-foreground">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    )
  }

  if (!row) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SEO title="AI listing" path="/instant-ai-flow" />
        <p className="text-muted-foreground">Loading your listing…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-2xl mx-auto space-y-10">
      <SEO
        title="Review AI listing"
        description="Edit your AI-generated listing and publish when ready."
        path="/instant-ai-flow"
      />
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Your AI listing</h1>
        <p className="text-muted-foreground mt-1">Review valuation, edit details, then publish with your email.</p>
      </div>

      <ValuationCard
        listing={row}
        continueLabel="Edit listing below"
        onContinue={() => document.getElementById("instant-edit")?.scrollIntoView({ behavior: "smooth" })}
      />

      <section id="instant-edit" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold">Description & details</h2>
        <ListingEditor value={draft} onChange={onDraftChange} />
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={loading}
          onClick={() => void onSaveEdits()}
        >
          Save edits
        </Button>
      </section>

      <section className="border-t border-border pt-8 space-y-4">
        <h2 className="text-lg font-semibold">Publish</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email manually. Optionally add a password to create an account and manage this listing.
        </p>
        <EmailConfirmStep
          email={email}
          password={password}
          onEmailChange={setEmailLocal}
          onPasswordChange={setPassword}
          onPublish={() => void onPublish()}
          loading={loading}
        />
      </section>
    </div>
  )
}

export default InstantAiFlow

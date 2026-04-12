import React, { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Upload, ArrowRight, Heart, X } from "lucide-react"
import CookieConsent from "@/components/CookieConsent"
import ConciergeChat from "@/components/ConciergeChat"
import SEO from "@/components/SEO"
import { OnboardingModal } from "@/components/homepage/OnboardingModal"
import { Button } from "@/components/ui/button"
import { analytics } from "@/lib/analytics"
import { startInstantAIFlow } from "@/lib/instantAiFlow"
import { validateFiles } from "@/lib/utils/validateFiles"
import { toast } from "sonner"

/**
 * Lovable-style AI-first homepage: hero + drag-drop (touch-friendly on mobile via tap + capture).
 */
const Index: React.FC = () => {
  const navigate = useNavigate()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    analytics.homepageViewed()
  }, [])

  const runFlow = useCallback(
    (files: File[]) => {
      const v = validateFiles(files)
      if (!v.ok) {
        toast.error(v.error)
        return
      }
      void startInstantAIFlow(files, navigate)
    },
    [navigate],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length) runFlow(files)
    },
    [runFlow],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        runFlow(Array.from(e.target.files))
        e.target.value = ""
      }
    },
    [runFlow],
  )

  return (
    <div className="min-h-screen bg-background">
      <SEO
        path="/"
        description="Sell your car in minutes with AI. Swipe to discover your next car."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Autozon",
          url: "https://autozon.lovable.app",
          description: "AI-powered fair value car marketplace.",
        }}
      />
      <OnboardingModal />

      {/* Hero + drop zone */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-[64px] font-display font-black text-foreground leading-[1.08] tracking-tight text-center max-w-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sell Your Car in 60&nbsp;Seconds.
          <br />
          <span className="text-orange">No Account Needed.</span>
        </motion.h1>
        <motion.p
          className="mt-4 text-lg sm:text-xl text-muted-foreground text-center max-w-lg font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          Drop photos — we run OCR &amp; valuation (placeholders), then you review on the next screen.
        </motion.p>

        <motion.div
          className={`mt-10 w-full max-w-xl min-h-[200px] sm:min-h-[240px] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 touch-manipulation px-4 py-10 border-2 border-dashed ${
            isDragging ? "border-orange bg-orange/5 scale-[1.01]" : "border-border hover:border-orange/40 bg-muted/20"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click()
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
        >
          <Upload className="h-10 w-10 text-orange shrink-0" aria-hidden />
          <p className="mt-4 text-sm text-center text-muted-foreground max-w-sm">
            Drag &amp; drop car photos here, or tap to choose files / camera.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/80 sm:hidden">On mobile, use gallery or camera.</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/heic,image/heif,application/pdf"
            capture="environment"
            className="hidden"
            onChange={handleFileSelect}
          />
        </motion.div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center">
          <Button
            asChild
            variant="outline"
            className="rounded-full px-6"
            onClick={() => analytics.buyCtaClicked()}
          >
            <Link to="/tinder">Browse cars (swipe)</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => analytics.sellCtaClicked()}
          >
            <Link to="/sell">Advanced sell wizard</Link>
          </Button>
        </div>
      </section>

      {/* Tinder teaser */}
      <section className="py-20 px-4 border-t border-border bg-muted/15">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground">
            Browse Cars Like <span className="text-orange">Tinder</span>
          </h2>
          <p className="mt-3 text-muted-foreground">Swipe right to like, left to skip — sample cars from our database.</p>
          <div className="relative mt-12 mx-auto w-72 h-56 sm:h-64">
            {[2, 1, 0].map((i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-end p-6"
                style={{
                  zIndex: 3 - i,
                  transform: `translateY(${i * -6}px) scale(${1 - i * 0.03})`,
                  opacity: 1 - i * 0.12,
                }}
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {["BMW 320d", "Audi A4", "Mercedes C200"][i]}
                </p>
                <p className="text-xl font-display font-bold text-foreground mt-1">
                  {["€24,500", "€28,900", "€31,200"][i]}
                </p>
                {i === 0 && (
                  <div className="flex gap-4 mt-4 justify-center">
                    <span className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
                      <X className="h-5 w-5 text-destructive" />
                    </span>
                    <span className="w-12 h-12 rounded-full border border-orange flex items-center justify-center bg-orange/10">
                      <Heart className="h-5 w-5 text-orange" />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button asChild className="mt-10 bg-orange text-orange-foreground hover:bg-orange/90 rounded-full px-8 py-6">
            <Link to="/tinder">
              Start browsing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <p id="how-it-works" className="sr-only">
        How it works
      </p>

      <CookieConsent />
      <ConciergeChat />
    </div>
  )
}

export default Index

import React from "react"
import { Link, useParams } from "react-router-dom"
import SEO from "@/components/SEO"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

const SellPublished: React.FC = () => {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <SEO title="Listing published" description="Your listing is live." path="/sell/published" />
      <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
      <h1 className="text-2xl font-display font-bold mb-2">Listing published</h1>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Your listing reference: <span className="font-mono text-foreground">{id}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/buy">
          <Button variant="outline">Browse cars</Button>
        </Link>
        <Link to="/dashboard">
          <Button className="bg-orange text-orange-foreground">Go to dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export default SellPublished

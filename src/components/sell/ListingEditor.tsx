import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ListingDraft } from "@/types/listing"

type Props = {
  value: ListingDraft
  onChange: (patch: Partial<ListingDraft>) => void
}

export const ListingEditor: React.FC<Props> = ({ value, onChange }) => {
  const field = (key: keyof ListingDraft, label: string, type: string = "text") => {
    const v = value[key]
    const str =
      type === "number"
        ? v === undefined || v === null
          ? ""
          : String(v)
        : ((v as string | undefined) ?? "")
    return (
      <div className="space-y-1.5">
        <Label htmlFor={String(key)}>{label}</Label>
        <Input
          id={String(key)}
          type={type}
          value={str}
          onChange={(e) => {
            if (type === "number") {
              const raw = e.target.value
              onChange({ [key]: raw === "" ? undefined : Number(raw) } as Partial<ListingDraft>)
            } else {
              onChange({ [key]: e.target.value } as Partial<ListingDraft>)
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      {field("title", "Title")}
      {field("make", "Make")}
      {field("model", "Model")}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("year", "Year", "number")}
        {field("mileage", "Mileage (km)", "number")}
      </div>
      {field("price", "Asking price (€)", "number")}
      {field("colour", "Colour")}
      {field("fuel_type", "Fuel")}
      {field("gearbox", "Gearbox")}
      {field("condition", "Condition")}
      <div className="space-y-1.5">
        <Label htmlFor="desc">Description</Label>
        <Textarea
          id="desc"
          rows={6}
          value={value.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>
    </div>
  )
}

import React, { useRef, useState } from "react"
import { Upload, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { validateFiles } from "@/lib/utils/validateFiles"

type Props = {
  photos: File[]
  onPhotosChange: (files: File[]) => void
  disabled?: boolean
}

export const UploadZone: React.FC<Props> = ({ photos, onPhotosChange, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [hint, setHint] = useState<string | null>(null)

  const addFiles = (list: FileList | File[]) => {
    const arr = Array.from(list)
    const merged = [...photos, ...arr]
    const v = validateFiles(merged)
    if (!v.ok) {
      setHint(v.error)
      return
    }
    setHint(null)
    onPhotosChange(merged)
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
        }}
        className={cn(
          "relative w-full min-h-[min(280px,50vh)] rounded-2xl border-2 border-dashed transition-colors",
          "flex flex-col items-center justify-center gap-3 px-4 py-8 text-center touch-manipulation",
          "min-h-[12rem] sm:min-h-[280px]",
          dragOver ? "border-orange bg-orange/5" : "border-border bg-muted/30",
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        <Upload className="h-10 w-10 text-orange shrink-0" aria-hidden />
        <div>
          <p className="font-semibold text-foreground">Drop photos here or tap to browse</p>
          <p className="text-sm text-muted-foreground mt-1">JPG, PNG, HEIC, PDF · max 10MB each</p>
          <p className="text-xs text-muted-foreground mt-2 md:hidden flex items-center justify-center gap-1">
            <Camera className="h-3.5 w-3.5" /> On mobile, use the camera or gallery.
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,application/pdf"
          multiple
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </button>
      {hint && <p className="text-sm text-destructive">{hint}</p>}
      {photos.length > 0 && (
        <p className="text-sm text-muted-foreground">{photos.length} file(s) selected</p>
      )}
    </div>
  )
}

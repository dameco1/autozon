import React, { useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ImagePlus, X, Loader2, Camera, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { PHOTO_SLOTS, MAX_EXTRA_PHOTOS, type PhotoMap } from "./photoSlots";

const SLOT_TOOLTIPS: Record<string, string> = {
  front: "Straight-on front view showing grille, headlights & bumper",
  rear: "Straight-on rear view showing taillights & bumper",
  left: "Full driver-side profile, capture the entire length",
  right: "Full passenger-side profile, capture the entire length",
  interior_front: "Front cabin view: steering wheel, dashboard & seats",
  interior_rear: "Rear seat area showing legroom & condition",
  dashboard: "Close-up of instrument cluster & infotainment screen",
};

interface Props {
  photoSlots: PhotoMap;
  extraPhotos: string[];
  userId: string | null;
  onSlotsChange: (slots: PhotoMap) => void;
  onExtrasChange: (extras: string[]) => void;
}

const StepPhotos: React.FC<Props> = ({ photoSlots, extraPhotos, userId, onSlotsChange, onExtrasChange }) => {
  const { t } = useLanguage();
  const slotInputRef = useRef<HTMLInputElement>(null);
  const extraInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<string | null>(null); // slot id or "extra"
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const compressFile = async (file: File): Promise<File> => {
    // High quality to preserve defect visibility; cap at 2048px and 1.5MB
    const options = {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      initialQuality: 0.88,
      preserveExif: true,
    };
    try {
      return await imageCompression(file, options);
    } catch {
      return file; // fallback to original if compression fails
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!userId) return null;
    const ext = file.name.split(".").pop() || "jpg";
    const compressed = await compressFile(file);
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const uploadBlob = new File([compressed], `photo.${ext}`, { type: compressed.type || file.type });
    const { error } = await supabase.storage.from("car-images").upload(path, uploadBlob, {
      upsert: false,
      contentType: uploadBlob.type || "image/jpeg",
    });
    if (error) { toast.error(error.message); return null; }
    const { data: urlData } = supabase.storage.from("car-images").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const removeFromStorage = async (url: string) => {
    const bucketUrl = supabase.storage.from("car-images").getPublicUrl("").data.publicUrl;
    const path = url.replace(bucketUrl, "");
    await supabase.storage.from("car-images").remove([path]);
  };

  const handleSlotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlot) return;
    setUploading(activeSlot);
    // Remove old photo if replacing
    if (photoSlots[activeSlot]) await removeFromStorage(photoSlots[activeSlot]);
    const url = await uploadFile(file);
    if (url) onSlotsChange({ ...photoSlots, [activeSlot]: url });
    setUploading(null);
    setActiveSlot(null);
    if (slotInputRef.current) slotInputRef.current.value = "";
  };

  const handleExtraUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = MAX_EXTRA_PHOTOS - extraPhotos.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) { toast.error(t.carUpload.photos.maxReached); return; }
    setUploading("extra");
    const newUrls: string[] = [];
    for (const file of toUpload) {
      const url = await uploadFile(file);
      if (url) newUrls.push(url);
    }
    onExtrasChange([...extraPhotos, ...newUrls]);
    setUploading(null);
    if (extraInputRef.current) extraInputRef.current.value = "";
  };

  const removeSlot = async (slotId: string) => {
    if (photoSlots[slotId]) await removeFromStorage(photoSlots[slotId]);
    const updated = { ...photoSlots };
    delete updated[slotId];
    onSlotsChange(updated);
  };

  const removeExtra = async (url: string) => {
    await removeFromStorage(url);
    onExtrasChange(extraPhotos.filter((p) => p !== url));
  };

  const slotLabels = (t.carUpload.photos as any).slots as Record<string, string>;
  const requiredSlots = PHOTO_SLOTS.filter((s) => s.required);
  const filledRequired = requiredSlots.filter((s) => photoSlots[s.id]).length;

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-silver/80 text-sm">{t.carUpload.photos.title}</Label>
        <p className="text-silver/40 text-xs mt-1">
          {t.carUpload.photos.hint} ({filledRequired}/{requiredSlots.length} {(t.carUpload.photos as any).required?.toLowerCase?.() || "required"})
        </p>
      </div>

      {/* Required photo slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {PHOTO_SLOTS.map((slot) => {
          const url = photoSlots[slot.id];
          const isUploading = uploading === slot.id;
          return (
            <div key={slot.id} className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-silver/70 flex items-center gap-1">
                {slotLabels[slot.id] || slot.id}
                {slot.required && !url && (
                  <span className="text-destructive text-[10px]">*</span>
                )}
                {url && <CheckCircle2 className="h-3 w-3 text-primary" />}
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-silver/40 cursor-help shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-xs">
                      {SLOT_TOOLTIPS[slot.id] || "Upload a clear photo"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <div className={`relative group aspect-[4/3] rounded-xl overflow-hidden bg-charcoal/50 ${slot.required ? 'border border-border' : 'border-2 border-dashed border-border/60'}`}>
                {url ? (
                  <>
                    <img src={url} alt={slotLabels[slot.id]} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeSlot(slot.id)}
                      className="absolute top-1.5 right-1.5 bg-destructive/90 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    {/* Tap to replace */}
                    <button
                      type="button"
                      onClick={() => { setActiveSlot(slot.id); slotInputRef.current?.click(); }}
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Camera className="h-5 w-5 text-white" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setActiveSlot(slot.id); slotInputRef.current?.click(); }}
                    disabled={isUploading}
                    className="w-full h-full flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    ) : (
                      <>
                        <Camera className="h-6 w-6 text-silver/30" />
                        <span className="text-[10px] text-silver/30">{(t.carUpload.photos as any).tapToUpload}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra photos */}
      <div className="space-y-2">
        <Label className="text-silver/60 text-xs">{(t.carUpload.photos as any).extraPhotos} ({extraPhotos.length}/{MAX_EXTRA_PHOTOS})</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {extraPhotos.map((url) => (
            <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-charcoal/50">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeExtra(url)}
                className="absolute top-1.5 right-1.5 bg-destructive/90 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {extraPhotos.length < MAX_EXTRA_PHOTOS && (
            <button
              type="button"
              onClick={() => extraInputRef.current?.click()}
              disabled={uploading === "extra"}
              className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-charcoal/30 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              {uploading === "extra" ? (
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              ) : (
                <>
                  <ImagePlus className="h-6 w-6 text-silver/40" />
                  <span className="text-xs text-silver/40">{t.carUpload.photos.add}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <input ref={slotInputRef} type="file" accept="image/*" className="hidden" onChange={handleSlotUpload} />
      <input ref={extraInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleExtraUpload} />
    </div>
  );
};

export default StepPhotos;

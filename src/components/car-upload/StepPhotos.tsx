import React, { useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  photos: string[];
  userId: string | null;
  onPhotosChange: (photos: string[]) => void;
}

const MAX_PHOTOS = 10;

const StepPhotos: React.FC<Props> = ({ photos, userId, onPhotosChange }) => {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !userId) return;

    const remaining = MAX_PHOTOS - photos.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) {
      toast.error(t.carUpload.photos.maxReached);
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of toUpload) {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("car-images")
        .upload(path, file, { upsert: false });

      if (error) {
        toast.error(error.message);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("car-images")
        .getPublicUrl(path);

      newUrls.push(urlData.publicUrl);
    }

    onPhotosChange([...photos, ...newUrls]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removePhoto = async (url: string) => {
    // Extract path from URL for deletion
    const bucketUrl = supabase.storage.from("car-images").getPublicUrl("").data.publicUrl;
    const path = url.replace(bucketUrl, "");

    await supabase.storage.from("car-images").remove([path]);
    onPhotosChange(photos.filter((p) => p !== url));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-silver/80 text-sm">{t.carUpload.photos.title}</Label>
        <p className="text-silver/40 text-xs mt-1">
          {t.carUpload.photos.hint} ({photos.length}/{MAX_PHOTOS})
        </p>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {photos.map((url) => (
          <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-charcoal/50">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(url)}
              className="absolute top-1.5 right-1.5 bg-destructive/90 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-charcoal/30 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
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

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />

      {photos.length === 0 && (
        <p className="text-silver/30 text-xs text-center py-2">
          {t.carUpload.photos.empty}
        </p>
      )}
    </div>
  );
};

export default StepPhotos;

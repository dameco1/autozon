import React, { useState } from "react";
import { ShieldCheck, Camera, FileText, AlertTriangle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  onAccept: () => void;
}

const AppraisalDisclaimer: React.FC<Props> = ({ onAccept }) => {
  const [confirmed, setConfirmed] = useState(false);
  const { t } = useLanguage();
  const d = t.disclaimer;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Scale className="h-7 w-7 text-primary" />
        <h2 className="text-2xl font-display font-bold text-foreground">{d.title}</h2>
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed">
        {d.intro.split("<bold>").map((part, i) => {
          if (i === 0) return part;
          const [bold, rest] = part.split("</bold>");
          return <React.Fragment key={i}><span className="text-foreground font-semibold">{bold}</span>{rest}</React.Fragment>;
        })}
      </p>

      <div className="space-y-4">
        <div className="flex gap-3">
          <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-foreground font-semibold text-sm">{d.accurateInfo}</h3>
            <p className="text-muted-foreground text-xs mt-1">{d.accurateInfoDesc}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Camera className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-foreground font-semibold text-sm">{d.honestPhotos}</h3>
            <p className="text-muted-foreground text-xs mt-1">{d.honestPhotosDesc}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-foreground font-semibold text-sm">{d.howAppraisal}</h3>
            <p className="text-muted-foreground text-xs mt-1">{d.howAppraisalDesc}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="text-foreground font-semibold text-sm">{d.responsibility}</h3>
            <p className="text-muted-foreground text-xs mt-1">{d.responsibilityDesc}</p>
          </div>
        </div>
      </div>

      <div className="bg-red-600 border border-red-500 rounded-xl p-4 mt-2">
        <p className="text-sm text-foreground font-bold leading-relaxed">{d.driveableWarning}</p>
      </div>

      <div className="flex items-start gap-3 mt-2">
        <Checkbox
          id="driveable-confirm"
          checked={confirmed}
          onCheckedChange={(checked) => setConfirmed(checked === true)}
          className="mt-0.5"
        />
        <label htmlFor="driveable-confirm" className="text-sm text-foreground cursor-pointer leading-relaxed">
          {d.driveableConfirm}
        </label>
      </div>

      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mt-2">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <span className="text-destructive font-semibold uppercase text-[10px] tracking-wider">{d.legalDisclaimer} </span>
          {d.legalText}
        </p>
      </div>

      <Button
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        onClick={onAccept}
        disabled={!confirmed}
      >
        {d.acceptButton}
      </Button>
    </div>
  );
};

export default AppraisalDisclaimer;

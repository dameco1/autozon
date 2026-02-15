import React, { useState } from "react";
import { ShieldCheck, Camera, FileText, AlertTriangle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  onAccept: () => void;
}

const AppraisalDisclaimer: React.FC<Props> = ({ onAccept }) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Scale className="h-7 w-7 text-primary" />
        <h2 className="text-2xl font-display font-bold text-white">Before You Begin</h2>
      </div>

      <p className="text-silver text-sm leading-relaxed">
        Autozon provides a <span className="text-white font-semibold">fair-value appraisal</span> based on the data and images you provide. Please read the following carefully before proceeding.
      </p>

      <div className="space-y-4">
        <div className="flex gap-3">
          <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-semibold text-sm">Provide accurate information</h3>
            <p className="text-silver/70 text-xs mt-1">
              Enter correct vehicle details — make, model, year, mileage, VIN, and condition. The accuracy of your appraisal depends entirely on the data you provide.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Camera className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-semibold text-sm">Upload clear, honest photos</h3>
            <p className="text-silver/70 text-xs mt-1">
              Photos are used for AI-powered damage detection and condition assessment. Upload recent, well-lit images showing all angles including any existing damage.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-semibold text-sm">How appraisal works</h3>
            <p className="text-silver/70 text-xs mt-1">
              Our AI engine analyzes your data, photos, equipment, and market conditions to calculate a fair market value. The appraisal is an estimate based on available information — not a guarantee of sale price.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-semibold text-sm">Your responsibility</h3>
            <p className="text-silver/70 text-xs mt-1">
              You are solely responsible for the accuracy and truthfulness of all information and images submitted. Falsified or misleading data may result in inaccurate valuations that could harm potential buyers.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-red-600 border border-red-500 rounded-xl p-4 mt-2">
        <p className="text-sm text-white font-bold leading-relaxed">
          ⚠️ We do not allow placement of vehicles that are not driveable — including cars with broken engines, failed transmissions, total damage (write-offs), flood damage, or any condition rendering the vehicle inoperable. Only driveable vehicles in functioning condition may be listed on autozon.
        </p>
      </div>

      <div className="flex items-start gap-3 mt-2">
        <Checkbox
          id="driveable-confirm"
          checked={confirmed}
          onCheckedChange={(checked) => setConfirmed(checked === true)}
          className="mt-0.5"
        />
        <label htmlFor="driveable-confirm" className="text-sm text-white cursor-pointer leading-relaxed">
          I confirm that my vehicle is in driveable condition with a functioning engine and transmission.
        </label>
      </div>

      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mt-2">
        <p className="text-[11px] text-silver/60 leading-relaxed">
          <span className="text-destructive font-semibold uppercase text-[10px] tracking-wider">Legal disclaimer: </span>
          Autozon is not responsible for any losses, damages, or legal consequences arising from falsified, manipulated, or intentionally misleading data, images, or documentation provided by the seller. Submitting false information — including but not limited to odometer fraud, concealed damage, fabricated service history, or altered photographs — constitutes a violation of applicable consumer protection and fraud laws. In the event that falsified data causes financial hardship to a buyer, the seller may be subject to civil liability and criminal prosecution under the laws of the applicable jurisdiction. By proceeding, you confirm that all information and images you provide are truthful, accurate, and complete to the best of your knowledge.
        </p>
      </div>

      <Button
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        onClick={onAccept}
        disabled={!confirmed}
      >
        I understand — begin appraisal
      </Button>
    </div>
  );
};

export default AppraisalDisclaimer;

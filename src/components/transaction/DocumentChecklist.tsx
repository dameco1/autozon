import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, CheckCircle2, Circle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import type { DocumentRequirement } from "@/lib/roleWorkflow";

interface DocRecord {
  id: string;
  document_type: string;
  label: string;
  required: boolean;
  uploaded_url: string | null;
  uploaded_at: string | null;
  verified: boolean;
  uploader_role: string;
}

interface Props {
  transactionId: string;
  documents: DocumentRequirement[];
  role: "buyer" | "seller";
}

const DocumentChecklist: React.FC<Props> = ({ transactionId, documents, role }) => {
  const { language } = useLanguage();
  const [docs, setDocs] = useState<DocRecord[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocs();
  }, [transactionId]);

  const loadDocs = async () => {
    const { data } = await supabase
      .from("transaction_documents")
      .select("*")
      .eq("transaction_id", transactionId);
    if (data) setDocs(data as DocRecord[]);
    setLoading(false);
  };

  // Seed document requirements if they don't exist
  useEffect(() => {
    if (loading || docs.length > 0) return;
    const seed = async () => {
      const rows = documents.map((d) => ({
        transaction_id: transactionId,
        document_type: d.document_type,
        label: language === "de" ? d.label_de : d.label,
        required: d.required,
        uploader_role: d.uploader_role,
      }));
      if (rows.length > 0) {
        await supabase.from("transaction_documents").insert(rows as any);
        await loadDocs();
      }
    };
    seed();
  }, [loading, docs.length, documents, transactionId, language]);

  const handleUpload = async (docId: string, docType: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setUploading(docId);
      try {
        const filePath = `${transactionId}/${docType}_${Date.now()}.${file.name.split(".").pop()}`;
        const { error: uploadErr } = await supabase.storage
          .from("contracts")
          .upload(filePath, file, { upsert: true });
        if (uploadErr) throw uploadErr;

        await supabase
          .from("transaction_documents")
          .update({ uploaded_url: filePath, uploaded_at: new Date().toISOString() } as any)
          .eq("id", docId);

        toast.success("Document uploaded");
        await loadDocs();
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
      } finally {
        setUploading(null);
      }
    };
    input.click();
  };

  const myDocs = docs.filter((d) => d.uploader_role === role);
  const otherDocs = docs.filter((d) => d.uploader_role !== role);
  const allComplete = myDocs.filter((d) => d.required).every((d) => d.uploaded_url);

  if (loading) {
    return <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  const renderDocRow = (doc: DocRecord, canUpload: boolean) => (
    <div key={doc.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-secondary/30 transition">
      {doc.uploaded_url ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
      ) : doc.required ? (
        <AlertCircle className="h-4 w-4 text-destructive/60 flex-shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{doc.label}</p>
        {doc.uploaded_at && (
          <p className="text-[10px] text-muted-foreground">
            Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
          </p>
        )}
      </div>
      {!doc.required && !doc.uploaded_url && (
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Optional</span>
      )}
      {canUpload && !doc.uploaded_url && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-primary gap-1"
          disabled={uploading === doc.id}
          onClick={() => handleUpload(doc.id, doc.document_type)}
        >
          {uploading === doc.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
          Upload
        </Button>
      )}
      {doc.uploaded_url && doc.verified && (
        <span className="text-[10px] text-emerald-500 font-semibold uppercase">Verified</span>
      )}
    </div>
  );

  return (
    <motion.div
      className="bg-secondary/30 border border-border rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-primary/5 border-b border-border px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="font-display font-bold text-sm text-foreground">
            {language === "de" ? "Dokumenten-Checkliste" : "Document Checklist"}
          </h3>
        </div>
        {allComplete && (
          <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
            Complete
          </span>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* My documents */}
        {myDocs.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {language === "de" ? "Ihre Dokumente" : "Your Documents"}
            </p>
            <div className="space-y-0.5">
              {myDocs.map((d) => renderDocRow(d, true))}
            </div>
          </div>
        )}

        {/* Other party documents */}
        {otherDocs.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {language === "de" ? "Dokumente der Gegenpartei" : "Other Party Documents"}
            </p>
            <div className="space-y-0.5">
              {otherDocs.map((d) => renderDocRow(d, false))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DocumentChecklist;

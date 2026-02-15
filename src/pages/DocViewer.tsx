import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Download, FileSpreadsheet, FileText, Lock, Loader2, AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

/** Detect if a document is "data-heavy" (lots of tables → Excel export) */
const isSpreadsheetDoc = (md: string) => {
  const tableCount = (md.match(/\|.*\|/g) || []).length;
  return tableCount > 30; // heuristic: docs with many table rows
};

/** Convert the rendered HTML into a downloadable .doc (Word) file */
const exportToWord = (html: string, title: string) => {
  const styledHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8">
      <style>
        body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1a1a1a; line-height: 1.6; padding: 20px; }
        h1 { font-size: 22pt; color: #111; border-bottom: 2px solid #e5e5e5; padding-bottom: 8px; margin-top: 24px; }
        h2 { font-size: 16pt; color: #222; border-bottom: 1px solid #eee; padding-bottom: 6px; margin-top: 20px; }
        h3 { font-size: 13pt; color: #333; margin-top: 16px; }
        table { border-collapse: collapse; width: 100%; margin: 12px 0; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; font-size: 10pt; }
        th { background: #f5f5f5; font-weight: 600; }
        code { font-family: Consolas, monospace; background: #f4f4f4; padding: 1px 4px; font-size: 9pt; }
        pre { background: #f4f4f4; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 9pt; }
        blockquote { border-left: 4px solid #e0e0e0; margin: 12px 0; padding: 8px 16px; color: #555; }
        ul, ol { padding-left: 24px; }
        li { margin-bottom: 4px; }
        hr { border: none; border-top: 1px solid #e5e5e5; margin: 20px 0; }
        strong { color: #111; }
      </style>
    </head><body>${html}</body></html>`;
  const blob = new Blob([styledHtml], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
};

/** Extract all tables from HTML and export as CSV */
const exportToExcel = (html: string, title: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const tables = doc.querySelectorAll("table");
  let csv = "";

  tables.forEach((table, idx) => {
    if (idx > 0) csv += "\n\n";
    // Find preceding heading for section label
    let heading = "";
    let prev = table.previousElementSibling;
    while (prev) {
      if (/^H[1-6]$/.test(prev.tagName)) { heading = prev.textContent || ""; break; }
      prev = prev.previousElementSibling;
    }
    if (heading) csv += `"${heading}"\n`;

    table.querySelectorAll("tr").forEach((tr) => {
      const cells: string[] = [];
      tr.querySelectorAll("th, td").forEach((cell) => {
        const text = (cell.textContent || "").replace(/"/g, '""').trim();
        cells.push(`"${text}"`);
      });
      csv += cells.join(",") + "\n";
    });
  });

  const bom = "\uFEFF";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

/* ------------------------------------------------------------------ */
/* Auth gate (reused password logic)                                   */
/* ------------------------------------------------------------------ */

const PasswordGate: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("verify-docs-password", {
        body: { password },
      });
      if (fnError) {
        setError("Something went wrong. Please try again.");
      } else if (data?.error && data?.retryAfterSecs) {
        const mins = Math.ceil(data.retryAfterSecs / 60);
        setError(`Too many attempts. Try again in ${mins} minute${mins > 1 ? "s" : ""}.`);
        setRemainingAttempts(0);
        setLocked(true);
      } else if (!data?.valid) {
        setError("Incorrect password");
        if (typeof data?.remaining === "number") setRemainingAttempts(data.remaining);
      } else {
        onAuth();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardContent className="pt-8 pb-6 px-6">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-display font-bold text-foreground">Investor Data Room</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter the password to access this document</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className={error ? "border-destructive" : ""}
              disabled={locked}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {remainingAttempts !== null && remainingAttempts <= 3 && !locked && (
              <div className={`flex items-center gap-2 text-xs ${remainingAttempts <= 1 ? "text-destructive" : "text-yellow-500"}`}>
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""} remaining</span>
              </div>
            )}
            {locked && (
              <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
                <Lock className="h-3.5 w-3.5" />
                <span>Access temporarily locked. Wait 15 minutes.</span>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading || locked}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying...</> : "Access Document"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Document viewer                                                     */
/* ------------------------------------------------------------------ */

const DocViewer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const fileName = slug?.endsWith(".md") ? slug : `${slug}.md`;
  const title = slug
    ? slug.replace(/\.md$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Document";

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    fetch(`/docs/${fileName}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then((md) => {
        setMarkdown(md);
        const rendered = marked.parse(md, { async: false }) as string;
        setHtml(rendered);
      })
      .catch(() => setError("Document not found."))
      .finally(() => setLoading(false));
  }, [authenticated, fileName]);

  if (!authenticated) {
    return (
      <>
        <SEO title={`${title} — Autozon Data Room`} description="Secure investor data room document" />
        <PasswordGate onAuth={() => setAuthenticated(true)} />
      </>
    );
  }

  const spreadsheet = isSpreadsheetDoc(markdown);

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${title} — Autozon Data Room`} description="Secure investor data room document" />

      {/* Sticky toolbar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="sm" onClick={() => navigate("/docs")} className="shrink-0">
              <ArrowLeft className="h-4 w-4 mr-1" /> Data Room
            </Button>
            <span className="text-sm font-medium text-foreground truncate hidden sm:inline">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToWord(html, title)}
              disabled={loading || !!error}
            >
              <FileText className="h-4 w-4 mr-1.5" /> Word
            </Button>
            {spreadsheet && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToExcel(html, title)}
                disabled={loading || !!error}
              >
                <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Excel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <div className="text-center py-20">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/docs")}>
              Back to Data Room
            </Button>
          </div>
        )}
        {!loading && !error && (
          <article
            ref={contentRef}
            className="doc-viewer prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
};

export default DocViewer;

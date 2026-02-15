import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lock, FileText, Database, Server, Brain, Palette, Shield, Map, BookOpen,
  Loader2, AlertTriangle, Rocket, Users, Building2, BarChart3, Scale,
  Presentation, Globe, Landmark, FolderOpen, CheckCircle2, Clock
} from "lucide-react";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

type DocItem = {
  title: string;
  desc: string;
  icon: React.ElementType;
  file?: string;
  link?: string;
  status: "ready" | "draft" | "planned";
};

type Section = {
  id: string;
  title: string;
  icon: React.ElementType;
  docs: DocItem[];
};

const sections: Section[] = [
  {
    id: "company",
    title: "1.0 — Company & Team",
    icon: Building2,
    docs: [
      { title: "Company Overview", desc: "Mission, vision, market opportunity, and value proposition", icon: Globe, file: "company-overview.md", status: "ready" },
      { title: "Founder Profile", desc: "Damir Buljubasic — 25+ years executive leadership, Oracle, ATOS, fintech", icon: Users, file: "founder-profile.md", status: "ready" },
      { title: "Corporate Structure", desc: "New Vienna GmbH — Austrian incorporation for market launch", icon: Landmark, status: "planned" },
      { title: "Team & Advisors", desc: "Key hires, advisory board, org chart", icon: Users, status: "planned" },
      { title: "Investor Pitch Deck", desc: "21-slide in-app pitch deck with live product demos", icon: Presentation, link: "/pitch", status: "ready" },
    ],
  },
  {
    id: "product",
    title: "2.0 — Product & Technology",
    icon: Server,
    docs: [
      { title: "Architecture Overview", desc: "System design, tech stack, infrastructure, and project structure", icon: Server, file: "architecture.md", status: "ready" },
      { title: "Sitemap & Routes", desc: "All pages, routes, and user flow diagrams", icon: Map, file: "sitemap.md", status: "ready" },
      { title: "Database Schema", desc: "Tables, relationships, RLS policies, and triggers", icon: Database, file: "database-schema.md", status: "ready" },
      { title: "Backend Functions", desc: "Edge functions, AI integrations, Stripe webhooks", icon: Server, file: "backend-functions.md", status: "ready" },
      { title: "Core Business Logic", desc: "Fair value algorithm, matching engine, negotiation", icon: Brain, file: "business-logic.md", status: "ready" },
      { title: "Component Library", desc: "UI components, design system, and i18n", icon: Palette, file: "components.md", status: "ready" },
      { title: "Product Roadmap", desc: "Phase planning, revenue model, geographic expansion", icon: BookOpen, file: "roadmap.md", status: "ready" },
    ],
  },
  {
    id: "financials",
    title: "3.0 — Financials & Metrics",
    icon: BarChart3,
    docs: [
      { title: "Revenue Model", desc: "2.5% success fee + €49 placement fees, unit economics", icon: BarChart3, file: "revenue-model.md", status: "ready" },
      { title: "Financial Projections", desc: "3-year P&L, cash flow, and growth scenarios", icon: BarChart3, status: "planned" },
      { title: "KPI Dashboard", desc: "Key metrics: GMV, take rate, CAC, LTV, conversion rates", icon: BarChart3, status: "planned" },
      { title: "Use of Funds", desc: "Allocation plan for current funding round", icon: Landmark, status: "planned" },
      { title: "Cap Table", desc: "Current ownership structure and equity distribution", icon: Users, status: "planned" },
    ],
  },
  {
    id: "legal",
    title: "4.0 — Legal & Compliance",
    icon: Scale,
    docs: [
      { title: "Privacy Policy", desc: "GDPR-compliant privacy policy for vehicle data", icon: Shield, link: "/privacy", status: "ready" },
      { title: "Terms & Conditions", desc: "Platform terms of service", icon: FileText, link: "/terms", status: "ready" },
      { title: "Cookie Policy", desc: "Cookie usage and consent framework", icon: FileText, link: "/cookies", status: "ready" },
      { title: "Impressum", desc: "Legal entity details and contact information", icon: Landmark, link: "/impressum", status: "ready" },
      { title: "GDPR Compliance", desc: "Data processing agreements, DPO, and data flow maps", icon: Shield, status: "planned" },
      { title: "IP & Trademarks", desc: "Intellectual property portfolio and trademark registrations", icon: Scale, status: "planned" },
    ],
  },
  {
    id: "security",
    title: "5.0 — Security & Admin",
    icon: Shield,
    docs: [
      { title: "Admin Command Center", desc: "RBAC security, admin dashboard, platform monitoring", icon: Shield, file: "admin.md", status: "ready" },
      { title: "Security Architecture", desc: "MFA, RLS policies, JWT auth, rate limiting", icon: Lock, status: "planned" },
      { title: "Brand Book", desc: "Visual identity, logo usage, color system, typography", icon: Palette, link: "/brand", status: "ready" },
    ],
  },
  {
    id: "operations",
    title: "6.0 — Operations & Launch",
    icon: Rocket,
    docs: [
      { title: "Launch Checklist", desc: "Pre-launch tasks: security, domain, payments, QA, go-live", icon: Rocket, file: "launch-checklist.md", status: "ready" },
      { title: "Go-to-Market Strategy", desc: "Launch plan, target markets (AT → DE → DACH → CEE)", icon: Globe, status: "planned" },
      { title: "Competitive Analysis", desc: "Market landscape, positioning, and differentiators", icon: BarChart3, status: "planned" },
      { title: "Partnership Pipeline", desc: "Financing partners, insurance, logistics integrations", icon: Building2, status: "planned" },
    ],
  },
];

const statusConfig = {
  ready: { label: "Ready", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  draft: { label: "Draft", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  planned: { label: "Planned", color: "bg-muted text-muted-foreground border-border" },
};

const Documentation: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
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
        if (typeof data?.remaining === "number") {
          setRemainingAttempts(data.remaining);
        }
      } else {
        setAuthenticated(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalDocs = sections.reduce((sum, s) => sum + s.docs.length, 0);
  const readyDocs = sections.reduce((sum, s) => sum + s.docs.filter(d => d.status === "ready").length, 0);

  const handleDocClick = (doc: DocItem) => {
    if (doc.status === "planned") return;
    if (doc.link) {
      window.open(doc.link, "_blank");
    } else if (doc.file) {
      window.open(`/docs/${doc.file}`, "_blank");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <SEO title="Investor Data Room — Autozon" description="Secure investor data room with technical documentation, financials, and legal documents" />
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-foreground">Investor Data Room</CardTitle>
            <CardDescription>Enter the password to access confidential documents</CardDescription>
          </CardHeader>
          <CardContent>
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
                  <span>{remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""} remaining before lockout</span>
                </div>
              )}
              {locked && (
                <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Access temporarily locked. Wait 15 minutes.</span>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading || locked}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying...</> : "Access Data Room"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Investor Data Room — Autozon" description="Secure investor data room with technical documentation, financials, and legal documents" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-display font-bold text-foreground">
              auto<span className="text-primary">zon</span> — Investor Data Room
            </h1>
          </div>
          <p className="text-muted-foreground mb-4">
            Confidential materials for investors, engineering leadership, and due diligence review.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
              <span>{readyDocs} of {totalDocs} documents ready</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{totalDocs - readyDocs} planned</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.id}>
              <div className="flex items-center gap-2.5 mb-4">
                <section.icon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-display font-semibold text-foreground">{section.title}</h2>
                <Badge variant="outline" className="ml-2 text-xs font-normal">
                  {section.docs.filter(d => d.status === "ready").length}/{section.docs.length}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.docs.map((doc) => {
                  const status = statusConfig[doc.status];
                  const isClickable = doc.status !== "planned";

                  return (
                    <Card
                      key={doc.title}
                      onClick={() => handleDocClick(doc)}
                      className={`border-border transition-colors h-full ${
                        isClickable
                          ? "cursor-pointer hover:border-primary/50 group"
                          : "opacity-50 cursor-default"
                      }`}
                    >
                      <CardContent className="flex items-start gap-3 py-4 px-4">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isClickable ? "bg-primary/10 group-hover:bg-primary/20" : "bg-muted"
                        }`}>
                          <doc.icon className={`h-4 w-4 ${isClickable ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className={`font-medium text-sm truncate ${
                              isClickable ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
                            } transition-colors`}>
                              {doc.title}
                            </h3>
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${status.color}`}>
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{doc.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 p-6 rounded-lg border border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Quick Access</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <a href="/pitch" target="_blank" className="text-primary hover:underline">📊 Investor Pitch Deck</a>
            <a href="/brand" target="_blank" className="text-primary hover:underline">🎨 Brand Book</a>
            <a href="/admin" target="_blank" className="text-primary hover:underline">🛡️ Admin Command Center</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;

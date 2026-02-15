import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, FileText, Database, Server, Brain, Palette, Shield, Map, BookOpen, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

const docs = [
  { title: "Architecture Overview", desc: "System design, tech stack, infrastructure, and project structure", icon: Server, file: "architecture.md" },
  { title: "Sitemap & Routes", desc: "All pages, routes, and user flow diagrams", icon: Map, file: "sitemap.md" },
  { title: "Database Schema", desc: "Tables, relationships, RLS policies, and triggers", icon: Database, file: "database-schema.md" },
  { title: "Backend Functions", desc: "Edge functions, AI integrations, Stripe webhooks", icon: Server, file: "backend-functions.md" },
  { title: "Core Business Logic", desc: "Fair value algorithm, matching engine, negotiation", icon: Brain, file: "business-logic.md" },
  { title: "Component Library", desc: "UI components, design system, and i18n", icon: Palette, file: "components.md" },
  { title: "Admin Command Center", desc: "RBAC security, admin dashboard, platform monitoring", icon: Shield, file: "admin.md" },
  { title: "Product Roadmap", desc: "Phase planning, revenue model, geographic expansion", icon: BookOpen, file: "roadmap.md" },
];

const Documentation: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("verify-docs-password", {
        body: { password },
      });
      if (fnError || !data?.valid) {
        setError(true);
      } else {
        setAuthenticated(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <SEO title="Documentation — Autozon" description="Technical documentation for investors and developers" />
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-foreground">Documentation Access</CardTitle>
            <CardDescription>Enter the password to view technical documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-sm text-destructive">Incorrect password</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying...</> : "Access Documentation"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Documentation — Autozon" description="Technical documentation for investors and developers" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            auto<span className="text-primary">zon</span> — Technical Documentation
          </h1>
          <p className="text-muted-foreground">
            For investors, engineering leadership, and onboarding developers. Everything you need to understand, evaluate, and extend the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <a
              key={doc.file}
              href={`https://github.com/${""}`}
              onClick={(e) => {
                e.preventDefault();
                window.open(`/docs/${doc.file}`, "_blank");
              }}
              className="block"
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-colors h-full cursor-pointer group">
                <CardContent className="flex items-start gap-4 py-5 px-5">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <doc.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{doc.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-lg border border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Quick Links</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <a href="/pitch" className="text-primary hover:underline">📊 Investor Pitch Deck</a>
            <a href="/brand" className="text-primary hover:underline">🎨 Brand Book</a>
            <a href="/admin" className="text-primary hover:underline">🛡️ Admin Command Center</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;

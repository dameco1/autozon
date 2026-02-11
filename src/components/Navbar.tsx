import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";

const Navbar: React.FC = () => {
  const { t, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-display font-bold text-white tracking-tight">
              auto<span className="text-primary">zon</span>
            </span>
            <span className="text-[10px] text-silver/50 tracking-widest uppercase leading-none">{t.nav.tagline}</span>
            <span className="text-[10px] text-silver/40 italic leading-none mt-0.5">{t.nav.amazonTagline}</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-silver/80 hover:text-primary transition-colors">
              {t.nav.howItWorks}
            </a>
            <a href="#why-autozon" className="text-sm text-silver/80 hover:text-primary transition-colors">
              {t.nav.whyAutozon}
            </a>
            <button onClick={toggleLanguage} className="text-sm text-silver/80 hover:text-primary transition-colors flex items-center gap-1">
              <Globe className="h-4 w-4" />
              {t.nav.language}
            </button>
            {user ? (
              <>
                <Button variant="ghost" className="text-silver/80" onClick={() => navigate("/dashboard")}>
                  {t.nav.dashboard}
                </Button>
                <Button variant="ghost" className="text-silver/80" onClick={handleLogout}>
                  {t.nav.logout}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-silver/80" onClick={() => navigate("/login")}>
                  {t.nav.login}
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={() => navigate("/signup")}>
                  {t.nav.getStarted}
                </Button>
              </>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-silver">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-charcoal border-t border-border px-4 py-4 space-y-3">
          <a href="#how-it-works" className="block text-sm text-silver/80 hover:text-primary" onClick={() => setMenuOpen(false)}>
            {t.nav.howItWorks}
          </a>
          <a href="#why-autozon" className="block text-sm text-silver/80 hover:text-primary" onClick={() => setMenuOpen(false)}>
            {t.nav.whyAutozon}
          </a>
          <button onClick={() => { toggleLanguage(); setMenuOpen(false); }} className="block text-sm text-silver/80 hover:text-primary">
            <Globe className="h-4 w-4 inline mr-1" />{t.nav.language}
          </button>
          {user ? (
            <>
              <Button variant="ghost" className="w-full justify-start text-silver/80" onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}>
                {t.nav.dashboard}
              </Button>
              <Button variant="ghost" className="w-full justify-start text-silver/80" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                {t.nav.logout}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="w-full justify-start text-silver/80" onClick={() => { navigate("/login"); setMenuOpen(false); }}>
                {t.nav.login}
              </Button>
              <Button className="w-full bg-primary text-primary-foreground" onClick={() => { navigate("/signup"); setMenuOpen(false); }}>
                {t.nav.getStarted}
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

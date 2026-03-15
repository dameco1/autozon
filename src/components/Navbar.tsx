import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Shield } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { useIsAdmin } from "@/hooks/useAdminAuth";
import type { User } from "@supabase/supabase-js";

const Navbar: React.FC = () => {
  const { t, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = useIsAdmin();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className={`text-2xl font-display font-bold tracking-tight transition-colors ${scrolled ? "text-navy" : "text-white"}`}>
              auto<span className="text-orange">zon</span>
            </span>
            <span className={`text-[10px] tracking-widest uppercase leading-none transition-colors ${scrolled ? "text-navy/40" : "text-silver/50"}`}>{t.nav.tagline}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/car-selection" className={`text-sm font-medium transition-colors ${scrolled ? "text-navy/70 hover:text-orange" : "text-silver/80 hover:text-orange"}`}>
              {t.nav.buyCar}
            </Link>
            <Link to="/intent" className={`text-sm font-medium transition-colors ${scrolled ? "text-navy/70 hover:text-orange" : "text-silver/80 hover:text-orange"}`}>
              {t.nav.sellCar}
            </Link>
            <a href="#how-it-works" className={`text-sm font-medium transition-colors ${scrolled ? "text-navy/70 hover:text-orange" : "text-silver/80 hover:text-orange"}`}>
              {t.nav.howItWorks}
            </a>
            <Link to="/qa" className={`text-sm font-medium transition-colors ${scrolled ? "text-navy/70 hover:text-orange" : "text-silver/80 hover:text-orange"}`}>
              Q&A
            </Link>
            <button onClick={toggleLanguage} className={`text-sm font-medium transition-colors flex items-center gap-1 ${scrolled ? "text-navy/70 hover:text-orange" : "text-silver/80 hover:text-orange"}`}>
              <Globe className="h-4 w-4" />
              {t.nav.language}
            </button>
            {user ? (
              <>
                <NotificationBell />
                {isAdmin && (
                  <Button variant="ghost" className={`${scrolled ? "text-navy/70" : "text-silver/80"}`} onClick={() => navigate("/admin")}>
                    <Shield className="h-4 w-4 mr-1" />Admin
                  </Button>
                )}
                <Button variant="ghost" className={`${scrolled ? "text-navy/70" : "text-silver/80"}`} onClick={() => navigate("/dashboard")}>
                  {t.nav.dashboard}
                </Button>
                <Button variant="ghost" className={`${scrolled ? "text-navy/70" : "text-silver/80"}`} onClick={handleLogout}>
                  {t.nav.logout}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className={`${scrolled ? "text-navy/70" : "text-silver/80"}`} onClick={() => navigate("/login")}>
                  {t.nav.login}
                </Button>
                <Button className="bg-orange text-orange-foreground hover:bg-orange/90 font-bold rounded-full px-5" onClick={() => navigate("/intent")}>
                  {t.nav.getStarted}
                </Button>
              </>
            )}
          </div>

          {/* Mobile: CTA + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Button size="sm" className="bg-orange text-orange-foreground hover:bg-orange/90 font-bold rounded-full text-xs px-3" onClick={() => navigate("/intent")}>
              {t.nav.getStarted}
            </Button>
            <button onClick={() => setMenuOpen(!menuOpen)} className={`${scrolled ? "text-navy" : "text-silver"}`}>
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-3">
          <Link to="/car-selection" className="block text-sm text-navy/80 hover:text-orange" onClick={() => setMenuOpen(false)}>
            {t.nav.buyCar}
          </Link>
          <Link to="/intent" className="block text-sm text-navy/80 hover:text-orange" onClick={() => setMenuOpen(false)}>
            {t.nav.sellCar}
          </Link>
          <a href="#how-it-works" className="block text-sm text-navy/80 hover:text-orange" onClick={() => setMenuOpen(false)}>
            {t.nav.howItWorks}
          </a>
          <Link to="/qa" className="block text-sm text-navy/80 hover:text-orange" onClick={() => setMenuOpen(false)}>
            Q&A
          </Link>
          <button onClick={() => { toggleLanguage(); setMenuOpen(false); }} className="block text-sm text-navy/80 hover:text-orange">
            <Globe className="h-4 w-4 inline mr-1" />{t.nav.language}
          </button>
          {user ? (
            <>
              {isAdmin && (
                <Button variant="ghost" className="w-full justify-start text-navy/80" onClick={() => { navigate("/admin"); setMenuOpen(false); }}>
                  <Shield className="h-4 w-4 mr-1" />Admin
                </Button>
              )}
              <Button variant="ghost" className="w-full justify-start text-navy/80" onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}>
                {t.nav.dashboard}
              </Button>
              <Button variant="ghost" className="w-full justify-start text-navy/80" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                {t.nav.logout}
              </Button>
            </>
          ) : (
            <Button variant="ghost" className="w-full justify-start text-navy/80" onClick={() => { navigate("/login"); setMenuOpen(false); }}>
              {t.nav.login}
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

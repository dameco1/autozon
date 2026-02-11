import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import ConciergeChat from "@/components/ConciergeChat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Car, TrendingUp, Users, DollarSign, Plus, Eye, Edit,
  ArrowRight, BarChart3, Clock, CheckCircle2, AlertCircle,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

type CarListing = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  fair_value_price: number | null;
  status: string;
  image_url: string | null;
  condition_score: number | null;
  demand_score: number | null;
  created_at: string;
};

type MatchData = {
  id: string;
  car_id: string;
  match_score: number;
  status: string;
  created_at: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [cars, setCars] = useState<CarListing[]>([]);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/login");
        return;
      }
      setUser(session.user);

      const [carsResult, matchesResult] = await Promise.all([
        supabase.from("cars").select("id, make, model, year, price, fair_value_price, status, image_url, condition_score, demand_score, created_at").eq("owner_id", session.user.id).order("created_at", { ascending: false }),
        supabase.from("matches").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
      ]);

      if (carsResult.data) setCars(carsResult.data);
      if (matchesResult.data) setMatches(matchesResult.data);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const totalValue = cars.reduce((sum, c) => sum + (c.fair_value_price || c.price || 0), 0);
  const avgCondition = cars.length > 0
    ? Math.round(cars.reduce((sum, c) => sum + (c.condition_score || 0), 0) / cars.length)
    : 0;
  const activeMatches = matches.filter((m) => m.status === "pending").length;

  const stats = [
    { label: "Listed Cars", value: cars.length, icon: Car, color: "text-primary" },
    { label: "Total Portfolio Value", value: `€${totalValue.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Active Matches", value: activeMatches, icon: Users, color: "text-amber-400" },
    { label: "Avg Condition", value: `${avgCondition}%`, icon: TrendingUp, color: "text-emerald-400" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal text-silver">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-silver">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8"
          initial="hidden" animate="visible" variants={fadeUp} custom={0}
        >
          <div>
            <h1 className="text-3xl font-display font-black text-white">Dashboard</h1>
            <p className="text-silver/50 text-sm mt-1">Manage your cars, track valuations, and monitor matches</p>
          </div>
          <Button
            className="mt-4 sm:mt-0 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            onClick={() => navigate("/car-upload")}
          >
            <Plus className="h-4 w-4 mr-2" /> List a Car
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i + 1}>
              <Card className="bg-secondary/50 border-border p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-charcoal/50 flex items-center justify-center">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-silver/50">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Cars */}
          <motion.div className="lg:col-span-2" initial="hidden" animate="visible" variants={fadeUp} custom={5}>
            <Card className="bg-secondary/50 border-border">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" /> My Cars
                </h2>
                <Button variant="ghost" size="sm" className="text-primary text-xs" onClick={() => navigate("/car-upload")}>
                  + Add New
                </Button>
              </div>

              {cars.length === 0 ? (
                <div className="p-8 text-center">
                  <Car className="h-12 w-12 text-silver/20 mx-auto mb-3" />
                  <p className="text-silver/50 text-sm mb-4">No cars listed yet. Start by uploading your first car!</p>
                  <Button className="bg-primary text-primary-foreground" onClick={() => navigate("/car-upload")}>
                    <Plus className="h-4 w-4 mr-2" /> Upload Your Car
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {cars.map((car) => (
                    <div key={car.id} className="flex items-center gap-4 px-6 py-4 hover:bg-charcoal/20 transition-colors">
                      <div className="w-16 h-12 rounded-lg bg-charcoal/50 overflow-hidden shrink-0">
                        {car.image_url ? (
                          <img src={car.image_url} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Car className="h-5 w-5 text-silver/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {car.year} {car.make} {car.model}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-primary font-semibold">
                            €{(car.fair_value_price || car.price).toLocaleString()}
                          </span>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                            car.status === "available"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-silver/10 text-silver/50"
                          }`}>
                            {car.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-silver/50" onClick={() => navigate(`/fair-value/${car.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-silver/50" onClick={() => navigate(`/buyer-matches/${car.id}`)}>
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Matches */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
              <Card className="bg-secondary/50 border-border">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-amber-400" /> Recent Matches
                  </h2>
                </div>
                {matches.length === 0 ? (
                  <p className="p-6 text-sm text-silver/50 text-center">No matches yet. List a car to get matched!</p>
                ) : (
                  <div className="divide-y divide-border">
                    {matches.slice(0, 5).map((match) => (
                      <div key={match.id} className="px-6 py-3 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              match.match_score >= 85 ? "bg-emerald-400" : match.match_score >= 70 ? "bg-amber-400" : "bg-silver/30"
                            }`} />
                            <span className="text-sm text-white font-semibold">{match.match_score}% match</span>
                          </div>
                          <p className="text-[10px] text-silver/40 mt-0.5">
                            {new Date(match.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                          match.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                          match.status === "accepted" ? "bg-emerald-500/10 text-emerald-400" :
                          "bg-silver/10 text-silver/50"
                        }`}>
                          {match.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
              <Card className="bg-secondary/50 border-border p-6">
                <h2 className="text-lg font-display font-bold text-white mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-silver/70 hover:text-white"
                    onClick={() => navigate("/car-upload")}
                  >
                    <Plus className="h-4 w-4 mr-3 text-primary" /> Upload a car
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-silver/70 hover:text-white"
                    onClick={() => navigate("/intent")}
                  >
                    <Car className="h-4 w-4 mr-3 text-primary" /> Buy or Sell
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-silver/70 hover:text-white"
                    onClick={() => navigate("/recommendations")}
                  >
                    <BarChart3 className="h-4 w-4 mr-3 text-primary" /> My Recommendations
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <ConciergeChat />
    </div>
  );
};

export default Dashboard;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, Handshake, CreditCard, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const StatCard = ({ title, value, icon: Icon, sub }: { title: string; value: string | number; icon: React.ElementType; sub?: string }) => (
  <Card className="bg-card border-border">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </CardContent>
  </Card>
);

const AdminOverview: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [profiles, cars, offers, placements] = await Promise.all([
        supabase.from("profiles").select("created_at", { count: "exact" }),
        supabase.from("cars").select("id", { count: "exact" }),
        supabase.from("offers").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("cars").select("id", { count: "exact" }).eq("placement_paid", true),
      ]);

      // signups per day last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data: recentProfiles } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", sevenDaysAgo.toISOString());

      const dailySignups: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dailySignups[d.toISOString().slice(0, 10)] = 0;
      }
      recentProfiles?.forEach((p) => {
        const day = p.created_at.slice(0, 10);
        if (dailySignups[day] !== undefined) dailySignups[day]++;
      });

      const chartData = Object.entries(dailySignups).map(([date, count]) => ({
        date: date.slice(5),
        signups: count,
      }));

      return {
        users: profiles.count ?? 0,
        cars: cars.count ?? 0,
        activeNegotiations: offers.count ?? 0,
        placements: placements.count ?? 0,
        recent7d: recentProfiles?.length ?? 0,
        chartData,
      };
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.users ?? "—"} icon={Users} />
        <StatCard title="Total Cars" value={stats?.cars ?? "—"} icon={Car} />
        <StatCard title="Active Negotiations" value={stats?.activeNegotiations ?? "—"} icon={Handshake} />
        <StatCard title="Paid Placements" value={stats?.placements ?? "—"} icon={CreditCard} />
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">New Signups (Last 7 Days): {stats?.recent7d ?? 0}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData ?? []}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
                <Area type="monotone" dataKey="signups" stroke="hsl(var(--primary))" fill="url(#colorSignups)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;

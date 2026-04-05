import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Car, Handshake, Receipt, TrendingUp } from "lucide-react";

const AdminReports: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const [usersRes, carsRes, offersRes, txRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("cars").select("id", { count: "exact", head: true }),
        supabase.from("offers").select("id, status", { count: "exact" }),
        supabase.from("transactions").select("id, status, agreed_price"),
      ]);

      const totalUsers = usersRes.count ?? 0;
      const totalCars = carsRes.count ?? 0;
      const offers = offersRes.data ?? [];
      const transactions = txRes.data ?? [];

      const acceptedOffers = offers.filter(o => o.status === "accepted").length;
      const completedTx = transactions.filter(t => t.status === "completed");
      const totalRevenue = completedTx.reduce((sum, t) => sum + Number(t.agreed_price || 0), 0);
      const avgDealValue = completedTx.length > 0 ? totalRevenue / completedTx.length : 0;

      return {
        totalUsers,
        totalCars,
        totalOffers: offers.length,
        acceptedOffers,
        totalTransactions: transactions.length,
        completedTransactions: completedTx.length,
        totalRevenue,
        avgDealValue,
        conversionRate: offers.length > 0 ? ((acceptedOffers / offers.length) * 100).toFixed(1) : "0",
      };
    },
  });

  if (isLoading) return <div className="text-muted-foreground text-center py-8">Loading reports…</div>;

  const cards = [
    { icon: Users, label: "Total Users", value: stats?.totalUsers ?? 0, color: "text-blue-400" },
    { icon: Car, label: "Total Cars", value: stats?.totalCars ?? 0, color: "text-emerald-400" },
    { icon: Handshake, label: "Total Negotiations", value: stats?.totalOffers ?? 0, color: "text-amber-400" },
    { icon: Handshake, label: "Accepted Offers", value: stats?.acceptedOffers ?? 0, color: "text-primary" },
    { icon: Receipt, label: "Transactions", value: stats?.totalTransactions ?? 0, color: "text-purple-400" },
    { icon: Receipt, label: "Completed", value: stats?.completedTransactions ?? 0, color: "text-emerald-400" },
    { icon: TrendingUp, label: "Total GMV", value: `€${(stats?.totalRevenue ?? 0).toLocaleString()}`, color: "text-primary" },
    { icon: BarChart3, label: "Avg Deal Value", value: `€${Math.round(stats?.avgDealValue ?? 0).toLocaleString()}`, color: "text-blue-400" },
    { icon: TrendingUp, label: "Conversion Rate", value: `${stats?.conversionRate}%`, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-display font-bold text-foreground">Platform Reports</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="bg-secondary/50 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <c.icon className={`h-4 w-4 ${c.color}`} />
                {c.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-display font-bold text-foreground">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;

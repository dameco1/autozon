import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

const AdminInsuranceRequests: React.FC = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["admin-insurance-requests"],
    queryFn: async () => {
      // Get transactions that have reached the insurance step (step >= 4)
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .gte("current_step", 4)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const carIds = [...new Set(data.map(t => t.car_id))];
      const userIds = [...new Set(data.flatMap(t => [t.buyer_id, t.seller_id]))];
      const partnerIds = data.map(t => t.insurance_partner_id).filter(Boolean) as string[];

      const [carsRes, profilesRes, partnersRes] = await Promise.all([
        carIds.length > 0 ? supabase.from("cars").select("id, make, model, year").in("id", carIds) : { data: [] },
        userIds.length > 0 ? supabase.from("profiles").select("user_id, full_name").in("user_id", userIds) : { data: [] },
        partnerIds.length > 0 ? supabase.from("financing_partners").select("id, name").in("id", partnerIds) : { data: [] },
      ]);

      const carsMap: Record<string, any> = {};
      (carsRes.data || []).forEach((c: any) => { carsMap[c.id] = c; });
      const profilesMap: Record<string, string> = {};
      (profilesRes.data || []).forEach((p: any) => { profilesMap[p.user_id] = p.full_name; });
      const partnersMap: Record<string, string> = {};
      (partnersRes.data || []).forEach((p: any) => { partnersMap[p.id] = p.name; });

      return data.map(t => ({
        ...t,
        car_label: carsMap[t.car_id] ? `${carsMap[t.car_id].year} ${carsMap[t.car_id].make} ${carsMap[t.car_id].model}` : t.car_id.slice(0, 8),
        buyer_name: profilesMap[t.buyer_id] || t.buyer_id.slice(0, 8),
        insurance_partner_name: t.insurance_partner_id ? (partnersMap[t.insurance_partner_id] || "—") : "—",
      }));
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Insurance Tier</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Confirmed</TableHead>
              <TableHead className="text-right">Agreed Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {transactions?.map(tx => (
              <TableRow key={tx.id}>
                <TableCell className="text-xs font-medium">{tx.car_label}</TableCell>
                <TableCell className="text-xs">{tx.buyer_name}</TableCell>
                <TableCell><Badge variant="outline" className="text-xs capitalize">{tx.insurance_tier || "—"}</Badge></TableCell>
                <TableCell className="text-xs">{tx.insurance_partner_name}</TableCell>
                <TableCell>
                  {tx.insurance_confirmed
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    : <XCircle className="h-4 w-4 text-muted-foreground" />
                  }
                </TableCell>
                <TableCell className="text-right text-xs font-semibold">€{Number(tx.agreed_price).toLocaleString()}</TableCell>
                <TableCell><Badge variant={tx.status === "completed" ? "default" : "secondary"}>{tx.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {transactions?.length === 0 && !isLoading && (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">No insurance requests</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminInsuranceRequests;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AdminFinancingRequests: React.FC = () => {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ["admin-financing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("acquisition_quotes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const userIds = [...new Set(data.map(q => q.user_id))];
      const partnerIds = [...new Set(data.map(q => q.partner_id))];

      const [profilesRes, partnersRes] = await Promise.all([
        userIds.length > 0 ? supabase.from("profiles").select("user_id, full_name").in("user_id", userIds) : { data: [] },
        partnerIds.length > 0 ? supabase.from("financing_partners").select("id, name").in("id", partnerIds) : { data: [] },
      ]);

      const profilesMap: Record<string, string> = {};
      (profilesRes.data || []).forEach((p: any) => { profilesMap[p.user_id] = p.full_name; });
      const partnersMap: Record<string, string> = {};
      (partnersRes.data || []).forEach((p: any) => { partnersMap[p.id] = p.name; });

      return data.map(q => ({
        ...q,
        user_name: profilesMap[q.user_id] || q.user_id.slice(0, 8),
        partner_name: partnersMap[q.partner_id] || q.partner_id.slice(0, 8),
      }));
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Down Payment</TableHead>
              <TableHead>Term</TableHead>
              <TableHead className="text-right">Monthly</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead>Selected</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {quotes?.map(q => (
              <TableRow key={q.id}>
                <TableCell className="text-xs font-medium">{q.user_name}</TableCell>
                <TableCell className="text-xs">{q.partner_name}</TableCell>
                <TableCell><Badge variant="outline" className="text-xs capitalize">{q.quote_type}</Badge></TableCell>
                <TableCell className="text-right text-xs font-semibold">€{Number(q.agreed_price).toLocaleString()}</TableCell>
                <TableCell className="text-right text-xs">€{Number(q.down_payment || 0).toLocaleString()}</TableCell>
                <TableCell className="text-xs">{q.term_months}m</TableCell>
                <TableCell className="text-right text-xs">€{Number(q.monthly_payment || 0).toLocaleString()}</TableCell>
                <TableCell className="text-right text-xs">{q.interest_rate ? `${q.interest_rate}%` : "—"}</TableCell>
                <TableCell>{q.selected ? <Badge>Selected</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {quotes?.length === 0 && !isLoading && (
              <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground">No financing requests</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminFinancingRequests;

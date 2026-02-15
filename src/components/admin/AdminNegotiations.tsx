import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AdminNegotiations: React.FC = () => {
  const { data: offers, isLoading } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("id, amount, counter_amount, agreed_price, current_round, max_rounds, status, created_at, car_id, buyer_id, seller_id")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const statusVariant = (s: string) => {
    if (s === "accepted") return "default";
    if (s === "rejected") return "destructive";
    return "secondary";
  };

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Offer</TableHead>
            <TableHead>Counter</TableHead>
            <TableHead>Agreed</TableHead>
            <TableHead>Round</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
          )}
          {offers?.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium">€{o.amount?.toLocaleString()}</TableCell>
              <TableCell>{o.counter_amount ? `€${o.counter_amount.toLocaleString()}` : "—"}</TableCell>
              <TableCell>{o.agreed_price ? `€${o.agreed_price.toLocaleString()}` : "—"}</TableCell>
              <TableCell>{o.current_round}/{o.max_rounds}</TableCell>
              <TableCell><Badge variant={statusVariant(o.status)}>{o.status}</Badge></TableCell>
              <TableCell className="text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
          {offers?.length === 0 && !isLoading && (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No negotiations</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminNegotiations;

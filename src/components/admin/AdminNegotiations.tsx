import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, StopCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const AdminNegotiations: React.FC = () => {
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
    if (s === "accepted") return "default" as const;
    if (s === "rejected" || s === "stopped") return "destructive" as const;
    return "secondary" as const;
  };

  const handleStop = async (offerId: string) => {
    setActionLoading(offerId);
    try {
      const { error } = await supabase
        .from("offers")
        .update({ status: "stopped" })
        .eq("id", offerId);
      if (error) throw error;
      toast.success("Negotiation stopped");
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to stop negotiation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReset = async (offerId: string) => {
    setActionLoading(offerId);
    try {
      const { error } = await supabase
        .from("offers")
        .update({ status: "pending", current_round: 1, counter_amount: null, agreed_price: null })
        .eq("id", offerId);
      if (error) throw error;
      toast.success("Negotiation reset to round 1");
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to reset negotiation");
    } finally {
      setActionLoading(null);
    }
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
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
          )}
          {offers?.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium">€{o.amount?.toLocaleString()}</TableCell>
              <TableCell>{o.counter_amount ? `€${o.counter_amount.toLocaleString()}` : "—"}</TableCell>
              <TableCell>{o.agreed_price ? `€${o.agreed_price.toLocaleString()}` : "—"}</TableCell>
              <TableCell>{o.current_round}/{o.max_rounds}</TableCell>
              <TableCell><Badge variant={statusVariant(o.status)}>{o.status}</Badge></TableCell>
              <TableCell className="text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={actionLoading === o.id}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {o.status !== "stopped" && o.status !== "accepted" && o.status !== "rejected" && (
                      <DropdownMenuItem onClick={() => handleStop(o.id)} className="text-destructive">
                        <StopCircle className="h-4 w-4 mr-2" /> Stop Negotiation
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleReset(o.id)}>
                      <RotateCcw className="h-4 w-4 mr-2" /> Reset Negotiation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {offers?.length === 0 && !isLoading && (
            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No negotiations</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminNegotiations;

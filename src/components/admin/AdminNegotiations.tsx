import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreHorizontal, StopCircle, RotateCcw, Eye, ArrowRight,
  CheckCircle2, XCircle, ShieldAlert, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface RoundRow {
  id: string;
  offer_id: string;
  round_number: number;
  actor_id: string;
  actor_role: string;
  action: string;
  amount: number;
  message: string | null;
  created_at: string;
}

const AdminNegotiations: React.FC = () => {
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data: offers, isLoading } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("id, amount, counter_amount, agreed_price, current_round, max_rounds, status, created_at, updated_at, car_id, buyer_id, seller_id")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Live polling every 10s
  });

  const { data: rounds } = useQuery({
    queryKey: ["admin-negotiation-rounds", selectedOffer],
    queryFn: async () => {
      if (!selectedOffer) return [];
      const { data, error } = await supabase
        .from("negotiation_rounds" as any)
        .select("*")
        .eq("offer_id", selectedOffer)
        .order("round_number", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as RoundRow[];
    },
    enabled: !!selectedOffer,
  });

  // Fetch inline rounds for expanded rows
  const { data: allRounds } = useQuery({
    queryKey: ["admin-all-rounds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("negotiation_rounds" as any)
        .select("*")
        .order("round_number", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as RoundRow[];
    },
  });

  // Fetch profiles for name lookup
  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles-lookup"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name");
      if (error) throw error;
      return data as { user_id: string; full_name: string }[];
    },
  });

  // Fetch car info for display
  const { data: cars } = useQuery({
    queryKey: ["admin-cars-lookup"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("id, make, model, year");
      if (error) throw error;
      return data as { id: string; make: string; model: string; year: number }[];
    },
  });

  const getName = (userId: string) => {
    const p = profiles?.find(pr => pr.user_id === userId);
    return p?.full_name || userId.slice(0, 8);
  };

  const getCarLabel = (carId: string) => {
    const c = cars?.find(car => car.id === carId);
    return c ? `${c.year} ${c.make} ${c.model}` : carId.slice(0, 8);
  };

  const statusVariant = (s: string) => {
    if (s === "accepted") return "default" as const;
    if (s === "rejected" || s === "stopped" || s === "cancelled") return "destructive" as const;
    return "secondary" as const;
  };

  const handleCancel = async (offerId: string) => {
    setActionLoading(offerId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Log audit round
      await supabase.from("negotiation_rounds" as any).insert({
        offer_id: offerId,
        round_number: 0,
        actor_id: session.user.id,
        actor_role: "admin",
        action: "admin_cancel",
        amount: 0,
        message: "Negotiation cancelled by admin",
      } as any);

      const { error } = await supabase
        .from("offers")
        .update({ status: "cancelled" } as any)
        .eq("id", offerId);
      if (error) throw error;

      toast.success("Negotiation cancelled (audit logged)");
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-all-rounds"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to cancel negotiation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestart = async (offerId: string) => {
    setActionLoading(offerId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Get original offer amount
      const offer = offers?.find(o => o.id === offerId);
      if (!offer) throw new Error("Offer not found");

      // Log audit round
      await supabase.from("negotiation_rounds" as any).insert({
        offer_id: offerId,
        round_number: 0,
        actor_id: session.user.id,
        actor_role: "admin",
        action: "admin_restart",
        amount: offer.amount,
        message: "Negotiation restarted by admin",
      } as any);

      const { error } = await supabase
        .from("offers")
        .update({ status: "pending", current_round: 1, counter_amount: null, agreed_price: null } as any)
        .eq("id", offerId);
      if (error) throw error;

      toast.success("Negotiation restarted (audit logged)");
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-all-rounds"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to restart negotiation");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const getRoundsForOffer = (offerId: string) =>
    allRounds?.filter(r => r.offer_id === offerId) ?? [];

  const actionIcon = (action: string) => {
    if (action === "accept") return <CheckCircle2 className="h-3.5 w-3.5 text-primary" />;
    if (action === "reject") return <XCircle className="h-3.5 w-3.5 text-destructive" />;
    if (action === "counter") return <RotateCcw className="h-3.5 w-3.5 text-amber-400" />;
    if (action.startsWith("admin")) return <ShieldAlert className="h-3.5 w-3.5 text-destructive" />;
    return <ArrowRight className="h-3.5 w-3.5 text-primary" />;
  };

  const isActive = (status: string) =>
    status === "pending" || status === "countered";

  return (
    <div className="space-y-4">
      {/* Summary badges */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary" className="text-xs">
          Total: {offers?.length ?? 0}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          Active: {offers?.filter(o => isActive(o.status)).length ?? 0}
        </Badge>
        <Badge variant="default" className="text-xs">
          Accepted: {offers?.filter(o => o.status === "accepted").length ?? 0}
        </Badge>
        <Badge variant="destructive" className="text-xs">
          Rejected/Cancelled: {offers?.filter(o => o.status === "rejected" || o.status === "cancelled" || o.status === "stopped").length ?? 0}
        </Badge>
      </div>

      <div className="rounded-md border border-border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Initial Offer</TableHead>
              <TableHead>Latest</TableHead>
              <TableHead>Round</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {offers?.map((o) => {
              const offerRounds = getRoundsForOffer(o.id);
              const latestRound = offerRounds.length > 0 ? offerRounds[offerRounds.length - 1] : null;
              const latestAmount = latestRound?.amount ?? o.counter_amount ?? o.amount;
              const isExpanded = expandedRows.has(o.id);

              return (
                <React.Fragment key={o.id}>
                  <TableRow className={isActive(o.status) ? "bg-primary/5" : ""}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleExpand(o.id)}
                      >
                        {isExpanded
                          ? <ChevronUp className="h-3.5 w-3.5" />
                          : <ChevronDown className="h-3.5 w-3.5" />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium text-xs">{getCarLabel(o.car_id)}</TableCell>
                    <TableCell className="text-xs">{getName(o.buyer_id)}</TableCell>
                    <TableCell className="text-xs">{getName(o.seller_id)}</TableCell>
                    <TableCell className="font-medium">€{o.amount?.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">€{latestAmount?.toLocaleString()}</TableCell>
                    <TableCell>{o.current_round}/{o.max_rounds}</TableCell>
                    <TableCell><Badge variant={statusVariant(o.status)}>{o.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{new Date(o.updated_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={actionLoading === o.id}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedOffer(o.id)}>
                            <Eye className="h-4 w-4 mr-2" /> View Full Audit Log
                          </DropdownMenuItem>
                          {isActive(o.status) && (
                            <DropdownMenuItem onClick={() => handleCancel(o.id)} className="text-destructive">
                              <StopCircle className="h-4 w-4 mr-2" /> Cancel Negotiation
                            </DropdownMenuItem>
                          )}
                          {(o.status === "cancelled" || o.status === "stopped" || o.status === "rejected") && (
                            <DropdownMenuItem onClick={() => handleRestart(o.id)}>
                              <RotateCcw className="h-4 w-4 mr-2" /> Restart Negotiation
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Inline round history */}
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={10} className="bg-muted/50 px-8 py-3">
                        {offerRounds.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No round history recorded yet</p>
                        ) : (
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold text-foreground mb-2">Round History ({offerRounds.length} actions)</p>
                            {offerRounds.map((r) => (
                              <div key={r.id} className="flex items-center gap-3 text-xs">
                                {actionIcon(r.action)}
                                <span className="font-medium text-foreground w-20">
                                  {r.actor_role === "admin" ? "ADMIN" : r.actor_role === "buyer" ? "Buyer" : "Seller"}
                                </span>
                                <span className="text-muted-foreground w-24">{r.action}</span>
                                <span className="font-semibold text-foreground w-24">
                                  {r.amount > 0 ? `€${r.amount.toLocaleString()}` : "—"}
                                </span>
                                {r.message && (
                                  <span className="text-muted-foreground italic truncate max-w-[200px]">"{r.message}"</span>
                                )}
                                <span className="text-muted-foreground ml-auto">
                                  R{r.round_number} · {new Date(r.created_at).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
            {offers?.length === 0 && !isLoading && (
              <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground">No negotiations</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Full Audit Log Dialog */}
      <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Negotiation Audit Log
            </DialogTitle>
          </DialogHeader>

          {selectedOffer && (() => {
            const offer = offers?.find(o => o.id === selectedOffer);
            if (!offer) return <p className="text-muted-foreground text-sm">Offer not found</p>;

            return (
              <div className="space-y-4">
                {/* Offer summary */}
                <div className="bg-muted rounded-lg p-4 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle</span>
                    <span className="font-semibold text-foreground">{getCarLabel(offer.car_id)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buyer</span>
                    <span className="text-foreground">{getName(offer.buyer_id)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seller</span>
                    <span className="text-foreground">{getName(offer.seller_id)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={statusVariant(offer.status)}>{offer.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Offer ID</span>
                    <span className="text-foreground font-mono text-xs">{offer.id}</span>
                  </div>
                </div>

                {/* Round-by-round log */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Actions ({rounds?.length ?? 0})</h4>
                  {(!rounds || rounds.length === 0) && (
                    <p className="text-xs text-muted-foreground">No round history recorded</p>
                  )}
                  {rounds?.map((r) => (
                    <div
                      key={r.id}
                      className={`rounded-lg border border-border p-3 text-sm ${
                        r.action.startsWith("admin") ? "bg-destructive/5 border-destructive/20" :
                        r.action === "accept" ? "bg-primary/5" :
                        r.action === "reject" ? "bg-destructive/5" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {actionIcon(r.action)}
                          <span className="font-semibold text-foreground">
                            {r.actor_role === "admin" ? "ADMIN" : getName(r.actor_id)}
                          </span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {r.actor_role}
                          </Badge>
                          <span className="text-muted-foreground">{r.action.replace("_", " ")}</span>
                        </div>
                        <span className="font-bold text-foreground">
                          {r.amount > 0 ? `€${r.amount.toLocaleString()}` : "—"}
                        </span>
                      </div>
                      {r.message && (
                        <p className="text-muted-foreground italic text-xs ml-6">"{r.message}"</p>
                      )}
                      <p className="text-[10px] text-muted-foreground ml-6 mt-1">
                        Round {r.round_number} · {new Date(r.created_at).toLocaleString()} · ID: {r.id.slice(0, 8)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNegotiations;

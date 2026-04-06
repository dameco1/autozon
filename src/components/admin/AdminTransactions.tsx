import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Receipt, Send, CheckCircle2, XCircle, Clock, Search, ExternalLink, Loader2, AlertTriangle, Ban } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const statusBadge = (status: string) => {
  switch (status) {
    case "completed": return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Completed</Badge>;
    case "initiated": return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Initiated</Badge>;
    case "in_progress": return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">In Progress</Badge>;
    case "grace_period": return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse">⚠️ Grace Period</Badge>;
    case "cancellation_pending": return <Badge className="bg-destructive/10 text-destructive border-destructive/20 animate-pulse">🚨 Cancel Pending</Badge>;
    case "not_completed": return <Badge variant="destructive">Not Completed</Badge>;
    case "cancelled": return <Badge variant="destructive">Cancelled</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

const stepLabel = (step: number) => {
  const labels: Record<number, string> = { 1: "Method", 2: "Contract", 3: "Payment", 4: "Insurance", 5: "Complete" };
  return labels[step] || `Step ${step}`;
};

const AdminTransactions: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sendingInvoice, setSendingInvoice] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch car info and buyer/seller profiles
      const carIds = [...new Set(data.map(t => t.car_id))];
      const userIds = [...new Set(data.flatMap(t => [t.buyer_id, t.seller_id]))];

      const [carsRes, profilesRes] = await Promise.all([
        carIds.length > 0 ? supabase.from("cars").select("id, make, model, year").in("id", carIds) : { data: [] },
        userIds.length > 0 ? supabase.from("profiles").select("user_id, full_name").in("user_id", userIds) : { data: [] },
      ]);

      const carsMap: Record<string, any> = {};
      (carsRes.data || []).forEach((c: any) => { carsMap[c.id] = c; });

      const profilesMap: Record<string, string> = {};
      (profilesRes.data || []).forEach((p: any) => { profilesMap[p.user_id] = p.full_name; });

      return data.map(t => ({
        ...t,
        car_label: carsMap[t.car_id] ? `${carsMap[t.car_id].year} ${carsMap[t.car_id].make} ${carsMap[t.car_id].model}` : t.car_id.slice(0, 8),
        buyer_name: profilesMap[t.buyer_id] || t.buyer_id.slice(0, 8),
        seller_name: profilesMap[t.seller_id] || t.seller_id.slice(0, 8),
      }));
    },
  });

  const handleResendInvoice = async (transactionId: string, buyerId: string) => {
    setSendingInvoice(transactionId);
    try {
      const { data, error } = await supabase.functions.invoke("admin-actions", {
        body: { action: "resend_invoice", transaction_id: transactionId, target_user_id: buyerId },
      });
      if (error || data?.error) throw new Error(data?.error || "Failed to resend invoice");
      toast.success(data?.message || "Invoice resent successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to resend invoice");
    } finally {
      setSendingInvoice(null);
    }
  };

  const handleCancelTransaction = async (transactionId: string) => {
    if (!confirm("Are you sure you want to cancel this transaction? This will refund the buyer (minus half of Stripe fees for card payments), relist the car, and mark the transaction as Not Completed.")) return;
    setCancelling(transactionId);
    try {
      const { data, error } = await supabase.functions.invoke("admin-actions", {
        body: { action: "cancel_transaction", transaction_id: transactionId },
      });
      if (error || data?.error) throw new Error(data?.error || "Failed to cancel transaction");
      const refundMsg = data?.refund
        ? ` Refund of €${(data.refund.refunded_amount / 100).toFixed(2)} processed.`
        : "";
      toast.success(`Transaction cancelled.${refundMsg}`);
      queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to cancel transaction");
    } finally {
      setCancelling(null);
    }
  };

  const filtered = transactions?.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.car_label.toLowerCase().includes(q) ||
      t.buyer_name.toLowerCase().includes(q) ||
      t.seller_name.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by car, buyer, seller, status…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead className="text-right">Agreed Price</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Step</TableHead>
              <TableHead>Contract</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Insurance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={12} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {filtered?.map(tx => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium text-xs">{tx.car_label}</TableCell>
                <TableCell className="text-xs">{tx.buyer_name}</TableCell>
                <TableCell className="text-xs">{tx.seller_name}</TableCell>
                <TableCell className="text-right font-semibold text-xs">€{Number(tx.agreed_price).toLocaleString()}</TableCell>
                <TableCell className="text-xs">{tx.completion_method || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{stepLabel(tx.current_step)}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-xs">
                    {tx.contract_signed_buyer && tx.contract_signed_seller ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : tx.contract_signed_buyer || tx.contract_signed_seller ? (
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className="text-muted-foreground">
                      {tx.contract_type?.toUpperCase() || "—"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {tx.payment_confirmed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell>
                  {tx.insurance_confirmed ? (
                    <div className="flex items-center gap-1 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-muted-foreground capitalize">{tx.insurance_tier || ""}</span>
                    </div>
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell>{statusBadge(tx.status)}</TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                  {new Date(tx.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="View car"
                      onClick={() => window.open(`/car/${tx.car_id}`, "_blank")}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="Resend invoice to buyer"
                      disabled={sendingInvoice === tx.id}
                      onClick={() => handleResendInvoice(tx.id, tx.buyer_id)}
                    >
                      {sendingInvoice === tx.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered?.length === 0 && !isLoading && (
              <TableRow><TableCell colSpan={12} className="text-center text-muted-foreground">No transactions</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminTransactions;

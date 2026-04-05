import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Clock, Search, FileText } from "lucide-react";

const AdminContracts: React.FC = () => {
  const [search, setSearch] = useState("");
  const [contractFilter, setContractFilter] = useState("all");

  const { data: contracts, isLoading } = useQuery({
    queryKey: ["admin-contracts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

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

  const getContractStatus = (tx: any) => {
    if (tx.contract_signed_buyer && tx.contract_signed_seller) return "signed";
    if (tx.contract_signed_buyer || tx.contract_signed_seller) return "partial";
    if (tx.contract_type) return "draft";
    return "none";
  };

  const filtered = contracts?.filter(tx => {
    const status = getContractStatus(tx);
    const matchesFilter = contractFilter === "all" || status === contractFilter;
    const q = search.toLowerCase();
    const matchesSearch = !search || tx.car_label.toLowerCase().includes(q) ||
      tx.buyer_name.toLowerCase().includes(q) || tx.seller_name.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search contracts…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={contractFilter} onValueChange={setContractFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="signed">Fully Signed</SelectItem>
            <SelectItem value="partial">Partially Signed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="none">No Contract</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Contract Type</TableHead>
              <TableHead>Buyer Signed</TableHead>
              <TableHead>Seller Signed</TableHead>
              <TableHead>Generated</TableHead>
              <TableHead>Agreed Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {filtered?.map(tx => {
              const cs = getContractStatus(tx);
              return (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium text-xs">{tx.car_label}</TableCell>
                  <TableCell className="text-xs">{tx.buyer_name}</TableCell>
                  <TableCell className="text-xs">{tx.seller_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      {tx.contract_type?.toUpperCase() || "—"}
                    </div>
                  </TableCell>
                  <TableCell>{tx.contract_signed_buyer ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}</TableCell>
                  <TableCell>{tx.contract_signed_seller ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{tx.contract_generated_at ? new Date(tx.contract_generated_at).toLocaleDateString() : "—"}</TableCell>
                  <TableCell className="font-semibold text-xs">€{Number(tx.agreed_price).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={cs === "signed" ? "default" : cs === "partial" ? "secondary" : "outline"}>
                      {cs === "signed" ? "Signed" : cs === "partial" ? "Partial" : cs === "draft" ? "Draft" : "None"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered?.length === 0 && !isLoading && (
              <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground">No contracts</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminContracts;

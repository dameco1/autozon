import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import AdminCarCard from "./AdminCarCard";

const AdminCarsTable: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  const { data: cars, isLoading } = useQuery({
    queryKey: ["admin-cars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("id, make, model, year, price, fair_value_price, status, placement_paid, created_at, owner_id, transmission")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteCar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cars").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      toast.success("Car deleted");
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("cars").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      toast.success("Status updated");
    },
  });

  const filtered = cars?.filter((c) => {
    const matchesSearch = `${c.make} ${c.model}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColor = (s: string) => {
    if (s === "available") return "default";
    if (s === "sold") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search make/model…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Fair Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Placement</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {filtered?.map((car) => (
              <TableRow key={car.id}>
                <TableCell>
                  <button
                    className="font-medium text-primary hover:underline cursor-pointer"
                    onClick={() => setSelectedCarId(car.id)}
                  >
                    {car.make} {car.model} ({car.year})
                  </button>
                </TableCell>
                <TableCell>€{car.price?.toLocaleString()}</TableCell>
                <TableCell>€{car.fair_value_price?.toLocaleString() ?? "—"}</TableCell>
                <TableCell>
                  <Select value={car.status} onValueChange={(v) => updateStatus.mutate({ id: car.id, status: v })}>
                    <SelectTrigger className="w-28 h-7 text-xs">
                      <Badge variant={statusColor(car.status)}>{car.status}</Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{car.placement_paid ? "✅" : "—"}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{new Date(car.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedCarId(car.id)} title="View details">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => window.open(`/car/${car.id}`, "_blank")} title="Open public page">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteCar.mutate(car.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered?.length === 0 && !isLoading && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No cars found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AdminCarCard carId={selectedCarId} onClose={() => setSelectedCarId(null)} />
    </div>
  );
};

export default AdminCarsTable;

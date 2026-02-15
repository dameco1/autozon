import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Link } from "lucide-react";
import { toast } from "sonner";

const AdminMatches: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCarId, setSelectedCarId] = useState("");
  const [matchScore, setMatchScore] = useState(80);
  const [creating, setCreating] = useState(false);

  const { data: matches, isLoading } = useQuery({
    queryKey: ["admin-matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("id, user_id, car_id, match_score, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: users } = useQuery({
    queryKey: ["admin-match-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .eq("suspended", false)
        .order("full_name");
      if (error) throw error;
      return data;
    },
  });

  const { data: cars } = useQuery({
    queryKey: ["admin-match-cars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("id, make, model, year, status")
        .eq("status", "available")
        .order("make");
      if (error) throw error;
      return data;
    },
  });

  const handleAssign = async () => {
    if (!selectedUserId || !selectedCarId) {
      toast.error("Select both a user and a car");
      return;
    }
    setCreating(true);
    try {
      const { error } = await supabase.from("matches").insert({
        user_id: selectedUserId,
        car_id: selectedCarId,
        match_score: matchScore,
        status: "admin_assigned",
      });
      if (error) throw error;
      toast.success("Match assigned successfully");
      setSelectedUserId("");
      setSelectedCarId("");
      queryClient.invalidateQueries({ queryKey: ["admin-matches"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to assign match");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (matchId: string) => {
    try {
      const { error } = await supabase.from("matches").delete().eq("id", matchId);
      if (error) throw error;
      toast.success("Match removed");
      queryClient.invalidateQueries({ queryKey: ["admin-matches"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to delete match");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Link className="h-4 w-4 text-primary" />
            Manually Assign Match
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select buyer..." />
              </SelectTrigger>
              <SelectContent>
                {users?.map((u) => (
                  <SelectItem key={u.user_id} value={u.user_id}>
                    {u.full_name || u.user_id.slice(0, 8)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCarId} onValueChange={setSelectedCarId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select car..." />
              </SelectTrigger>
              <SelectContent>
                {cars?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.year} {c.make} {c.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={String(matchScore)} onValueChange={(v) => setMatchScore(Number(v))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Score" />
              </SelectTrigger>
              <SelectContent>
                {[100, 90, 80, 70, 60, 50].map((s) => (
                  <SelectItem key={s} value={String(s)}>{s}%</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleAssign} disabled={creating || !selectedUserId || !selectedCarId}>
              <Plus className="h-4 w-4 mr-1" /> Assign
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Car ID</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {matches?.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-mono text-xs">{m.user_id.slice(0, 8)}…</TableCell>
                <TableCell className="font-mono text-xs">{m.car_id.slice(0, 8)}…</TableCell>
                <TableCell><Badge variant="secondary">{m.match_score}%</Badge></TableCell>
                <TableCell><Badge variant={m.status === "admin_assigned" ? "default" : "secondary"}>{m.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-xs">{new Date(m.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {matches?.length === 0 && !isLoading && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No matches</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminMatches;

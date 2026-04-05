import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Ban, ShieldOff, KeyRound, Search } from "lucide-react";
import { toast } from "sonner";
import AdminUserCard from "./AdminUserCard";

const AdminUsersTable: React.FC = () => {
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, city, country, created_at, suspended, suspension_type, phone")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleSuspend = async (userId: string, suspended: boolean, type: "soft" | "hard") => {
    setActionLoading(userId);
    try {
      const { data, error } = await supabase.functions.invoke("admin-actions", {
        body: { action: "suspend_user", target_user_id: userId, suspended, suspension_type: type },
      });
      if (error || data?.error) throw new Error(data?.error || "Failed");
      toast.success(suspended ? `User ${type === "hard" ? "hard" : "soft"} suspended` : "User unsuspended");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) {
      toast.error(e.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetPassword = async (userId: string) => {
    setActionLoading(userId);
    try {
      const { data, error } = await supabase.functions.invoke("admin-actions", {
        body: { action: "reset_password", target_email: userId },
      });
      if (error || data?.error) throw new Error(data?.error || "Failed");
      toast.success(data?.message || "Reset email sent");
    } catch (e: any) {
      toast.error(e.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users?.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.full_name || "").toLowerCase().includes(q) ||
      (u.city || "").toLowerCase().includes(q) ||
      (u.country || "").toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {filtered?.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <button
                    className="font-medium text-primary hover:underline cursor-pointer"
                    onClick={() => setSelectedUserId(u.user_id)}
                  >
                    {u.full_name || "—"}
                  </button>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{u.phone || "—"}</TableCell>
                <TableCell>{u.city || "—"}</TableCell>
                <TableCell>{u.country || "—"}</TableCell>
                <TableCell>
                  {u.suspended ? (
                    <Badge variant="destructive">
                      {u.suspension_type === "hard" ? "Hard Suspended" : "Soft Suspended"}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Active</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={actionLoading === u.user_id}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!u.suspended ? (
                        <>
                          <DropdownMenuItem onClick={() => handleSuspend(u.user_id, true, "soft")}>
                            <ShieldOff className="h-4 w-4 mr-2" /> Soft Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSuspend(u.user_id, true, "hard")} className="text-destructive">
                            <Ban className="h-4 w-4 mr-2" /> Hard Suspend
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem onClick={() => handleSuspend(u.user_id, false, "soft")}>
                          <ShieldOff className="h-4 w-4 mr-2" /> Unsuspend
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleResetPassword(u.user_id)}>
                        <KeyRound className="h-4 w-4 mr-2" /> Send Password Reset
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered?.length === 0 && !isLoading && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No users</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AdminUserCard userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
    </div>
  );
};

export default AdminUsersTable;

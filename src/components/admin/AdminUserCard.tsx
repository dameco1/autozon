import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User, MapPin, Calendar, Shield, Car, Handshake, Receipt, Ban, ShieldOff, KeyRound, Download, Loader2 } from "lucide-react";

interface AdminUserCardProps {
  userId: string | null;
  onClose: () => void;
}

const AdminUserCard: React.FC<AdminUserCardProps> = ({ userId, onClose }) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { data: profile, isLoading: profileLoading, refetch } = useQuery({
    queryKey: ["admin-user-card", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: authDetails } = useQuery({
    queryKey: ["admin-user-auth", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase.functions.invoke("admin-actions", {
        body: { action: "get_user_details", target_user_id: userId },
      });
      if (error) return null;
      return data;
    },
    enabled: !!userId,
  });

  const { data: activity } = useQuery({
    queryKey: ["admin-user-activity", userId],
    queryFn: async () => {
      if (!userId) return null;
      const [carsRes, offersAsBuyerRes, offersAsSellerRes, txAsBuyerRes, txAsSellerRes] = await Promise.all([
        supabase.from("cars").select("id", { count: "exact", head: true }).eq("owner_id", userId),
        supabase.from("offers").select("id, status", { count: "exact" }).eq("buyer_id", userId),
        supabase.from("offers").select("id, status", { count: "exact" }).eq("seller_id", userId),
        supabase.from("transactions").select("id, status", { count: "exact" }).eq("buyer_id", userId),
        supabase.from("transactions").select("id, status", { count: "exact" }).eq("seller_id", userId),
      ]);

      const buyerOffers = offersAsBuyerRes.data || [];
      const sellerOffers = offersAsSellerRes.data || [];
      const buyerTx = txAsBuyerRes.data || [];
      const sellerTx = txAsSellerRes.data || [];

      return {
        carsPosted: carsRes.count ?? 0,
        carsPurchased: buyerTx.filter(t => t.status === "completed").length,
        carsSold: sellerTx.filter(t => t.status === "completed").length,
        activeNegotiations: [...buyerOffers, ...sellerOffers].filter(o => !["accepted", "rejected", "stopped"].includes(o.status)).length,
        completedNegotiations: [...buyerOffers, ...sellerOffers].filter(o => o.status === "accepted").length,
        totalContracts: buyerTx.length + sellerTx.length,
        signedContracts: [...buyerTx, ...sellerTx].filter(t => t.status === "completed").length,
      };
    },
    enabled: !!userId,
  });

  const handleSuspend = async (suspended: boolean, type: "soft" | "hard") => {
    if (!userId) return;
    setActionLoading("suspend");
    try {
      const { data, error } = await supabase.functions.invoke("admin-actions", {
        body: { action: "suspend_user", target_user_id: userId, suspended, suspension_type: type },
      });
      if (error || data?.error) throw new Error(data?.error || "Failed");
      toast.success(suspended ? `User ${type} suspended` : "User unsuspended");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetPassword = async () => {
    if (!userId) return;
    setActionLoading("reset");
    try {
      const { data, error } = await supabase.functions.invoke("admin-actions", {
        body: { action: "reset_password", target_email: userId },
      });
      if (error || data?.error) throw new Error(data?.error || "Failed");
      toast.success(data?.message || "Reset email sent");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = () => {
    if (!profile) return;
    const exportData = { profile, authDetails, activity };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user_${userId}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("User data exported");
  };

  return (
    <Dialog open={!!userId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            User Profile
          </DialogTitle>
        </DialogHeader>

        {profileLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading…</div>
        ) : profile ? (
          <div className="space-y-6">
            {/* User Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">User Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <Detail label="Full Name" value={profile.full_name || "—"} />
                <Detail label="Email" value={authDetails?.email || "—"} />
                <Detail label="Phone" value={profile.phone || "—"} />
                <Detail label="Location" value={[profile.city, profile.country].filter(Boolean).join(", ") || "—"} icon={<MapPin className="h-3 w-3" />} />
                <Detail label="Registered" value={new Date(profile.created_at).toLocaleDateString()} icon={<Calendar className="h-3 w-3" />} />
                <Detail label="Last Login" value={authDetails?.last_sign_in_at ? new Date(authDetails.last_sign_in_at).toLocaleDateString() : "—"} />
                <Detail label="Status" value={
                  profile.suspended ? (
                    <Badge variant="destructive">{profile.suspension_type === "hard" ? "Hard Suspended" : "Soft Suspended"}</Badge>
                  ) : (
                    <Badge variant="secondary">Active</Badge>
                  )
                } icon={<Shield className="h-3 w-3" />} />
                <Detail label="Language" value={profile.language?.toUpperCase() || "—"} />
              </div>
            </div>

            <Separator />

            {/* Activity */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Activity</h4>
              {activity ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <StatCard icon={Car} label="Cars Posted" value={activity.carsPosted} />
                  <StatCard icon={Car} label="Cars Purchased" value={activity.carsPurchased} />
                  <StatCard icon={Car} label="Cars Sold" value={activity.carsSold} />
                  <StatCard icon={Handshake} label="Active Negotiations" value={activity.activeNegotiations} />
                  <StatCard icon={Handshake} label="Completed Negotiations" value={activity.completedNegotiations} />
                  <StatCard icon={Receipt} label="Contracts" value={`${activity.signedContracts}/${activity.totalContracts}`} />
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">Loading activity…</div>
              )}
            </div>

            <Separator />

            {/* Admin Actions */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Admin Actions</h4>
              <div className="flex flex-wrap gap-2">
                {!profile.suspended ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleSuspend(true, "soft")} disabled={!!actionLoading}>
                      {actionLoading === "suspend" ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : <ShieldOff className="h-3 w-3 mr-1.5" />}
                      Soft Suspend
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleSuspend(true, "hard")} disabled={!!actionLoading}>
                      <Ban className="h-3 w-3 mr-1.5" /> Hard Suspend
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleSuspend(false, "soft")} disabled={!!actionLoading}>
                    <ShieldOff className="h-3 w-3 mr-1.5" /> Unsuspend
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleResetPassword} disabled={!!actionLoading}>
                  {actionLoading === "reset" ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : <KeyRound className="h-3 w-3 mr-1.5" />}
                  Reset Password
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-3 w-3 mr-1.5" /> Export Data
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">User not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Detail = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="bg-muted/50 rounded-lg p-3">
    <div className="text-xs text-muted-foreground flex items-center gap-1">{icon}{label}</div>
    <div className="text-sm text-foreground font-medium mt-0.5">{typeof value === "string" ? value : value}</div>
  </div>
);

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number | string }) => (
  <div className="bg-muted/50 rounded-lg p-3 text-center">
    <Icon className="h-4 w-4 text-primary mx-auto mb-1" />
    <div className="text-lg font-bold text-foreground">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default AdminUserCard;

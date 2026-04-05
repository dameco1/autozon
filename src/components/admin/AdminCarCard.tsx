import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Car, User, Calendar, Gauge, Fuel, Cog, Palette, Zap, Check, CheckCircle2, XCircle, HelpCircle, ClipboardCheck, Handshake, Receipt, Camera } from "lucide-react";
import { INSPECTION_CATEGORIES, type InspectionChecklist } from "@/components/car-upload/inspectionChecklist";

interface AdminCarCardProps {
  carId: string | null;
  onClose: () => void;
}

const AdminCarCard: React.FC<AdminCarCardProps> = ({ carId, onClose }) => {
  const queryClient = useQueryClient();

  const { data: car, isLoading } = useQuery({
    queryKey: ["admin-car-card", carId],
    queryFn: async () => {
      if (!carId) return null;
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", carId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!carId,
  });

  const { data: owner } = useQuery({
    queryKey: ["admin-car-owner", car?.owner_id],
    queryFn: async () => {
      if (!car?.owner_id) return null;
      const { data } = await supabase.from("profiles").select("user_id, full_name, city, country").eq("user_id", car.owner_id).single();
      return data;
    },
    enabled: !!car?.owner_id,
  });

  const { data: history } = useQuery({
    queryKey: ["admin-car-history", carId],
    queryFn: async () => {
      if (!carId) return null;
      const [offersRes, txRes] = await Promise.all([
        supabase.from("offers").select("id, amount, counter_amount, agreed_price, status, current_round, max_rounds, created_at, buyer_id").eq("car_id", carId).order("created_at", { ascending: false }),
        supabase.from("transactions").select("id, agreed_price, status, buyer_id, current_step, created_at").eq("car_id", carId).order("created_at", { ascending: false }),
      ]);

      // Fetch buyer names
      const buyerIds = [...new Set([
        ...(offersRes.data || []).map(o => o.buyer_id),
        ...(txRes.data || []).map(t => t.buyer_id),
      ])];
      const profilesRes = buyerIds.length > 0
        ? await supabase.from("profiles").select("user_id, full_name").in("user_id", buyerIds)
        : { data: [] };
      const profilesMap: Record<string, string> = {};
      (profilesRes.data || []).forEach((p: any) => { profilesMap[p.user_id] = p.full_name; });

      return {
        offers: (offersRes.data || []).map(o => ({ ...o, buyer_name: profilesMap[o.buyer_id] || o.buyer_id.slice(0, 8) })),
        transactions: (txRes.data || []).map(t => ({ ...t, buyer_name: profilesMap[t.buyer_id] || t.buyer_id.slice(0, 8) })),
      };
    },
    enabled: !!carId,
  });

  const handleStatusChange = async (status: string) => {
    if (!carId) return;
    const { error } = await supabase.from("cars").update({ status }).eq("id", carId);
    if (error) { toast.error(error.message); return; }
    toast.success(`Status updated to ${status}`);
    queryClient.invalidateQueries({ queryKey: ["admin-car-card", carId] });
    queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
  };

  const inspection = car?.inspection_checklist as InspectionChecklist | null;
  const hasInspection = inspection && Object.keys(inspection).length > 0;
  const photos = (car?.photos as string[] | null) || [];
  const equipment = (car?.equipment as string[] | null) || [];

  return (
    <Dialog open={!!carId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            {car ? `${car.year} ${car.make} ${car.model}` : "Car Details"}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading…</div>
        ) : car ? (
          <div className="space-y-6">
            {/* Photos */}
            {photos.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5" /> Photos ({photos.length})
                </h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {photos.map((url, i) => (
                    <img key={i} src={url} alt={`Photo ${i + 1}`} className="w-24 h-16 rounded-lg object-cover border border-border shrink-0" />
                  ))}
                </div>
              </div>
            )}

            {/* Specs */}
            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Specifications</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Spec icon={Calendar} label="Year" value={car.year} />
                <Spec icon={Gauge} label="Mileage" value={`${car.mileage.toLocaleString()} km`} />
                <Spec icon={Fuel} label="Fuel" value={car.fuel_type} />
                <Spec icon={Cog} label="Transmission" value={car.transmission} />
                <Spec icon={Car} label="Body" value={car.body_type} />
                <Spec icon={Palette} label="Color" value={car.color || "—"} />
                <Spec icon={Zap} label="Power" value={car.power_hp ? `${car.power_hp} HP` : "—"} />
                <Spec icon={Car} label="VIN" value={car.vin || "—"} />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Asking Price</div>
                  <div className="text-lg font-bold text-foreground">€{car.price.toLocaleString()}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Fair Value</div>
                  <div className="text-lg font-bold text-primary">€{(car.fair_value_price || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Equipment */}
            {equipment.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Equipment ({equipment.length})</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {equipment.map(e => (
                      <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Inspection */}
            {hasInspection && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ClipboardCheck className="h-3.5 w-3.5" /> Inspection
                  </h4>
                  <div className="space-y-2">
                    {INSPECTION_CATEGORIES.map(cat => {
                      const items = cat.items.filter(item => inspection![item.id] != null);
                      if (!items.length) return null;
                      return (
                        <div key={cat.id}>
                          <div className="text-xs font-semibold text-primary mb-1">{cat.titleEn}</div>
                          <div className="grid grid-cols-1 gap-1">
                            {items.map(item => {
                              const ans = inspection![item.id];
                              return (
                                <div key={item.id} className="flex items-center gap-2 text-xs">
                                  {ans === "yes" ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> :
                                   ans === "no" ? <XCircle className="h-3 w-3 text-destructive" /> :
                                   <HelpCircle className="h-3 w-3 text-amber-400" />}
                                  <span className="text-muted-foreground">{item.labelEn}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Ownership */}
            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Ownership & Status
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Owner</div>
                  <div className="text-sm font-medium text-foreground">{owner?.full_name || "—"}</div>
                  {owner?.city && <div className="text-xs text-muted-foreground">{owner.city}, {owner.country}</div>}
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Listed</div>
                  <div className="text-sm font-medium text-foreground">{new Date(car.created_at).toLocaleDateString()}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <Select value={car.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="h-7 text-xs mt-1 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Placement Paid</div>
                  <div className="text-sm font-medium text-foreground">{car.placement_paid ? "✅ Yes" : "❌ No"}</div>
                </div>
              </div>
            </div>

            {/* History */}
            {history && (history.offers.length > 0 || history.transactions.length > 0) && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Handshake className="h-3.5 w-3.5" /> Negotiation History ({history.offers.length})
                  </h4>
                  {history.offers.length > 0 && (
                    <div className="space-y-1.5">
                      {history.offers.map(o => (
                        <div key={o.id} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 text-xs">
                          <span className="text-foreground font-medium">{o.buyer_name}</span>
                          <span>€{o.amount.toLocaleString()} {o.counter_amount ? `→ €${o.counter_amount.toLocaleString()}` : ""}</span>
                          <Badge variant={o.status === "accepted" ? "default" : o.status === "rejected" ? "destructive" : "secondary"} className="text-[10px]">{o.status}</Badge>
                          <span className="text-muted-foreground">{o.current_round}/{o.max_rounds}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {history.transactions.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Receipt className="h-3.5 w-3.5" /> Transactions ({history.transactions.length})
                      </h4>
                      <div className="space-y-1.5">
                        {history.transactions.map(t => (
                          <div key={t.id} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 text-xs">
                            <span className="text-foreground font-medium">{t.buyer_name}</span>
                            <span className="font-semibold">€{Number(t.agreed_price).toLocaleString()}</span>
                            <Badge variant={t.status === "completed" ? "default" : "secondary"} className="text-[10px]">{t.status}</Badge>
                            <span className="text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">Car not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Spec = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <div className="bg-muted/50 rounded-lg p-2.5 flex items-center gap-2">
    <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
    <div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-xs text-foreground font-medium">{value}</div>
    </div>
  </div>
);

export default AdminCarCard;

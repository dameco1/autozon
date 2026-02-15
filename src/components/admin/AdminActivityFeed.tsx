import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Eye, Star } from "lucide-react";

const AdminActivityFeed: React.FC = () => {
  const { data: activity } = useQuery({
    queryKey: ["admin-activity"],
    queryFn: async () => {
      const [notifs, views, shortlists] = await Promise.all([
        supabase.from("notifications").select("id, title, message, type, created_at").order("created_at", { ascending: false }).limit(20),
        supabase.from("car_views").select("id, car_id, created_at").order("created_at", { ascending: false }).limit(20),
        supabase.from("car_shortlists").select("id, car_id, created_at").order("created_at", { ascending: false }).limit(10),
      ]);

      type ActivityItem = { id: string; icon: "bell" | "eye" | "star"; text: string; time: string };
      const items: ActivityItem[] = [];

      notifs.data?.forEach((n) =>
        items.push({ id: n.id, icon: "bell", text: `${n.title}: ${n.message}`, time: n.created_at })
      );
      views.data?.forEach((v) =>
        items.push({ id: v.id, icon: "eye", text: `Car viewed (${v.car_id.slice(0, 8)}…)`, time: v.created_at })
      );
      shortlists.data?.forEach((s) =>
        items.push({ id: s.id, icon: "star", text: `Car shortlisted (${s.car_id.slice(0, 8)}…)`, time: s.created_at })
      );

      items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      return items.slice(0, 50);
    },
  });

  const iconMap = { bell: Bell, eye: Eye, star: Star };

  return (
    <div className="space-y-2">
      {activity?.length === 0 && <p className="text-muted-foreground text-sm">No recent activity</p>}
      {activity?.map((item) => {
        const Icon = iconMap[item.icon];
        return (
          <Card key={item.id} className="bg-card border-border">
            <CardContent className="flex items-center gap-3 py-3 px-4">
              <Icon className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm text-foreground flex-1 truncate">{item.text}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(item.time).toLocaleString()}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminActivityFeed;

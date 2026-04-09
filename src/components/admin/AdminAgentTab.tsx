import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketCheck, Activity, AlertTriangle, MessageSquare } from "lucide-react";

interface Ticket {
  id: string;
  user_id: string;
  category: string;
  subject: string;
  description: string;
  page_context: string | null;
  severity: string;
  status: string;
  created_at: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  tool_name: string;
  details: Record<string, unknown>;
  page_context: string | null;
  created_at: string;
}

const severityColor: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  critical: "bg-destructive/20 text-destructive",
};

const statusColor: Record<string, string> = {
  open: "bg-primary/20 text-primary",
  in_progress: "bg-yellow-500/20 text-yellow-400",
  resolved: "bg-green-500/20 text-green-400",
  closed: "bg-muted text-muted-foreground",
};

const AdminAgentTab: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [ticketRes, activityRes] = await Promise.all([
      supabase.from("support_tickets").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("agent_activity_log").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    setTickets((ticketRes.data as Ticket[]) ?? []);
    setActivity((activityRes.data as ActivityLog[]) ?? []);
    setLoading(false);
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    await supabase.from("support_tickets").update({ status: newStatus }).eq("id", ticketId);
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)));
  };

  const filteredTickets = statusFilter === "all" ? tickets : tickets.filter((t) => t.status === statusFilter);
  const flaggedCount = activity.filter((a) => a.action_type === "flag_suspicious").length;
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const toolCalls = activity.filter((a) => a.action_type === "tool_call").length;

  if (loading) return <div className="text-muted-foreground text-center py-8">Loading AI Agent data…</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <TicketCheck className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{openTickets}</p>
              <p className="text-xs text-muted-foreground">Open Tickets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{tickets.length}</p>
              <p className="text-xs text-muted-foreground">Total Tickets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{toolCalls}</p>
              <p className="text-xs text-muted-foreground">Tool Calls</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-2xl font-bold text-foreground">{flaggedCount}</p>
              <p className="text-xs text-muted-foreground">Suspicious Flags</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="activity">Agent Activity</TabsTrigger>
          <TabsTrigger value="flags">Suspicious Flags</TabsTrigger>
        </TabsList>

        {/* Tickets */}
        <TabsContent value="tickets" className="space-y-4">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Filter:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredTickets.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No tickets found.</p>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((t) => (
                <Card key={t.id}>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm">{t.subject}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Badge className={severityColor[t.severity] ?? ""}>{t.severity}</Badge>
                        <Badge className={statusColor[t.status] ?? ""}>{t.status}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Category: {t.category} · Page: {t.page_context ?? "—"}</span>
                      <Select value={t.status} onValueChange={(v) => updateTicketStatus(t.id, v)}>
                        <SelectTrigger className="w-28 h-6 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-[10px] text-muted-foreground">User: {t.user_id.slice(0, 8)}… · {new Date(t.created_at).toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Activity Log */}
        <TabsContent value="activity" className="space-y-2">
          {activity.filter((a) => a.action_type === "tool_call").length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No activity logged yet.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {activity
                .filter((a) => a.action_type === "tool_call")
                .map((a) => (
                  <div key={a.id} className="flex items-center gap-3 border border-border rounded-lg px-3 py-2 text-sm">
                    <Activity className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-xs text-primary">{a.tool_name}</span>
                      <p className="text-xs text-muted-foreground truncate">{JSON.stringify(a.details)}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{new Date(a.created_at).toLocaleString()}</span>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>

        {/* Suspicious Flags */}
        <TabsContent value="flags" className="space-y-2">
          {activity.filter((a) => a.action_type === "flag_suspicious").length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No suspicious activity flagged.</p>
          ) : (
            <div className="space-y-3">
              {activity
                .filter((a) => a.action_type === "flag_suspicious")
                .map((a) => (
                  <Card key={a.id} className="border-destructive/30">
                    <CardContent className="pt-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <span className="font-semibold text-sm text-foreground">{(a.details as Record<string, string>).reason ?? "Flagged"}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{(a.details as Record<string, string>).extra ?? ""}</p>
                      <p className="text-[10px] text-muted-foreground">User: {a.user_id.slice(0, 8)}… · Page: {a.page_context ?? "—"} · {new Date(a.created_at).toLocaleString()}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAgentTab;

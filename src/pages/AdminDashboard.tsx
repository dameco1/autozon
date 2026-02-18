import React from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminCarsTable from "@/components/admin/AdminCarsTable";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import AdminNegotiations from "@/components/admin/AdminNegotiations";
import AdminActivityFeed from "@/components/admin/AdminActivityFeed";
import AdminMatches from "@/components/admin/AdminMatches";
import AdminTransactions from "@/components/admin/AdminTransactions";

const AdminDashboard: React.FC = () => {
  const { loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Verifying access…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Command Center</h1>
            <p className="text-sm text-muted-foreground">Admin overview of all platform activity</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cars">Cars</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="negotiations">Negotiations</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><AdminOverview /></TabsContent>
          <TabsContent value="cars"><AdminCarsTable /></TabsContent>
          <TabsContent value="users"><AdminUsersTable /></TabsContent>
          <TabsContent value="transactions"><AdminTransactions /></TabsContent>
          <TabsContent value="negotiations"><AdminNegotiations /></TabsContent>
          <TabsContent value="matches"><AdminMatches /></TabsContent>
          <TabsContent value="activity"><AdminActivityFeed /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminForge } from "@/components/admin/AdminForge";
import { DemographicManager } from "@/components/admin/DemographicManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Admin Dashboard | Ipê",
  description: "Manage proposals and demographics.",
};

export default function AdminPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Platform Administration</h1>
        
        <Tabs defaultValue="forge" className="w-full">
          <TabsList className="mb-8 w-full max-w-md grid grid-cols-2 bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="forge" className="data-[state=active]:bg-[#00FF66] data-[state=active]:text-black">
              Proposal Forge
            </TabsTrigger>
            <TabsTrigger value="demographics" className="data-[state=active]:bg-[#00FF66] data-[state=active]:text-black">
              Demographic Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forge" className="focus-visible:outline-none focus-visible:ring-0">
            <AdminForge />
          </TabsContent>

          <TabsContent value="demographics" className="focus-visible:outline-none focus-visible:ring-0">
            <DemographicManager />
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
}

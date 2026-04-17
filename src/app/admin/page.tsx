import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminForge } from "@/components/admin/AdminForge";

export const metadata = {
  title: "Proposal Forge | Admin",
  description: "Create and shape civic proposals.",
};

export default function AdminPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Proposal Forge</h1>
        <AdminForge />
      </div>
    </AuthGuard>
  );
}

import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  component: Layout,
});

function Layout() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }
  if (!user) return <Navigate to="/auth" />;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Outlet />
    </div>
  );
}
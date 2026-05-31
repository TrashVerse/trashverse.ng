import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Wallet, Recycle, TrendingUp, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Eco-Credits Dashboard — TrashVerse" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const userId = user!.id;

  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      return data;
    },
  });

  const { data: pickups = [] } = useQuery({
    queryKey: ["pickups", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("pickup_requests")
        .select("*, waste_categories(name, credits_per_kg)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const totalCredits = Number(profile?.total_credits ?? 0);
  const totalKg = pickups
    .filter((p) => p.status === "approved" || p.status === "completed")
    .reduce((sum, p) => sum + Number(p.estimated_weight_kg || 0), 0);
  const pendingCount = pickups.filter((p) => p.status === "pending").length;

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Hello, {profile?.full_name || "friend"} 👋</h1>
          <p className="text-muted-foreground mt-1">Your recycling impact at a glance.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link to="/request-pickup"><Truck className="h-4 w-4" /> Request a Pickup</Link>
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard icon={Wallet} label="Eco-Credits" value={totalCredits.toFixed(2)} accent />
        <StatCard icon={Recycle} label="Kg Recycled" value={totalKg.toFixed(1)} />
        <StatCard icon={TrendingUp} label="Pending Requests" value={String(pendingCount)} />
      </div>

      <section className="mt-10">
        <h2 className="text-xl sm:text-2xl font-bold">Your Pickup History</h2>
        {pickups.length === 0 ? (
          <div className="mt-4 bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
            No pickup requests yet. <Link to="/request-pickup" className="text-primary underline">Make your first one</Link>.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {pickups.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <StatusBadge status={p.status} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{(p as any).waste_categories?.name ?? "Mixed waste"} · {p.estimated_weight_kg} kg</p>
                  <p className="text-sm text-muted-foreground truncate">{p.address}{p.city ? `, ${p.city}` : ""}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(p.created_at).toLocaleDateString()}{p.preferred_date ? ` · preferred ${p.preferred_date}` : ""}</p>
                </div>
                {Number(p.credits_awarded) > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Credits</p>
                    <p className="text-lg font-bold text-primary">+{Number(p.credits_awarded).toFixed(2)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 sm:p-6 border ${accent ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent ? "bg-primary-foreground/20" : "bg-primary-soft text-primary"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <p className={`text-sm ${accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{label}</p>
      </div>
      <p className="mt-3 text-3xl sm:text-4xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: any; cls: string; label: string }> = {
    pending: { icon: Clock, cls: "bg-yellow-100 text-yellow-800", label: "Pending" },
    approved: { icon: CheckCircle2, cls: "bg-blue-100 text-blue-800", label: "Approved" },
    completed: { icon: CheckCircle2, cls: "bg-green-100 text-green-800", label: "Completed" },
    rejected: { icon: XCircle, cls: "bg-red-100 text-red-800", label: "Rejected" },
  };
  const s = map[status] ?? map.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${s.cls}`}>
      <Icon className="h-3.5 w-3.5" /> {s.label}
    </span>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Wallet, Recycle, TrendingUp, Clock, CheckCircle2, XCircle, Truck, ArrowUpRight, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Eco-Credits Dashboard — Trashverse" }] }),
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

  const { data: ledger = [] } = useQuery({
    queryKey: ["ledger", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("credit_ledger")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
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
          <div className="mt-4 space-y-4">
            {pickups.map((p) => <PickupTimelineCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><FileText className="h-5 w-5" /> Credit History</h2>
        </div>
        {ledger.length === 0 ? (
          <div className="mt-4 bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground text-sm">
            No credit activity yet. Complete a pickup to start earning.
          </div>
        ) : (
          <div className="mt-4 bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Reason</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Balance</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((l) => (
                  <tr key={l.id} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(l.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{l.reason}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${Number(l.amount) >= 0 ? "text-primary" : "text-red-600"}`}>
                      {Number(l.amount) >= 0 ? "+" : ""}{Number(l.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">{Number(l.balance_after).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

function PickupTimelineCard({ p }: { p: any }) {
  const steps = [
    { key: "submitted", label: "Submitted", at: p.created_at },
    { key: "approved", label: "Approved", at: ["approved", "completed"].includes(p.status) ? p.reviewed_at : null },
    { key: "completed", label: "Completed", at: p.status === "completed" ? p.reviewed_at : null },
  ];
  if (p.status === "rejected") {
    steps[1] = { key: "rejected", label: "Rejected", at: p.reviewed_at };
    steps.pop();
  }
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <StatusBadge status={p.status} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{p.waste_categories?.name ?? "Mixed waste"} · {p.estimated_weight_kg} kg</p>
          <p className="text-sm text-muted-foreground truncate">{p.address}{p.city ? `, ${p.city}` : ""}</p>
        </div>
        {Number(p.credits_awarded) > 0 && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Credits</p>
            <p className="text-lg font-bold text-primary flex items-center gap-1"><ArrowUpRight className="h-4 w-4" />+{Number(p.credits_awarded).toFixed(2)}</p>
          </div>
        )}
      </div>

      <ol className="mt-4 flex items-center justify-between gap-2">
        {steps.map((s, i) => {
          const done = !!s.at;
          const isReject = s.key === "rejected";
          return (
            <li key={s.key} className="flex-1 flex items-center gap-2 min-w-0">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                done ? (isReject ? "bg-red-500 text-white" : "bg-primary text-primary-foreground") : "bg-muted text-muted-foreground"
              }`}>
                {done ? (isReject ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />) : <Clock className="h-3.5 w-3.5" />}
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className={`text-xs font-medium truncate ${done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{s.at ? new Date(s.at).toLocaleDateString() : "—"}</p>
              </div>
              <p className={`text-xs sm:hidden ${done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${steps[i+1].at ? "bg-primary" : "bg-border"}`} />}
            </li>
          );
        })}
      </ol>
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
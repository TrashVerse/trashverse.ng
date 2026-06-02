import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, CheckCircle2, XCircle, Truck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Verification — Trashverse" }] }),
  component: AdminPanel,
});

function AdminPanel() {
  const { isAdmin, roles, loading } = useAuth();
  const qc = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin_pickups"],
    enabled: isAdmin || roles.includes("agent"),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pickup_requests")
        .select("*, waste_categories(name, credits_per_kg), profiles!pickup_requests_user_id_fkey(full_name, phone)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (loading) return <p className="p-8 text-muted-foreground">Loading...</p>;
  if (!isAdmin && !roles.includes("agent")) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <ShieldCheck className="h-12 w-12 mx-auto text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Admins only</h1>
        <p className="mt-2 text-muted-foreground">You need admin or agent permissions to view this page.</p>
      </main>
    );
  }

  const updateStatus = async (id: string, status: "approved" | "completed" | "rejected") => {
    const { error } = await supabase.from("pickup_requests").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Marked ${status}`);
      qc.invalidateQueries({ queryKey: ["admin_pickups"] });
    }
  };

  const pending = requests.filter((r) => r.status === "pending");
  const reviewed = requests.filter((r) => r.status !== "pending");

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Verification</h1>
          <p className="text-muted-foreground text-sm">Review pickup requests and award eco-credits.</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg sm:text-xl font-bold">Pending ({pending.length})</h2>
        <div className="mt-3 space-y-3">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {!isLoading && pending.length === 0 && (
            <p className="text-muted-foreground bg-card border border-border rounded-xl p-6">No pending requests.</p>
          )}
          {pending.map((r) => <RequestRow key={r.id} r={r} onAction={updateStatus} actionable />)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg sm:text-xl font-bold">Reviewed</h2>
        <div className="mt-3 space-y-3">
          {reviewed.map((r) => <RequestRow key={r.id} r={r} onAction={updateStatus} />)}
        </div>
      </section>
    </main>
  );
}

function RequestRow({ r, onAction, actionable }: { r: any; onAction: (id: string, s: "approved" | "completed" | "rejected") => void; actionable?: boolean }) {
  const estCredits = r.waste_categories ? (Number(r.estimated_weight_kg) * Number(r.waste_categories.credits_per_kg)).toFixed(2) : "—";
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Truck className="h-4 w-4 text-primary" />
            <span className="font-semibold">{r.waste_categories?.name ?? "Mixed waste"}</span>
            <span className="text-sm text-muted-foreground">· {r.estimated_weight_kg} kg</span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
              r.status === "approved" ? "bg-blue-100 text-blue-800" :
              r.status === "completed" ? "bg-green-100 text-green-800" :
              r.status === "rejected" ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>{r.status}</span>
          </div>
          <p className="text-sm mt-2"><span className="text-muted-foreground">User:</span> {r.profiles?.full_name || "—"} · {r.profiles?.phone || "no phone"}</p>
          <p className="text-sm"><span className="text-muted-foreground">Address:</span> {r.address}{r.city ? `, ${r.city}` : ""}</p>
          {r.preferred_date && <p className="text-sm"><span className="text-muted-foreground">Preferred date:</span> {r.preferred_date}</p>}
          {r.notes && <p className="text-sm italic text-muted-foreground mt-1">"{r.notes}"</p>}
          <p className="text-xs text-muted-foreground mt-1">
            Submitted {new Date(r.created_at).toLocaleString()} · Est. credits: <strong className="text-primary">{estCredits}</strong>
            {Number(r.credits_awarded) > 0 && <> · Awarded: <strong className="text-primary">{Number(r.credits_awarded).toFixed(2)}</strong></>}
          </p>
        </div>
        {actionable && (
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={() => onAction(r.id, "approved")} className="bg-blue-600 hover:bg-blue-700 text-white"><CheckCircle2 className="h-4 w-4" /> Approve</Button>
            <Button size="sm" onClick={() => onAction(r.id, "completed")} className="bg-primary hover:bg-primary/90 text-primary-foreground"><CheckCircle2 className="h-4 w-4" /> Complete</Button>
            <Button size="sm" variant="outline" onClick={() => onAction(r.id, "rejected")} className="text-red-600 border-red-300 hover:bg-red-50"><XCircle className="h-4 w-4" /> Reject</Button>
          </div>
        )}
      </div>
    </div>
  );
}
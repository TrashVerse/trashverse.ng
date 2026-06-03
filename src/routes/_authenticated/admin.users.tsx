import { friendlyError } from "@/lib/friendly-error";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, ShieldCheck, Trash2, Plus, Banknote, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "User Management — Trashverse" }] }),
  component: AdminUsers,
});

type Role = "admin" | "agent" | "user";

function AdminUsers() {
  const { isAdmin, loading } = useAuth();
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin_users"],
    enabled: isAdmin,
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }, { data: creds }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, phone, total_credits, created_at").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role, id"),
        supabase.from("admin_credentials").select("user_id, access_code"),
      ]);
      return (profiles ?? []).map((p) => ({
        ...p,
        roles: (roles ?? []).filter((r) => r.user_id === p.id),
        access_code: (creds ?? []).find((c) => c.user_id === p.id)?.access_code ?? null,
      }));
    },
  });

  const addRole = async (userId: string, role: Role) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) toast.error(friendlyError(error));
    else { toast.success(`Granted ${role}`); qc.invalidateQueries({ queryKey: ["admin_users"] }); }
  };

  const removeRole = async (id: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) toast.error(friendlyError(error));
    else { toast.success("Role removed"); qc.invalidateQueries({ queryKey: ["admin_users"] }); }
  };

  const payOut = async (userId: string, currentBalance: number) => {
    const raw = prompt(`Pay out how many credits? (balance: ${currentBalance.toFixed(2)})`, currentBalance.toFixed(2));
    if (!raw) return;
    const amount = parseFloat(raw);
    if (!Number.isFinite(amount) || amount <= 0) return toast.error("Invalid amount");
    if (amount > currentBalance) return toast.error("Amount exceeds balance");
    const newBalance = +(currentBalance - amount).toFixed(2);
    const { error: upErr } = await supabase.from("profiles").update({ total_credits: newBalance }).eq("id", userId);
    if (upErr) return toast.error(friendlyError(upErr));
    const { error: lErr } = await supabase.from("credit_ledger").insert({
      user_id: userId,
      amount: -amount,
      balance_after: newBalance,
      reason: "Admin payout",
    });
    if (lErr) return toast.error(friendlyError(lErr));
    toast.success(`Paid out ${amount.toFixed(2)} credits`);
    qc.invalidateQueries({ queryKey: ["admin_users"] });
  };

  const setCode = async (userId: string, current: string | null) => {
    const raw = prompt("Set admin access code (leave blank to remove)", current ?? "");
    if (raw === null) return;
    const code = raw.trim();
    if (!code) {
      const { error } = await supabase.from("admin_credentials").delete().eq("user_id", userId);
      if (error) return toast.error(friendlyError(error));
      toast.success("Access code removed");
    } else {
      const { error } = await supabase.from("admin_credentials").upsert({ user_id: userId, access_code: code });
      if (error) return toast.error(friendlyError(error));
      toast.success("Access code saved");
    }
    qc.invalidateQueries({ queryKey: ["admin_users"] });
  };

  if (loading) return <p className="p-8 text-muted-foreground">Loading...</p>;
  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <ShieldCheck className="h-12 w-12 mx-auto text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Admins only</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground text-sm">Assign roles (max 5 admins) and set admin access codes.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/admin/logs">Login logs</Link></Button>
          <Button asChild variant="outline"><Link to="/admin">Pickup verification →</Link></Button>
        </div>
      </div>

      <div className="mt-8 bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading && <p className="p-6 text-muted-foreground">Loading users...</p>}
        {!isLoading && rows.length === 0 && <p className="p-6 text-muted-foreground">No users yet.</p>}
        {!isLoading && rows.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Phone</th>
                <th className="text-right px-4 py-3 font-medium">Credits</th>
                <th className="text-left px-4 py-3 font-medium">Roles</th>
                <th className="text-right px-4 py-3 font-medium">Add role</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => <UserRow key={u.id} u={u} onAdd={addRole} onRemove={removeRole} onPay={payOut} onSetCode={setCode} />)}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

function UserRow({ u, onAdd, onRemove, onPay, onSetCode }: { u: any; onAdd: (id: string, r: Role) => void; onRemove: (id: string) => void; onPay: (id: string, bal: number) => void; onSetCode: (id: string, current: string | null) => void }) {
  const [pending, setPending] = useState<Role>("agent");
  const existing: Role[] = u.roles.map((r: any) => r.role);
  const available: Role[] = (["admin", "agent", "user"] as Role[]).filter((r) => !existing.includes(r));
  const isAdminRow = existing.includes("admin");
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3">
        <p className="font-semibold">{u.full_name || "Unnamed"}</p>
        <p className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">{u.id}</p>
        {isAdminRow && (
          <button onClick={() => onSetCode(u.id, u.access_code)} className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline">
            <KeyRound className="h-3 w-3" />
            {u.access_code ? `Code: ${u.access_code}` : "Set access code"}
          </button>
        )}
      </td>
      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{u.phone || "—"}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <span className="font-semibold text-primary">{Number(u.total_credits).toFixed(2)}</span>
          {Number(u.total_credits) > 0 && (
            <Button size="sm" variant="outline" className="h-7 px-2 gap-1" onClick={() => onPay(u.id, Number(u.total_credits))}>
              <Banknote className="h-3.5 w-3.5" /> Pay
            </Button>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {u.roles.length === 0 && <span className="text-xs text-muted-foreground">no role</span>}
          {u.roles.map((r: any) => (
            <span key={r.id} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
              r.role === "admin" ? "bg-red-100 text-red-800" : r.role === "agent" ? "bg-blue-100 text-blue-800" : "bg-muted text-muted-foreground"
            }`}>
              {r.role}
              <button onClick={() => onRemove(r.id)} aria-label="Remove role" className="hover:text-foreground">
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          {available.length === 0 ? (
            <span className="text-xs text-muted-foreground">all granted</span>
          ) : (
            <>
              <Select value={pending} onValueChange={(v) => setPending(v as Role)}>
                <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {available.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={() => onAdd(u.id, pending)} className="h-8 gap-1 bg-primary text-primary-foreground">
                <Plus className="h-3.5 w-3.5" /> Grant
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ScrollText, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin/logs")({
  head: () => ({ meta: [{ title: "Admin Login Logs — Trashverse" }] }),
  component: AdminLogs,
});

function AdminLogs() {
  const { isAdmin, loading } = useAuth();
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["admin_login_logs"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data } = await supabase
        .from("admin_login_logs")
        .select("id, user_id, email, success, reason, user_agent, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      return data ?? [];
    },
  });

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
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
          <ScrollText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Login Logs</h1>
          <p className="text-muted-foreground text-sm">Every admin sign-in attempt (latest 500).</p>
        </div>
      </div>

      <div className="mt-8 bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading && <p className="p-6 text-muted-foreground">Loading...</p>}
        {!isLoading && logs.length === 0 && <p className="p-6 text-muted-foreground">No login attempts yet.</p>}
        {!isLoading && logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">When</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Reason</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Browser</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l: any) => (
                  <tr key={l.id} className="border-t border-border">
                    <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2">{l.email || "—"}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${l.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {l.success ? "success" : "failed"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground hidden md:table-cell">{l.reason || "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground hidden lg:table-cell truncate max-w-[300px]">{l.user_agent || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
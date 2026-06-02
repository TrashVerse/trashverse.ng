import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin Sign in — Trashverse" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    // If already signed-in as admin, jump in.
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      if ((roles ?? []).some((r) => r.role === "admin")) navigate({ to: "/admin", replace: true });
    })();
  }, [navigate]);

  const log = async (uid: string, em: string, ok: boolean, reason?: string) => {
    await supabase.from("admin_login_logs").insert({
      user_id: uid,
      email: em,
      success: ok,
      reason: reason ?? null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: signIn, error: sErr } = await supabase.auth.signInWithPassword({ email, password });
      if (sErr || !signIn.user) {
        toast.error(sErr?.message || "Invalid credentials");
        return;
      }
      const uid = signIn.user.id;

      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      const isAdmin = (roles ?? []).some((r) => r.role === "admin");
      if (!isAdmin) {
        await log(uid, email, false, "Not an admin");
        await supabase.auth.signOut();
        toast.error("This account is not an admin.");
        return;
      }

      const { data: cred } = await supabase.from("admin_credentials").select("access_code").eq("user_id", uid).maybeSingle();
      if (!cred || cred.access_code !== code) {
        await log(uid, email, false, "Bad access code");
        await supabase.auth.signOut();
        toast.error("Invalid access code.");
        return;
      }

      await log(uid, email, true, "Login");
      toast.success("Welcome, admin.");
      navigate({ to: "/admin", replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-hero-bg px-4 py-10">
      <Link to="/" className="flex items-center gap-2 text-primary mb-6">
        <img src={logo} alt="Trashverse" className="h-8 w-8 object-contain" />
        <span className="text-2xl font-bold">Trashverse</span>
      </Link>
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin sign-in</h1>
            <p className="text-xs text-muted-foreground">Requires personal access code.</p>
          </div>
        </div>
        <form onSubmit={handle} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="code">Access code</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="Provided by Trashverse" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {loading ? "Verifying..." : "Sign in as admin"}
          </Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Not an admin? <Link to="/auth" className="text-primary hover:underline">User sign-in</Link>
        </p>
      </div>
    </div>
  );
}
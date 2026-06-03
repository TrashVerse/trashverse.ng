import { friendlyError } from "@/lib/friendly-error";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Trashverse" },
      { name: "description", content: "Join Trashverse as a Field Agent and help drive the green revolution in Nigeria." },
    ],
  }),
  component: Careers,
});

function Careers() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", city: "", experience: "", why: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("agent_applications").insert(form);
    setLoading(false);
    if (error) return toast.error(error.message);
    setDone(true);
    toast.success("Application submitted — we'll be in touch!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Briefcase className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold">Become a Field Agent</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Help us run collection hubs, coordinate pickups, and lead community outreach across Abia State and beyond.
          </p>
        </div>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[
            { icon: MapPin, t: "Local impact", d: "Work in your community." },
            { icon: Users, t: "Outreach", d: "Run education and signup drives." },
            { icon: Briefcase, t: "Flexible role", d: "Part-time or full-time options." },
          ].map((b) => (
            <div key={b.t} className="bg-card border border-border rounded-xl p-4 text-center">
              <b.icon className="h-6 w-6 text-primary mx-auto" />
              <p className="font-bold mt-2">{b.t}</p>
              <p className="text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>

        {done ? (
          <div className="mt-10 bg-primary-soft border border-primary/20 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-primary">Thanks for applying!</h2>
            <p className="mt-2 text-muted-foreground">Our team will review your application and reach out soon.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 bg-card border border-border rounded-2xl p-5 sm:p-8 space-y-4">
            <h2 className="font-bold text-lg">Apply now</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="fn">Full name</Label><Input id="fn" required maxLength={100} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div><Label htmlFor="ph">Phone</Label><Input id="ph" type="tel" required maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label htmlFor="em">Email</Label><Input id="em" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label htmlFor="ci">City / LGA</Label><Input id="ci" required maxLength={80} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            </div>
            <div><Label htmlFor="ex">Relevant experience</Label><Textarea id="ex" rows={3} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} /></div>
            <div><Label htmlFor="wy">Why do you want to join Trashverse?</Label><Textarea id="wy" rows={3} value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })} /></div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground">
              {loading ? "Submitting..." : "Submit application"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
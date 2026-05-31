import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/request-pickup")({
  head: () => ({ meta: [{ title: "Request a Pickup — TrashVerse" }] }),
  component: RequestPickup,
});

function RequestPickup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category_id: "",
    address: "",
    city: "",
    estimated_weight_kg: "",
    preferred_date: "",
    notes: "",
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["waste_categories"],
    queryFn: async () => {
      const { data } = await supabase.from("waste_categories").select("*").order("name");
      return data ?? [];
    },
  });

  const selectedCat = categories.find((c) => c.id === form.category_id);
  const estCredits = selectedCat && form.estimated_weight_kg
    ? (Number(form.estimated_weight_kg) * Number(selectedCat.credits_per_kg)).toFixed(2)
    : "—";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category_id || !form.address || !form.estimated_weight_kg) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("pickup_requests").insert({
      user_id: user!.id,
      category_id: form.category_id,
      address: form.address.trim(),
      city: form.city.trim() || null,
      estimated_weight_kg: Number(form.estimated_weight_kg),
      preferred_date: form.preferred_date || null,
      notes: form.notes.trim() || null,
      status: "pending",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Pickup request submitted!");
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
          <Truck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Request a Pickup</h1>
          <p className="text-muted-foreground text-sm">Schedule a collection and earn eco-credits.</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-8 bg-card border border-border rounded-2xl p-5 sm:p-8 space-y-5">
        <div>
          <Label htmlFor="cat">Waste Category *</Label>
          <select
            id="cat"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            required
          >
            <option value="">Select a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({Number(c.credits_per_kg)} credits/kg)</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="kg">Estimated Weight (kg) *</Label>
            <Input id="kg" type="number" step="0.1" min="0.1" value={form.estimated_weight_kg} onChange={(e) => setForm({ ...form, estimated_weight_kg: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="date">Preferred Date</Label>
            <Input id="date" type="date" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} />
          </div>
        </div>

        <div>
          <Label htmlFor="addr">Pickup Address *</Label>
          <Input id="addr" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required maxLength={300} />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} maxLength={100} />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={500} rows={3} />
        </div>

        <div className="bg-primary-soft rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-secondary-foreground">Estimated credits</span>
          <span className="text-2xl font-bold text-primary">{estCredits}</span>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12">
          {loading ? "Submitting…" : "Submit Request"}
        </Button>
      </form>
    </main>
  );
}
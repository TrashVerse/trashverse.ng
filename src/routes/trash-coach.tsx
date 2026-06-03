import { friendlyError } from "@/lib/friendly-error";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Leaf, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/trash-coach")({
  head: () => ({
    meta: [
      { title: "Trash Coach — Trashverse" },
      { name: "description", content: "Updates, recycling tips, and community news from the Trashverse team." },
    ],
  }),
  component: TrashCoach,
});

function TrashCoach() {
  const { isAdmin, user } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["coach_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coach_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const reset = () => { setTitle(""); setBody(""); setEditingId(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (editingId) {
      const { error } = await supabase.from("coach_posts").update({ title, body }).eq("id", editingId);
      if (error) return toast.error(error.message);
      toast.success("Post updated");
    } else {
      const { error } = await supabase.from("coach_posts").insert({ title, body, author_id: user.id });
      if (error) return toast.error(error.message);
      toast.success("Post published");
    }
    reset();
    qc.invalidateQueries({ queryKey: ["coach_posts"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("coach_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["coach_posts"] });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Trash Coach</h1>
            <p className="text-muted-foreground text-sm">Updates, tips and news from the Trashverse team.</p>
          </div>
        </div>

        {isAdmin && (
          <form onSubmit={submit} className="mt-8 bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
            <h2 className="font-bold">{editingId ? "Edit post" : "New post"}</h2>
            <div>
              <Label htmlFor="t">Title</Label>
              <Input id="t" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
            </div>
            <div>
              <Label htmlFor="b">Body</Label>
              <Textarea id="b" value={body} onChange={(e) => setBody(e.target.value)} required rows={6} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-primary text-primary-foreground">{editingId ? "Save" : "Publish"}</Button>
              {editingId && <Button type="button" variant="outline" onClick={reset}>Cancel</Button>}
            </div>
          </form>
        )}

        <div className="mt-8 space-y-5">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {!isLoading && posts.length === 0 && (
            <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
              No posts yet. {!user && <Link to="/auth" className="text-primary">Sign in</Link>}
            </div>
          )}
          {posts.map((p) => (
            <article key={p.id} className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(p.created_at).toLocaleString()}</p>
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditingId(p.id); setTitle(p.title); setBody(p.body); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                )}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-foreground/90 leading-relaxed">{p.body}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
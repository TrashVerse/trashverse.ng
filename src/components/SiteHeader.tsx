import { Link, useNavigate } from "@tanstack/react-router";
import { Recycle, Menu, X, LogOut, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Recycle className="h-6 w-6 sm:h-7 sm:w-7" />
          <span className="text-xl sm:text-2xl font-bold tracking-tight">TrashVerse</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          <Link to="/" hash="services" className="hover:text-primary transition">Services</Link>
          <Link to="/" hash="why" className="hover:text-primary transition">Why Us</Link>
          {user && <Link to="/dashboard" className="hover:text-primary transition">Dashboard</Link>}
          {user && <Link to="/request-pickup" className="hover:text-primary transition">Request Pickup</Link>}
          {isAdmin && <Link to="/admin" className="hover:text-primary transition flex items-center gap-1"><ShieldCheck className="h-4 w-4" />Admin</Link>}
          {isAdmin && <Link to="/admin/users" className="hover:text-primary transition flex items-center gap-1"><Users className="h-4 w-4" />Users</Link>}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          ) : (
            <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/auth">Get Started</Link>
            </Button>
          )}
        </div>

        <button className="md:hidden p-2" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4 gap-3 text-base">
            <Link to="/" hash="services" onClick={() => setOpen(false)} className="py-2">Services</Link>
            <Link to="/" hash="why" onClick={() => setOpen(false)} className="py-2">Why Us</Link>
            {user && <Link to="/dashboard" onClick={() => setOpen(false)} className="py-2 flex items-center gap-2"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>}
            {user && <Link to="/request-pickup" onClick={() => setOpen(false)} className="py-2">Request Pickup</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="py-2 flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Admin</Link>}
            {isAdmin && <Link to="/admin/users" onClick={() => setOpen(false)} className="py-2 flex items-center gap-2"><Users className="h-4 w-4" />Users</Link>}
            {user ? (
              <Button variant="outline" onClick={() => { setOpen(false); handleSignOut(); }} className="w-full gap-2 mt-2">
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            ) : (
              <Button asChild className="w-full mt-2 bg-primary text-primary-foreground">
                <Link to="/auth" onClick={() => setOpen(false)}>Get Started</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
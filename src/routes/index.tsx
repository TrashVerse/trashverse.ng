import { createFileRoute } from "@tanstack/react-router";
import { Recycle, Truck, Wallet, BarChart3, Leaf, CheckCircle2, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBins from "@/assets/hero-bins.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrashVerse — Turning Today's Waste into Tomorrow's Wealth" },
      { name: "description", content: "TrashVerse is revolutionizing recycling through smart technology, bridging waste management and financial inclusion." },
      { property: "og:title", content: "TrashVerse — Eco-Credits for Waste Management" },
      { property: "og:description", content: "Earn digital rewards for every kilogram of waste recycled through our platform." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <CoreSolutions />
        <WhyUs />
        <JoinTeam />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-primary">
          <Recycle className="h-7 w-7" />
          <span className="text-2xl font-bold tracking-tight">TrashVerse</span>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-foreground/80">
          <a href="#services" className="hover:text-primary transition">Services</a>
          <a href="#why" className="hover:text-primary transition">Why Us</a>
          <a href="#team" className="hover:text-primary transition">Join Team</a>
          <a href="#contact" className="hover:text-primary transition">Contact</a>
        </nav>
        <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-hero-bg">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            Turning Today's <span className="text-primary">Waste</span> into Tomorrow's Wealth.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg">
            TrashVerse is revolutionizing recycling through smart technology. We bridge the gap between waste management and financial inclusion for a sustainable ecosystem.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground px-7 h-12">Schedule Pickup</Button>
            <Button size="lg" variant="outline" className="rounded-md border-2 border-primary text-primary hover:bg-primary/10 px-7 h-12">Learn More</Button>
          </div>
        </div>
        <div className="relative">
          <img src={heroBins} alt="Colorful recycling bins" width={1280} height={960} className="rounded-2xl shadow-xl w-full h-auto object-cover" />
          <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-lg p-4 flex items-center gap-3 border border-border">
            <div className="h-10 w-10 rounded-full bg-primary-soft flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Eco Impact</p>
              <p className="text-base font-bold">12.5k Tons Recycled</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoreSolutions() {
  const items = [
    { icon: Truck, title: "Smart Collection", desc: "Scheduled waste pickup using AI-optimized routing to reduce carbon footprint." },
    { icon: Wallet, title: "Eco-Credits", desc: "Earn digital rewards for every kilogram of waste recycled through our platform.", featured: true },
    { icon: BarChart3, title: "Data Insights", desc: "Track your environmental impact and earnings with real-time analytics." },
  ];
  return (
    <section id="services" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Core Solutions</h2>
          <div className="mt-3 mx-auto h-1 w-20 rounded-full bg-primary" />
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.title} className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg transition">
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${it.featured ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"}`}>
                <it.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-bold">{it.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const points = [
    "Local expertise in Nigerian waste ecosystems.",
    "Seamless integration with mobile payment platforms.",
    "Real-time community impact tracking.",
  ];
  return (
    <section id="why" className="bg-dark-section text-dark-section-foreground">
      <div className="mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-2xl md:text-3xl italic font-semibold text-primary leading-snug">
            "The greatest threat to our planet is the belief that someone else will save it."
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold">Why TrashVerse?</h2>
          <ul className="mt-6 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-base text-dark-section-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function JoinTeam() {
  return (
    <section id="team" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Join the Green Revolution</h2>
          <p className="mt-4 text-muted-foreground">
            We are looking for passionate individuals to help us scale our impact across Abia State and beyond.
          </p>
        </div>
        <div className="mt-12 bg-primary-soft rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-secondary-foreground">We are hiring Field Supervisors!</h3>
            <p className="mt-2 text-muted-foreground">Help manage collection hubs and lead community outreach programs.</p>
          </div>
          <Button size="lg" className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 whitespace-nowrap">View Openings</Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-3 gap-10">
        <div>
          <a href="#" className="flex items-center gap-2 text-primary">
            <Recycle className="h-6 w-6" />
            <span className="text-xl font-bold">TrashVerse</span>
          </a>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Transforming waste management into a profitable and sustainable experience for everyone.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-widest text-foreground/80">QUICK LINKS</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary">Partnerships</a></li>
            <li><a href="#" className="hover:text-primary">Media Kit</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-widest text-foreground/80">CONTACT US</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Abia State, Nigeria</li>
            <li>hello@trashverse.com</li>
          </ul>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Twitter" className="hover:text-primary"><Twitter className="h-5 w-5" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-primary"><Linkedin className="h-5 w-5" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TrashVerse Inc. All rights reserved.
      </div>
    </footer>
  );
}
    </div>
  );
}

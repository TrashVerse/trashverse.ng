import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Truck, Wallet, BarChart3, Leaf, CheckCircle2, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import transformationVideo from "../../public/hero-explainer.mp4.asset.json";
import logo from "@/assets/logo.png";

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
      <SiteHeader />
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

function Hero() {
  return (
    <section className="bg-hero-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 md:py-28 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            Turning Today's <span className="text-primary">Waste</span> into Tomorrow's Wealth.
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-lg">
            TrashVerse is revolutionizing recycling through smart technology. We bridge the gap between waste management and financial inclusion for a sustainable ecosystem.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Button asChild size="lg" className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-7 h-12">
              <Link to="/request-pickup">Schedule Pickup</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-md border-2 border-primary text-primary hover:bg-primary/10 px-6 sm:px-7 h-12">
              <Link to="/" hash="services">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <video
            src={transformationVideo.url}
            autoPlay
            loop
            muted
            playsInline
            className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-video bg-muted"
            aria-label="How TrashVerse turns recyclable waste into eco-credits"
          />
          <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 bg-card rounded-xl shadow-lg p-3 sm:p-4 flex items-center gap-3 border border-border">
            <div className="h-10 w-10 rounded-full bg-primary-soft flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Eco Impact</p>
              <p className="text-sm sm:text-base font-bold">12.5k Tons Recycled</p>
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
    <section id="services" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Our Core Solutions</h2>
          <div className="mt-3 mx-auto h-1 w-20 rounded-full bg-primary" />
        </div>
        <div className="mt-10 sm:mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {items.map((it) => (
            <div key={it.title} className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition">
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${it.featured ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"}`}>
                <it.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 sm:mt-6 text-lg sm:text-xl font-bold">{it.title}</h3>
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <p className="text-xl sm:text-2xl md:text-3xl italic font-semibold text-primary leading-snug">
            "The greatest threat to our planet is the belief that someone else will save it."
          </p>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Why TrashVerse?</h2>
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
    <section id="team" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Join the Green Revolution</h2>
          <p className="mt-4 text-muted-foreground">
            We are looking for passionate individuals to help us scale our impact across Abia State and beyond.
          </p>
        </div>
        <div className="mt-10 sm:mt-12 bg-primary-soft rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-secondary-foreground">We are hiring Field Agents!</h3>
            <p className="mt-2 text-muted-foreground">Help manage collection hubs and lead community outreach programs.</p>
          </div>
          <Button size="lg" className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 whitespace-nowrap w-full md:w-auto">View Openings</Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
        <div>
          <a href="#" className="flex items-center gap-2 text-primary">
            <img src={logo} alt="TrashVerse" className="h-8 w-8 object-contain" />
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
            <a href="https://x.com/trash_verse" target="_blank" rel="noreferrer" aria-label="X" className="hover:text-primary">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M18.244 2H21l-6.52 7.45L22 22h-6.78l-4.77-6.24L4.8 22H2.04l6.98-7.98L2 2h6.91l4.31 5.7L18.244 2Zm-1.19 18h1.87L7.04 4H5.05l12.004 16Z"/></svg>
            </a>
            <a href="https://www.facebook.com/share/1Bjg2pjWDa/?mibextid=wwXlfr" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
            <a href="https://whatsapp.com/channel/0029vb7CXGG5PO141uiKmm0yap" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-primary">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .18 5.32.18 11.87c0 2.09.55 4.13 1.6 5.93L0 24l6.34-1.66a11.84 11.84 0 0 0 5.7 1.45h.01c6.55 0 11.87-5.32 11.87-11.87 0-3.17-1.23-6.15-3.4-8.44ZM12.05 21.5h-.01a9.62 9.62 0 0 1-4.9-1.34l-.35-.21-3.76.98 1-3.67-.23-.38a9.6 9.6 0 0 1-1.47-5.01c0-5.31 4.32-9.63 9.63-9.63 2.57 0 4.99 1 6.8 2.82a9.55 9.55 0 0 1 2.83 6.81c0 5.31-4.32 9.63-9.54 9.63Zm5.54-7.21c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.59-.49-.5-.68-.51l-.58-.01c-.2 0-.52.07-.8.37-.28.3-1.05 1.02-1.05 2.5 0 1.47 1.08 2.89 1.23 3.09.15.2 2.12 3.24 5.13 4.55.72.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.79-.73 2.04-1.43.25-.7.25-1.31.18-1.43-.07-.13-.27-.2-.57-.35Z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@trash_verse" target="_blank" rel="noreferrer" aria-label="TikTok" className="hover:text-primary">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.78 4.78 0 0 1-1.84-.07Z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TrashVerse Inc. All rights reserved.
      </div>
    </footer>
  );
}

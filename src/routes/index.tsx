import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Recycle, Truck, Wallet, BarChart3, Leaf, CheckCircle2, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import transformationVideo from "../../public/transformation.mp4.asset.json";

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
            aria-label="Transformation from polluted to clean Nigerian environment"
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
            <h3 className="text-xl sm:text-2xl font-bold text-secondary-foreground">We are hiring Field Supervisors!</h3>
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

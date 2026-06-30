import Link from 'next/link';
import { Building2, ClipboardCheck, Camera, BarChart3 } from 'lucide-react';
import Header from '../components/Header';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-12">
        <section className="rounded-3xl bg-gradient-to-br from-caliber-navy to-caliber-blue text-white p-10 md:p-16">
          <p className="font-bold tracking-widest text-sm opacity-80">CALIBER ASSET INTELLIGENCE</p>
          <h1 className="text-4xl md:text-6xl font-black mt-4 max-w-4xl">
            Remote Property Assessment for Hotel PM and Asset Stabilization
          </h1>
          <p className="mt-6 text-lg max-w-3xl opacity-90">
            Submit property condition details, operational constraints, photos, and videos so Caliber can evaluate PM readiness, expected production cadence, recommended scope, and pricing strategy before deployment.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="btn-primary bg-white text-caliber-navy hover:bg-caliber-light" href="/assessment">
              Start Assessment
            </Link>
            <Link className="btn-secondary bg-transparent text-white border-white hover:bg-white/10" href="/admin">
              Internal Dashboard
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-5 mt-8">
          <Feature icon={<ClipboardCheck />} title="PM Readiness Score" text="Score property condition and deployment risk before pricing." />
          <Feature icon={<BarChart3 />} title="Production Estimate" text="Estimate rooms per day based on condition and room release." />
          <Feature icon={<Camera />} title="Photo Standards" text="Collect consistent room, bathroom, VTAC, furniture, and door photos." />
          <Feature icon={<Building2 />} title="Program Recommendation" text="Separate Standard PM, Deferred PM, and Revitalization Review." />
        </section>
      </main>
    </>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="card p-6">
      <div className="text-caliber-blue">{icon}</div>
      <h3 className="font-black text-lg mt-4 text-caliber-navy">{title}</h3>
      <p className="text-slate-600 mt-2">{text}</p>
    </div>
  );
}

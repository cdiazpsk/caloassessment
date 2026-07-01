import Link from 'next/link';
import Image from 'next/image';
import { Building2, ClipboardCheck, Camera, BarChart3 } from 'lucide-react';
import Header from '../components/Header';

const assessmentId = crypto.randomUUID();

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-12">
        <section className="rounded-3xl bg-white border border-slate-200 shadow-sm p-10 md:p-16">
          <div className="max-w-4xl">
            <Image
              src="/caliber-logo.jpg"
              alt="Caliber Lodging"
              width={420}
              height={80}
              className="mb-8 h-auto w-full max-w-[420px]"
              priority
            />

            <p className="font-bold tracking-widest text-sm text-caliber-blue">
              CALIBER ASSET INTELLIGENCE
            </p>

            <h1 className="text-4xl md:text-6xl font-black mt-4 max-w-4xl text-caliber-navy">
              Remote Property Assessment for Hotel PM and Asset Stabilization
            </h1>

            <p className="mt-6 text-lg max-w-3xl text-slate-700 leading-relaxed">
              Helping hotel owners and operators evaluate guestroom condition, expected production cadence,
              recommended scope, and budgetary pricing before preventative maintenance deployment.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3 max-w-2xl text-slate-700">
              <CheckItem text="PM Readiness Score" />
              <CheckItem text="Estimated Production Rate" />
              <CheckItem text="Recommended Scope" />
              <CheckItem text="Budgetary Pricing" />
              <CheckItem text="Asset Preservation Opportunities" />
              <CheckItem text="Photo and Video Review" />
            </div>

            <p className="mt-8 text-sm font-semibold text-slate-500">
              Estimated completion time: 15 minutes
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link className="btn-primary" href="/assessment">
                Start Assessment
              </Link>
              <Link className="btn-secondary" href="/admin">
                Internal Dashboard
              </Link>
            </div>
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

function CheckItem({ text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-caliber-light text-caliber-blue text-xs font-black">
        ✓
      </span>
      <span>{text}</span>
    </div>
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

const { error } = await supabase
  .from('assessments')
  .insert({
    id: assessmentId,
    ...payload
  });

if (error) throw error;

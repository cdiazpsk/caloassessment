'use client';

import { useMemo, useState } from 'react';
import { createBrowserSupabaseClient } from '../../lib/supabaseClient';
import { calculateReadinessScore, estimateProduction, recommendPricing, recommendProgram } from '../../lib/scoring';
import Header from '../../components/Header';
import { Camera, CheckCircle2, ClipboardCheck, Upload } from 'lucide-react';

const initial = {
  property_name: '',
  management_company: '',
  owner_company: '',
  brand: '',
  property_city: '',
  property_state: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  total_rooms: '',
  year_built: '',
  last_renovated_year: '',
  last_pm_year: '',
  average_occupancy: '',
  rooms_out_of_order: '',
  rooms_available_per_day: '',
  floor_release_available: false,
  materials_owner_supplied: false,
  comp_rooms_available: false,
  meals_provided: false,
  preferred_work_schedule: '',
  room_release_notes: '',
  paint_score: 3,
  caulk_score: 3,
  furniture_score: 3,
  hvac_score: 3,
  plumbing_score: 3,
  doors_score: 3,
  logistics_score: 3,
  room_release_score: 3,
  top_issues: [],
  notes: ''
};

const issues = [
  'Heavy caulking needed',
  'Widespread paint touch-ups',
  'Corner-to-corner paint needed',
  'Furniture touch-ups',
  'VTAC/PTAC cleaning',
  'Drain issues',
  'Entry door painting',
  'Grout refresh',
  'Room release constraints',
  'High occupancy constraints'
];

const fileLabels = [
  'Best room overview',
  'Average room overview',
  'Worst room overview',
  'Bathroom caulk close-up',
  'Vanity area',
  'VTAC/PTAC unit',
  'Furniture damage',
  'Entry door',
  'Kitchenette or extended stay area',
  'Video walkthrough'
];

export default function AssessmentPage() {
  const [form, setForm] = useState(initial);
  const [files, setFiles] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const score = useMemo(() => calculateReadinessScore(form), [form]);
  const production = useMemo(() => estimateProduction(score, form), [score, form]);
  const program = useMemo(() => recommendProgram(score), [score]);
  const pricing = useMemo(() => recommendPricing(score, production), [score, production]);

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function toggleIssue(issue) {
    setForm(prev => ({
      ...prev,
      top_issues: prev.top_issues.includes(issue)
        ? prev.top_issues.filter(i => i !== issue)
        : [...prev.top_issues, issue]
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Submitting assessment...' });

    try {
      const supabase = createBrowserSupabaseClient();

      const payload = {
        ...form,
        total_rooms: Number(form.total_rooms),
        year_built: form.year_built ? Number(form.year_built) : null,
        last_renovated_year: form.last_renovated_year ? Number(form.last_renovated_year) : null,
        last_pm_year: form.last_pm_year ? Number(form.last_pm_year) : null,
        rooms_out_of_order: form.rooms_out_of_order ? Number(form.rooms_out_of_order) : null,
        rooms_available_per_day: form.rooms_available_per_day ? Number(form.rooms_available_per_day) : null,
        readiness_score: score,
        estimated_rooms_per_day: production,
        recommended_program: program,
        recommended_pricing: pricing
      };

      const { data, error } = await supabase.from('assessments').insert(payload).select('id').single();
      if (error) throw error;

      const assessmentId = data.id;

      for (const [label, fileList] of Object.entries(files)) {
        for (const file of fileList) {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const path = `${assessmentId}/${label.replace(/[^a-zA-Z0-9._-]/g, '_')}_${Date.now()}_${safeName}`;

          const upload = await supabase.storage.from('assessment-media').upload(path, file);
          if (upload.error) throw upload.error;

          const row = await supabase.from('assessment_files').insert({
            assessment_id: assessmentId,
            file_label: label,
            file_name: file.name,
            file_path: path,
            file_type: file.type,
            file_size: file.size
          });
          if (row.error) throw row.error;
        }
      }

      setStatus({ type: 'success', message: 'Assessment submitted. Caliber will review and follow up.' });
      setForm(initial);
      setFiles({});
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong.' });
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8">
          <p className="font-bold text-caliber-blue tracking-wide">REMOTE PROPERTY ASSESSMENT</p>
          <h1 className="text-4xl font-black text-caliber-navy mt-2">Caliber Asset Assessment</h1>
          <p className="text-slate-600 mt-3 max-w-3xl">
            Complete this assessment to help Caliber determine PM readiness, likely production cadence, recommended scope, pricing range, and add-on opportunities.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <Card title="1. Property Information">
            <Grid>
              <Field label="Property Name" required value={form.property_name} onChange={v => update('property_name', v)} />
              <Field label="Management Company" value={form.management_company} onChange={v => update('management_company', v)} />
              <Field label="Owner Company" value={form.owner_company} onChange={v => update('owner_company', v)} />
              <Field label="Brand" value={form.brand} onChange={v => update('brand', v)} />
              <Field label="City" value={form.property_city} onChange={v => update('property_city', v)} />
              <Field label="State" value={form.property_state} onChange={v => update('property_state', v)} />
              <Field label="Total Rooms" type="number" required value={form.total_rooms} onChange={v => update('total_rooms', v)} />
              <Field label="Last Renovated Year" type="number" value={form.last_renovated_year} onChange={v => update('last_renovated_year', v)} />
              <Field label="Last PM Year" type="number" value={form.last_pm_year} onChange={v => update('last_pm_year', v)} />
              <Field label="Average Occupancy" value={form.average_occupancy} onChange={v => update('average_occupancy', v)} />
            </Grid>
          </Card>

          <Card title="2. Contact and Operations">
            <Grid>
              <Field label="Contact Name" required value={form.contact_name} onChange={v => update('contact_name', v)} />
              <Field label="Contact Email" type="email" required value={form.contact_email} onChange={v => update('contact_email', v)} />
              <Field label="Contact Phone" value={form.contact_phone} onChange={v => update('contact_phone', v)} />
              <Field label="Rooms Available Per Day" type="number" value={form.rooms_available_per_day} onChange={v => update('rooms_available_per_day', v)} />
            </Grid>

            <div className="grid md:grid-cols-4 gap-4 mt-5">
              <Toggle label="Floor Release Available" value={form.floor_release_available} onChange={v => update('floor_release_available', v)} />
              <Toggle label="Owner Supplies Materials" value={form.materials_owner_supplied} onChange={v => update('materials_owner_supplied', v)} />
              <Toggle label="Comp Rooms Available" value={form.comp_rooms_available} onChange={v => update('comp_rooms_available', v)} />
              <Toggle label="Meals Provided" value={form.meals_provided} onChange={v => update('meals_provided', v)} />
            </div>

            <TextArea label="Room Release Notes" value={form.room_release_notes} onChange={v => update('room_release_notes', v)} />
            <TextArea label="Preferred Work Schedule" value={form.preferred_work_schedule} onChange={v => update('preferred_work_schedule', v)} />
          </Card>

          <Card title="3. Condition Ratings">
            <p className="text-slate-600 mb-4">Score each category from 1 poor to 5 good.</p>
            <div className="grid md:grid-cols-2 gap-5">
              {['paint','caulk','furniture','hvac','plumbing','doors','logistics','room_release'].map(key => (
                <Score key={key} label={key.replace('_', ' ')} value={form[`${key}_score`]} onChange={v => update(`${key}_score`, Number(v))} />
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-caliber-light p-5">
              <p className="font-black text-caliber-navy">Preliminary Readiness Score: {score}/100</p>
              <p className="text-slate-700">Recommended Program: {program}</p>
              <p className="text-slate-700">Estimated Production: {production} rooms/day</p>
              <p className="text-slate-700">Pricing Guidance: {pricing}</p>
            </div>
          </Card>

          <Card title="4. Top Issues">
            <div className="flex flex-wrap gap-2">
              {issues.map(issue => (
                <button key={issue} type="button" onClick={() => toggleIssue(issue)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${form.top_issues.includes(issue) ? 'bg-caliber-navy text-white border-caliber-navy' : 'bg-white text-slate-700 border-slate-300'}`}>
                  {issue}
                </button>
              ))}
            </div>
          </Card>

          <Card title="5. Photos and Videos">
            <p className="text-slate-600 mb-4">Upload a best room, average room, worst room, and close-ups of the major PM categories.</p>
            <div className="grid md:grid-cols-2 gap-5">
              {fileLabels.map(label => (
                <label key={label} className="rounded-2xl border border-dashed border-slate-300 p-4 bg-slate-50">
                  <div className="flex items-center gap-2 font-bold text-caliber-navy"><Camera size={18} /> {label}</div>
                  <input className="mt-3 w-full" type="file" multiple accept="image/*,video/*"
                    onChange={e => setFiles(prev => ({ ...prev, [label]: Array.from(e.target.files || []) }))} />
                </label>
              ))}
            </div>
          </Card>

          <Card title="6. Additional Notes">
            <TextArea label="Notes" value={form.notes} onChange={v => update('notes', v)} />
          </Card>

          <button className="btn-primary w-full" disabled={status.type === 'loading'}>
            <Upload className="mr-2" size={18} />
            {status.type === 'loading' ? 'Submitting...' : 'Submit Assessment'}
          </button>

          {status.message && (
            <div className={`rounded-2xl p-4 font-semibold ${status.type === 'success' ? 'bg-green-50 text-green-700' : status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-700'}`}>
              {status.type === 'success' && <CheckCircle2 className="inline mr-2" size={18} />}
              {status.message}
            </div>
          )}
        </form>
      </main>
    </>
  );
}

function Card({ title, children }) {
  return (
    <section className="card p-6">
      <h2 className="text-xl font-black text-caliber-navy mb-5">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }) {
  return <div className="grid md:grid-cols-2 gap-5">{children}</div>;
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  return (
    <label>
      <span className="label">{label}{required ? ' *' : ''}</span>
      <input className="input" type={type} required={required} value={value} onChange={e => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="block mt-5">
      <span className="label">{label}</span>
      <textarea className="input min-h-[120px]" value={value} onChange={e => onChange(e.target.value)} />
    </label>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`rounded-xl border p-4 text-left font-bold ${value ? 'bg-caliber-light border-caliber-blue text-caliber-navy' : 'bg-white border-slate-300 text-slate-600'}`}>
      {value ? 'Yes' : 'No'}<br />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function Score({ label, value, onChange }) {
  return (
    <label>
      <span className="label capitalize">{label}: {value}</span>
      <input type="range" min="1" max="5" value={value} onChange={e => onChange(e.target.value)} />
    </label>
  );
}

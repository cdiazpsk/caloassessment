import Header from '../../../components/Header';
import { createClient } from '@supabase/supabase-js';

async function getAssessment(id) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return { assessment: null, files: [] };

  const supabase = createClient(url, serviceKey);

  const { data: assessment } = await supabase.from('assessments').select('*').eq('id', id).single();
  const { data: files } = await supabase.from('assessment_files').select('*').eq('assessment_id', id);

  return { assessment, files: files || [] };
}

export default async function AssessmentDetailPage({ params }) {
  const { assessment, files } = await getAssessment(params.id);

  if (!assessment) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-5xl px-5 py-10">Assessment not found.</main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8">
          <p className="font-bold text-caliber-blue tracking-wide">ASSESSMENT REVIEW</p>
          <h1 className="text-4xl font-black text-caliber-navy mt-2">{assessment.property_name}</h1>
          <p className="text-slate-600 mt-3">{assessment.brand} | {assessment.property_city}, {assessment.property_state}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-6">
          <Metric label="Score" value={`${assessment.readiness_score}/100`} />
          <Metric label="Program" value={assessment.recommended_program} />
          <Metric label="Production" value={`${assessment.estimated_rooms_per_day}/day`} />
          <Metric label="Pricing" value={assessment.recommended_pricing} />
        </div>

        <section className="card p-6 mb-6">
          <h2 className="text-xl font-black text-caliber-navy mb-4">Property Information</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <Info label="Management" value={assessment.management_company} />
            <Info label="Owner" value={assessment.owner_company} />
            <Info label="Total Rooms" value={assessment.total_rooms} />
            <Info label="Last Renovated" value={assessment.last_renovated_year} />
            <Info label="Contact" value={`${assessment.contact_name} | ${assessment.contact_email}`} />
            <Info label="Rooms Available Per Day" value={assessment.rooms_available_per_day} />
          </div>
        </section>

        <section className="card p-6 mb-6">
          <h2 className="text-xl font-black text-caliber-navy mb-4">Condition Scores</h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            {['paint','caulk','furniture','hvac','plumbing','doors','logistics','room_release'].map(key => (
              <Metric key={key} label={key.replace('_', ' ')} value={assessment[`${key}_score`]} />
            ))}
          </div>
        </section>

        <section className="card p-6 mb-6">
          <h2 className="text-xl font-black text-caliber-navy mb-4">Top Issues</h2>
          <div className="flex flex-wrap gap-2">
            {(assessment.top_issues || []).map(issue => (
              <span key={issue} className="rounded-full bg-caliber-light px-4 py-2 text-sm font-semibold text-caliber-navy">{issue}</span>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-xl font-black text-caliber-navy mb-4">Uploaded Files</h2>
          <p className="text-slate-600 mb-3">
            Files are stored privately in Supabase Storage. Use the Supabase dashboard or future signed URL feature to review media.
          </p>
          <ul className="space-y-2">
            {files.map(file => (
              <li key={file.id} className="rounded-xl bg-slate-50 p-3">
                <strong>{file.file_label || 'File'}:</strong> {file.file_name}
                <div className="text-xs text-slate-500">{file.file_path}</div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

function Metric({ label, value }) {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-xl font-black text-caliber-navy mt-1">{value || 'N/A'}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="font-bold text-slate-500">{label}</div>
      <div className="text-slate-800">{value || 'N/A'}</div>
    </div>
  );
}

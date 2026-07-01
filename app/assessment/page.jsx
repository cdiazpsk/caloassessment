import Header from '../../components/Header';
import { createClient } from '@supabase/supabase-js';

async function getAssessments() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    return { assessments: [], error: 'Missing NEXT_PUBLIC_SUPABASE_URL in Netlify.' };
  }

  if (!serviceKey) {
    return { assessments: [], error: 'Missing SUPABASE_SERVICE_ROLE_KEY in Netlify.' };
  }

  const supabase = createClient(url, serviceKey);

  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return { assessments: [], error: error.message };
  }

  return { assessments: data || [], error: null };
}

export default async function AdminPage() {
  const { assessments, error } = await getAssessments();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-8">
          <p className="font-bold text-caliber-blue tracking-wide">INTERNAL DASHBOARD</p>
          <h1 className="text-4xl font-black text-caliber-navy mt-2">Assessment Pipeline</h1>
          <p className="text-slate-600 mt-3">Review submitted remote property assessments.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-5 text-red-700 font-semibold">
            Admin dashboard error: {error}
          </div>
        )}

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-4">Property</th>
                <th className="text-left p-4">Brand</th>
                <th className="text-left p-4">Rooms</th>
                <th className="text-left p-4">Score</th>
                <th className="text-left p-4">Program</th>
                <th className="text-left p-4">Production</th>
                <th className="text-left p-4">Pricing</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map(a => (
                <tr key={a.id} className="border-t border-slate-200">
                  <td className="p-4 font-bold text-caliber-navy">
                    <a href={`/admin/${a.id}`}>{a.property_name}</a>
                    <div className="text-xs font-normal text-slate-500">{a.property_city}, {a.property_state}</div>
                  </td>
                  <td className="p-4">{a.brand || 'N/A'}</td>
                  <td className="p-4">{a.total_rooms || 'N/A'}</td>
                  <td className="p-4">{a.readiness_score || 'N/A'}</td>
                  <td className="p-4">{a.recommended_program || 'N/A'}</td>
                  <td className="p-4">{a.estimated_rooms_per_day || 'N/A'}/day</td>
                  <td className="p-4">{a.recommended_pricing || 'N/A'}</td>
                  <td className="p-4">{a.status || 'submitted'}</td>
                </tr>
              ))}

              {!error && assessments.length === 0 && (
                <tr>
                  <td className="p-6 text-slate-500" colSpan="8">
                    No assessments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

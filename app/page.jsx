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

    const assessmentId = crypto.randomUUID();

    const { error } = await supabase
      .from('assessments')
      .insert({
        id: assessmentId,
        ...payload
      });

    if (error) throw error;

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

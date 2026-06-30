export function calculateReadinessScore(form) {
  const scoreFields = [
    'paint_score',
    'caulk_score',
    'furniture_score',
    'hvac_score',
    'plumbing_score',
    'doors_score',
    'logistics_score',
    'room_release_score'
  ];

  const scores = scoreFields.map((field) => Number(form[field] || 3));
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  let score = Math.round((avg / 5) * 100);

  const lastRenovated = Number(form.last_renovated_year || 0);
  const currentYear = new Date().getFullYear();

  if (lastRenovated && currentYear - lastRenovated >= 6) score -= 5;
  if (Number(form.rooms_out_of_order || 0) > 5) score -= 5;
  if ((form.top_issues || []).includes('Heavy caulking needed')) score -= 5;
  if ((form.top_issues || []).includes('Widespread paint touch-ups')) score -= 5;
  if ((form.top_issues || []).includes('Room release constraints')) score -= 8;

  return Math.max(0, Math.min(100, score));
}

export function estimateProduction(score, form) {
  const release = Number(form.rooms_available_per_day || 0);

  let expected = 10;

  if (score >= 80) expected = 10;
  else if (score >= 65) expected = 8;
  else expected = 6;

  if (release > 0) expected = Math.min(expected, release);

  return expected;
}

export function recommendProgram(score) {
  if (score >= 80) return 'Standard PM';
  if (score >= 65) return 'Deferred PM';
  return 'Revitalization Review';
}

export function recommendPricing(score, production) {
  if (score >= 80 && production >= 9) return '$175 to $185 per room';
  if (score >= 65 && production >= 8) return '$195 to $225 per room';
  return 'Custom revitalization pricing recommended';
}

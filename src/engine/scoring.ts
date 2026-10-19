import type { Category, Finding, Severity } from "../shared/types";

const SEVERITY_WEIGHTS: Record<Severity, number> = {
  low: 1,
  medium: 3,
  high: 7,
  critical: 15,
};

// Budget each category can contribute to the total score.
// Sum of all caps = 175 (the denominator for the 0-100 composite).
const CATEGORY_CAPS: Record<Category, number> = {
  data_sharing: 20,
  user_rights: 20,
  security_posture: 18,
  dispute_resolution: 16,
  data_collection: 14,
  data_retention: 14,
  consent_model: 12,
  cross_border: 12,
  profiling_automation: 12,
  children_minors: 12,
  change_terms: 10,
  dark_patterns: 8,
};

const MAX_TOTAL = Object.values(CATEGORY_CAPS).reduce((a, b) => a + b, 0); // 168

export function computeScores(
  findings: Finding[]
): { score: number; category_scores: Record<Category, number> } {
  const rawByCategory: Partial<Record<Category, number>> = {};

  for (const finding of findings) {
    rawByCategory[finding.category] =
      (rawByCategory[finding.category] ?? 0) + SEVERITY_WEIGHTS[finding.severity];
  }

  const category_scores = {} as Record<Category, number>;
  let totalCapped = 0;

  for (const category of Object.keys(CATEGORY_CAPS) as Category[]) {
    const raw = rawByCategory[category] ?? 0;
    const cap = CATEGORY_CAPS[category] ?? 10;
    const contribution = Math.min(cap, raw);
    // Expose per-category score as 0-100 normalised against its own cap
    category_scores[category] = raw === 0 ? 0 : Math.min(100, Math.round((raw / cap) * 100));
    totalCapped += contribution;
  }

  const score = Math.min(100, Math.round((totalCapped / MAX_TOTAL) * 100));
  return { score, category_scores };
}

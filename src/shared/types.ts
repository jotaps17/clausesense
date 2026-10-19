export type Severity = "low" | "medium" | "high" | "critical";

export type Jurisdiction = "US" | "EU" | "BR";

export type Category =
  | "data_collection"
  | "data_sharing"
  | "data_retention"
  | "user_rights"
  | "consent_model"
  | "security_posture"
  | "dispute_resolution"
  | "change_terms"
  | "children_minors"
  | "cross_border"
  | "profiling_automation"
  | "dark_patterns";

export interface Finding {
  rule_id: string;
  rule_version: string;
  category: Category;
  severity: Severity;
  jurisdictions: Jurisdiction[];
  title: string;
  explanation: string;
  excerpt: string;
  excerpt_offset: [number, number];
}

export interface JurisdictionScores {
  US: number;
  EU: number;
  BR: number;
}

export interface Report {
  id: string;
  created_at: string;
  url: string;
  title: string;
  language: string;
  detected_jurisdictions: JurisdictionScores;
  score: number;
  category_scores: Record<Category, number>;
  findings: Finding[];
  engine_version: string;
  rule_bundle_version: string;
}

export interface DocumentMeta {
  url: string;
  title: string;
  language: string;
}

export interface I18nStrings {
  en: string;
  pt: string;
  es: string;
}

export interface RulePattern {
  type: "regex" | "phrase" | "proximity";
  value: RegExp | string;
  proximityTo?: string;
  withinWords?: number;
}

export interface Rule {
  id: string;
  version: string;
  jurisdiction: Jurisdiction[];
  category: Category;
  severity: Severity;
  title_i18n: I18nStrings;
  explanation_i18n: I18nStrings;
  patterns: RulePattern[];
  requires?: string[];
  negated_by?: RegExp[];
}

export type ScanStatus =
  | "idle"
  | "extracting"
  | "analyzing"
  | "done"
  | "error"
  | "no_document";

export interface ScanResult {
  status: ScanStatus;
  report?: Report;
  error?: string;
}

export interface UserPreferences {
  language: "en" | "pt" | "es";
  theme: "light" | "dark" | "system";
  verbosity: "compact" | "full";
  maxStoredReports: number;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: "en",
  theme: "system",
  verbosity: "compact",
  maxStoredReports: 5,
};

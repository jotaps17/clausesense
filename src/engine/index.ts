import type { DocumentMeta, Finding, Jurisdiction, Report, Rule } from "../shared/types";
import { detectJurisdictions, JURISDICTION_THRESHOLD } from "./jurisdictions";
import { computeScores } from "./scoring";
import { v4 as uuidv4 } from "./uuid";

// Rule bundles
import { rules as commonDataSharing } from "./rules/common/data_sharing";
import { rules as commonDataCollection } from "./rules/common/data_collection";
import { rules as commonDataRetention } from "./rules/common/data_retention";
import { rules as commonConsent } from "./rules/common/consent_model";
import { rules as commonDispute } from "./rules/common/dispute_resolution";
import { rules as commonChangeTerms } from "./rules/common/change_terms";
import { rules as commonSecurity } from "./rules/common/security_posture";
import { rules as commonDarkPatterns } from "./rules/common/dark_patterns";
import { rules as usRights } from "./rules/us/user_rights";
import { rules as usChildren } from "./rules/us/children_minors";
import { rules as euRights } from "./rules/eu/user_rights";
import { rules as euCrossBorder } from "./rules/eu/cross_border";
import { rules as euProfiling } from "./rules/eu/profiling";
import { rules as brLgpd } from "./rules/br/lgpd";

export const ENGINE_VERSION = "0.1.0";
export const RULE_BUNDLE_VERSION = "0.1.0";

const COMMON_RULES: Rule[] = [
  ...commonDataSharing,
  ...commonDataCollection,
  ...commonDataRetention,
  ...commonConsent,
  ...commonDispute,
  ...commonChangeTerms,
  ...commonSecurity,
  ...commonDarkPatterns,
];

const JURISDICTION_RULES: Record<Jurisdiction, Rule[]> = {
  US: [...usRights, ...usChildren],
  EU: [...euRights, ...euCrossBorder, ...euProfiling],
  BR: [...brLgpd],
};

export function runEngine(text: string, meta: DocumentMeta, locale = "en"): Report {
  const normalized = normalizeText(text);
  const sentences = tokenizeSentences(normalized);
  const jurisdictions = detectJurisdictions(normalized, meta.url);

  const activeJurisdictions = (Object.keys(jurisdictions) as Jurisdiction[]).filter(
    (j) => jurisdictions[j] >= JURISDICTION_THRESHOLD
  );

  const rulesToRun: Rule[] = [...COMMON_RULES];
  for (const j of activeJurisdictions) {
    rulesToRun.push(...(JURISDICTION_RULES[j] ?? []));
  }

  const preconditionsMet = computePreconditions(normalized, rulesToRun);
  const findings: Finding[] = [];

  for (const rule of rulesToRun) {
    if (rule.requires) {
      const allMet = rule.requires.every((req) => preconditionsMet.has(req));
      if (!allMet) continue;
    }

    const result = applyRule(rule, sentences, normalized, locale);
    if (result) findings.push(result);
  }

  const { score, category_scores } = computeScores(findings);

  return {
    id: uuidv4(),
    created_at: new Date().toISOString(),
    url: meta.url,
    title: meta.title,
    language: meta.language,
    detected_jurisdictions: jurisdictions,
    score,
    category_scores,
    findings,
    engine_version: ENGINE_VERSION,
    rule_bundle_version: RULE_BUNDLE_VERSION,
  };
}

function applyRule(
  rule: Rule,
  sentences: { text: string; offset: number }[],
  fullText: string,
  locale: string
): Finding | null {
  for (const sentence of sentences) {
    let matched = false;

    for (const pattern of rule.patterns) {
      if (pattern.type === "regex" && pattern.value instanceof RegExp) {
        if (pattern.value.test(sentence.text)) {
          matched = true;
          break;
        }
      } else if (pattern.type === "phrase" && typeof pattern.value === "string") {
        if (sentence.text.toLowerCase().includes(pattern.value.toLowerCase())) {
          matched = true;
          break;
        }
      }
    }

    if (!matched) continue;

    if (rule.negated_by) {
      const contextStart = Math.max(0, sentence.offset - 200);
      const contextEnd = Math.min(fullText.length, sentence.offset + sentence.text.length + 200);
      const context = fullText.slice(contextStart, contextEnd);

      const negated = rule.negated_by.some((neg) => neg.test(context));
      if (negated) continue;
    }

    const lang = locale.startsWith("pt") ? "pt" : locale.startsWith("es") ? "es" : "en";
    const title = rule.title_i18n[lang] ?? rule.title_i18n.en ?? "";
    const explanation = rule.explanation_i18n[lang] ?? rule.explanation_i18n.en ?? "";

    return {
      rule_id: rule.id,
      rule_version: rule.version,
      category: rule.category,
      severity: rule.severity,
      jurisdictions: rule.jurisdiction,
      title,
      explanation,
      excerpt: sentence.text.trim(),
      excerpt_offset: [sentence.offset, sentence.offset + sentence.text.length],
    };
  }

  return null;
}

function computePreconditions(text: string, rules: Rule[]): Set<string> {
  const met = new Set<string>();
  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      let matches = false;
      if (pattern.type === "regex" && pattern.value instanceof RegExp) {
        matches = pattern.value.test(text);
      } else if (pattern.type === "phrase" && typeof pattern.value === "string") {
        matches = text.toLowerCase().includes(pattern.value.toLowerCase());
      }
      if (matches) {
        met.add(rule.id);
        break;
      }
    }
  }
  return met;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/­/g, "")   // soft hyphens
    .replace(/[​-‍﻿]/g, "") // zero-width chars
    .replace(/[‘’]/g, "'") // curly single quotes
    .replace(/[“”]/g, '"') // curly double quotes
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeSentences(text: string): { text: string; offset: number }[] {
  const results: { text: string; offset: number }[] = [];
  const sentencePattern = /[^.!?\n]+[.!?\n]+/g;
  let match: RegExpExecArray | null;

  while ((match = sentencePattern.exec(text)) !== null) {
    const s = match[0];
    if (s && s.trim().length > 4) {
      results.push({ text: s, offset: match.index });
    }
  }

  // Capture trailing text without a terminal punctuation
  const lastEnd = results.length > 0
    ? (results[results.length - 1]?.offset ?? 0) + (results[results.length - 1]?.text.length ?? 0)
    : 0;
  const trailing = text.slice(lastEnd).trim();
  if (trailing.length > 10) {
    results.push({ text: trailing, offset: lastEnd });
  }

  return results;
}

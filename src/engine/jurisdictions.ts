import type { JurisdictionScores } from "../shared/types";

interface JurisdictionSignal {
  pattern: RegExp | string;
  weight: number;
  jurisdiction: keyof JurisdictionScores;
}

const SIGNALS: JurisdictionSignal[] = [
  // US signals
  { pattern: /california\s+residents?/i, weight: 0.25, jurisdiction: "US" },
  { pattern: /do\s+not\s+sell\s+or\s+share/i, weight: 0.25, jurisdiction: "US" },
  { pattern: /CCPA|CPRA|COPPA|VCDPA/i, weight: 0.30, jurisdiction: "US" },
  { pattern: /united\s+states/i, weight: 0.15, jurisdiction: "US" },
  { pattern: /\$\s*\d|\bUSD\b/i, weight: 0.10, jurisdiction: "US" },
  { pattern: /\.gov\b/, weight: 0.15, jurisdiction: "US" },
  { pattern: /HIPAA|GLBA|FERPA/i, weight: 0.20, jurisdiction: "US" },
  { pattern: /arbitration\s+(association|forum)/i, weight: 0.10, jurisdiction: "US" },

  // EU signals
  { pattern: /\bGDPR\b/i, weight: 0.35, jurisdiction: "EU" },
  { pattern: /\bEEA\b|\bEuropean\s+Economic\s+Area\b/i, weight: 0.25, jurisdiction: "EU" },
  { pattern: /data\s+protection\s+officer/i, weight: 0.25, jurisdiction: "EU" },
  { pattern: /lawful\s+basis/i, weight: 0.25, jurisdiction: "EU" },
  { pattern: /standard\s+contractual\s+clauses|SCCs/i, weight: 0.20, jurisdiction: "EU" },
  { pattern: /ePrivacy\s+Directive/i, weight: 0.20, jurisdiction: "EU" },
  { pattern: /\bEUR\b|€\s*\d/i, weight: 0.10, jurisdiction: "EU" },
  { pattern: /supervisory\s+authority/i, weight: 0.20, jurisdiction: "EU" },
  { pattern: /right\s+to\s+(erasure|be\s+forgotten)/i, weight: 0.15, jurisdiction: "EU" },
  { pattern: /article\s+\d+\s+(of\s+the\s+)?GDPR/i, weight: 0.20, jurisdiction: "EU" },

  // BR signals
  { pattern: /\bLGPD\b/i, weight: 0.40, jurisdiction: "BR" },
  { pattern: /\bANPD\b/i, weight: 0.30, jurisdiction: "BR" },
  { pattern: /titular\s+dos\s+dados/i, weight: 0.30, jurisdiction: "BR" },
  { pattern: /encarregad[oa]/i, weight: 0.25, jurisdiction: "BR" },
  { pattern: /\bBRL\b|R\$\s*\d/i, weight: 0.10, jurisdiction: "BR" },
  { pattern: /Marco\s+Civil\s+da\s+Internet/i, weight: 0.25, jurisdiction: "BR" },
  { pattern: /Lei\s+13\.709/i, weight: 0.35, jurisdiction: "BR" },
  { pattern: /\bBrasil\b|\bBrazil\b/i, weight: 0.10, jurisdiction: "BR" },
  { pattern: /proteção\s+de\s+dados\s+pessoais/i, weight: 0.20, jurisdiction: "BR" },
];

export function detectJurisdictions(text: string, url: string): JurisdictionScores {
  const scores: JurisdictionScores = { US: 0, EU: 0, BR: 0 };

  const tld = extractTLD(url);
  if (tld === "br") scores.BR += 0.30;
  if (tld === "us") scores.US += 0.20;
  if (["de", "fr", "it", "es", "nl", "be", "at", "pl"].includes(tld)) scores.EU += 0.25;

  for (const signal of SIGNALS) {
    const pattern =
      signal.pattern instanceof RegExp
        ? signal.pattern
        : new RegExp(signal.pattern, "i");
    if (pattern.test(text)) {
      scores[signal.jurisdiction] = Math.min(1, scores[signal.jurisdiction] + signal.weight);
    }
  }

  return {
    US: Math.min(1, scores.US),
    EU: Math.min(1, scores.EU),
    BR: Math.min(1, scores.BR),
  };
}

function extractTLD(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split(".");
    return parts[parts.length - 1]?.toLowerCase() ?? "";
  } catch {
    return "";
  }
}

export const JURISDICTION_THRESHOLD = 0.25;

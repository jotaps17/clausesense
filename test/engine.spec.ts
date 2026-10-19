import { runEngine, normalizeText, tokenizeSentences } from "../src/engine/index";
import { detectJurisdictions } from "../src/engine/jurisdictions";
import { computeScores } from "../src/engine/scoring";
import type { Finding } from "../src/shared/types";
import { readFileSync } from "fs";
import { join } from "path";

// normalizeText
describe("normalizeText", () => {
  it("lowercases and collapses whitespace", () => {
    expect(normalizeText("Hello   World")).toBe("hello world");
  });

  it("strips soft hyphens", () => {
    expect(normalizeText("pri­vacy")).toBe("privacy");
  });

  it("unifies curly quotes", () => {
    expect(normalizeText("“hello”")).toBe('"hello"');
  });
});

// tokenizeSentences
describe("tokenizeSentences", () => {
  it("splits on terminal punctuation", () => {
    const sentences = tokenizeSentences("We share your data. We also sell it. Thank you.");
    expect(sentences.length).toBeGreaterThanOrEqual(3);
  });

  it("records offsets correctly", () => {
    const text = "First sentence. Second sentence.";
    const sentences = tokenizeSentences(text);
    for (const s of sentences) {
      expect(text.slice(s.offset, s.offset + s.text.length)).toBe(s.text);
    }
  });
});

// Jurisdiction detection
describe("detectJurisdictions", () => {
  it("detects US from CCPA reference", () => {
    const scores = detectJurisdictions("California residents have rights under CCPA.", "https://example.com");
    expect(scores.US).toBeGreaterThan(0.25);
  });

  it("detects EU from GDPR reference", () => {
    const scores = detectJurisdictions("We process data under GDPR and provide a lawful basis.", "https://example.de");
    expect(scores.EU).toBeGreaterThan(0.25);
  });

  it("detects BR from LGPD reference", () => {
    const scores = detectJurisdictions("Tratamos seus dados de acordo com a LGPD (Lei 13.709).", "https://example.com.br");
    expect(scores.BR).toBeGreaterThan(0.25);
  });

  it("returns low scores for neutral text", () => {
    const scores = detectJurisdictions("Hello world this is a test document.", "https://example.com");
    expect(scores.US).toBeLessThan(0.25);
    expect(scores.EU).toBeLessThan(0.25);
    expect(scores.BR).toBeLessThan(0.25);
  });
});

// Rule engine — positive fixtures
describe("runEngine — data sharing rules", () => {
  const meta = { url: "https://example.com/terms", title: "Terms of Service", language: "en" };

  it("fires sharing.third_parties_unspecified on third-party sharing clause", () => {
    const text = "We may share your personal data with third parties including affiliates and partners.";
    const report = runEngine(text, meta);
    const ids = report.findings.map((f) => f.rule_id);
    expect(ids).toContain("sharing.third_parties_unspecified");
  });

  it("fires sharing.data_sale on data sale clause", () => {
    const text = "We reserve the right to sell your personal data to advertising companies.";
    const report = runEngine(text, meta);
    const ids = report.findings.map((f) => f.rule_id);
    expect(ids).toContain("sharing.data_sale");
  });

  it("does NOT fire sharing.data_sale when negated", () => {
    const text = "We do not sell your personal information to any third parties.";
    const report = runEngine(text, meta);
    const ids = report.findings.map((f) => f.rule_id);
    expect(ids).not.toContain("sharing.data_sale");
  });
});

describe("runEngine — dispute resolution rules", () => {
  const meta = { url: "https://example.com/terms", title: "Terms of Service", language: "en" };

  it("fires dispute.forced_arbitration on arbitration clause", () => {
    const text = "All disputes shall be resolved by binding arbitration under the AAA rules.";
    const report = runEngine(text, meta);
    const ids = report.findings.map((f) => f.rule_id);
    expect(ids).toContain("dispute.forced_arbitration");
  });

  it("fires dispute.class_action_waiver on class action waiver", () => {
    const text = "You waive your right to participate in any class action lawsuit or collective proceeding.";
    const report = runEngine(text, meta);
    const ids = report.findings.map((f) => f.rule_id);
    expect(ids).toContain("dispute.class_action_waiver");
  });
});

describe("runEngine — change terms rules", () => {
  const meta = { url: "https://example.com/terms", title: "Terms of Service", language: "en" };

  it("fires change.unilateral_amendment when terms can change without notice", () => {
    const text = "We may modify these terms at any time without notice.";
    const report = runEngine(text, meta);
    const ids = report.findings.map((f) => f.rule_id);
    expect(ids).toContain("change.unilateral_amendment");
  });

  it("does NOT fire change.unilateral_amendment when notice is given", () => {
    const text = "We may modify these terms but will notify you in advance.";
    const report = runEngine(text, meta);
    const ids = report.findings.map((f) => f.rule_id);
    expect(ids).not.toContain("change.unilateral_amendment");
  });
});

describe("runEngine — data retention rules", () => {
  const meta = { url: "https://example.com/privacy", title: "Privacy Policy", language: "en" };

  it("fires retention.indefinite on indefinite retention clause", () => {
    const text = "We retain your data as long as necessary for our business purposes.";
    const report = runEngine(text, meta);
    const ids = report.findings.map((f) => f.rule_id);
    expect(ids).toContain("retention.indefinite");
  });

  it("fires retention.post_deletion when data kept after deletion", () => {
    const text = "We may retain certain data even after you delete your account.";
    const report = runEngine(text, meta);
    const ids = report.findings.map((f) => f.rule_id);
    expect(ids).toContain("retention.post_deletion");
  });
});

// Scoring
describe("computeScores", () => {
  it("returns 0 score with no findings", () => {
    const { score } = computeScores([]);
    expect(score).toBe(0);
  });

  it("scores a critical finding higher than a low finding", () => {
    const low: Finding = {
      rule_id: "test.low",
      rule_version: "0.1.0",
      category: "dark_patterns",
      severity: "low",
      jurisdictions: [],
      title: "test",
      explanation: "test",
      excerpt: "test",
      excerpt_offset: [0, 4],
    };
    const critical: Finding = {
      ...low,
      rule_id: "test.critical",
      category: "data_sharing",
      severity: "critical",
    };
    const { score: s1 } = computeScores([low]);
    const { score: s2 } = computeScores([critical]);
    expect(s2).toBeGreaterThan(s1);
  });

  it("caps total score at 100", () => {
    const findings: Finding[] = Array.from({ length: 30 }, (_, i) => ({
      rule_id: `test.${i}`,
      rule_version: "0.1.0",
      category: "data_sharing",
      severity: "critical" as const,
      jurisdictions: [],
      title: "test",
      explanation: "test",
      excerpt: "test",
      excerpt_offset: [0, 4],
    }));
    const { score } = computeScores(findings);
    expect(score).toBeLessThanOrEqual(100);
  });
});

// Fixture test
describe("runEngine — full fixture", () => {
  it("detects multiple hazards in the sample ToS fixture", () => {
    const text = readFileSync(
      join(__dirname, "fixtures/data_sharing_sample.txt"),
      "utf8"
    );
    const meta = { url: "https://example.com/terms", title: "Terms", language: "en" };
    const report = runEngine(text, meta);
    expect(report.findings.length).toBeGreaterThan(3);
    expect(report.score).toBeGreaterThan(10);
  });
});

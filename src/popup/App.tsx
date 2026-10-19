import { render, h, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";
import type { Finding, Report, ScanStatus, Severity } from "../shared/types";

declare const browser: typeof chrome;
const api: typeof chrome = typeof browser !== "undefined" ? browser : chrome;

type AppState =
  | { status: "idle" }
  | { status: "scanning" }
  | { status: "done"; report: Report }
  | { status: "no_document" }
  | { status: "error"; message: string };

function App() {
  const [state, setState] = useState<AppState>({ status: "idle" });
  const [pageTitle, setPageTitle] = useState("");
  const [openFindings, setOpenFindings] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.title) setPageTitle(tab.title);
    });
    // Load last report if available
    api.runtime.sendMessage({ type: "GET_LAST_REPORT" }, (res) => {
      if (res?.status === "done" && res.report) {
        setState({ status: "done", report: res.report });
      }
    });
  }, []);

  function startScan() {
    setState({ status: "scanning" });
    api.runtime.sendMessage({ type: "SCAN_REQUEST" }, (res) => {
      if (!res) {
        setState({ status: "error", message: "No response from background." });
        return;
      }
      if (res.status === "done" && res.report) {
        setState({ status: "done", report: res.report });
      } else if (res.status === "no_document") {
        setState({ status: "no_document" });
      } else {
        setState({ status: "error", message: res.error ?? "Unknown error." });
      }
    });
  }

  function clearScan() {
    api.runtime.sendMessage({ type: "CLEAR_REPORTS" }, () => {
      setState({ status: "idle" });
    });
  }

  function exportJSON(report: Report) {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clausesentinel-${report.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleFinding(id: string) {
    setOpenFindings((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div id="app">
      <header class="header">
        <span class="header-logo">ClauseSentinel</span>
        <div class="header-actions">
          <a onClick={() => api.runtime.openOptionsPage()}>Settings</a>
        </div>
      </header>

      {state.status === "idle" && (
        <div class="idle-state">
          {pageTitle && <p class="page-title" title={pageTitle}>{pageTitle}</p>}
          <button class="btn-primary" onClick={startScan}>
            Scan this page
          </button>
        </div>
      )}

      {state.status === "scanning" && (
        <div class="progress-state">
          <div class="spinner" role="status" aria-label="Analyzing" />
          <p>Analyzing…</p>
        </div>
      )}

      {state.status === "no_document" && (
        <div class="state-message">
          <div class="icon" aria-hidden="true">📄</div>
          <p>No legal document detected on this page.</p>
          <br />
          <button class="btn-secondary" onClick={startScan}>Try again</button>
        </div>
      )}

      {state.status === "error" && (
        <div class="state-message">
          <div class="icon" aria-hidden="true">⚠</div>
          <p>{state.message}</p>
          <br />
          <button class="btn-secondary" onClick={startScan}>Try again</button>
        </div>
      )}

      {state.status === "done" && (
        <>
          <ScoreSection report={state.report} />
          <div class="findings-list" role="list">
            {state.report.findings.length === 0 ? (
              <div class="state-message">No hazards detected.</div>
            ) : (
              state.report.findings.map((f) => (
                <FindingItem
                  key={f.rule_id}
                  finding={f}
                  open={openFindings.has(f.rule_id)}
                  onToggle={() => toggleFinding(f.rule_id)}
                />
              ))
            )}
          </div>
          <footer class="footer">
            <button onClick={() => exportJSON(state.report)}>Export JSON</button>
            <button onClick={clearScan}>Clear</button>
            <button onClick={startScan}>Re-scan</button>
          </footer>
        </>
      )}

      <div class="disclaimer" role="note">
        Not legal advice — for informational purposes only.
      </div>
    </div>
  );
}

function ScoreSection({ report }: { report: Report }) {
  const level = scoreLevel(report.score);
  const jurisdictions = (Object.keys(report.detected_jurisdictions) as Array<keyof typeof report.detected_jurisdictions>)
    .filter((j) => report.detected_jurisdictions[j] >= 0.25);

  const verdicts: Record<string, string> = {
    low: "Appears relatively low-risk.",
    medium: "Some clauses worth reviewing.",
    high: "Significant hazards to your data or rights.",
    critical: "Critical hazards — read carefully before accepting.",
  };

  return (
    <div class="score-section">
      <div class={`score-circle ${level}`} aria-label={`Risk score: ${report.score} out of 100`}>
        {report.score}
      </div>
      <div class="score-info">
        <strong>Risk Score</strong>
        <p class="score-verdict">{verdicts[level]}</p>
        {jurisdictions.length > 0 && (
          <div class="jurisdiction-badges" aria-label="Detected jurisdictions">
            {jurisdictions.map((j) => <span class="badge" key={j}>{j}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

function FindingItem({
  finding,
  open,
  onToggle,
}: {
  finding: Finding;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div class="finding-item" role="listitem">
      <button
        class="finding-summary"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`detail-${finding.rule_id}`}
      >
        <span class={`severity-indicator ${finding.severity}`} aria-hidden="true" />
        <span class={`severity-label ${finding.severity}`}>{finding.severity.toUpperCase()}</span>
        <span class="finding-title">{finding.title}</span>
        <span class="expand-icon" aria-hidden="true">{open ? "▲" : "▼"}</span>
      </button>
      <div
        id={`detail-${finding.rule_id}`}
        class={`finding-detail ${open ? "open" : ""}`}
        role="region"
      >
        <blockquote class="finding-excerpt">"{finding.excerpt}"</blockquote>
        <p class="finding-explanation">{finding.explanation}</p>
      </div>
    </div>
  );
}

function scoreLevel(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

render(<App />, document.getElementById("root")!);

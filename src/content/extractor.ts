const LEGAL_TITLE_PATTERNS = [
  /terms\s+(of\s+)?(service|use)/i,
  /privacy\s+policy/i,
  /user\s+agreement/i,
  /end\s+user\s+licen[sc]e/i,
  /data\s+(processing|protection)\s+(agreement|policy)/i,
  /cookie\s+policy/i,
  /legal\s+notice/i,
  /acceptable\s+use\s+policy/i,
  /termos\s+de\s+(serviço|uso)/i,
  /política\s+de\s+privacidade/i,
  /aviso\s+legal/i,
  /términos\s+de\s+(servicio|uso)/i,
  /aviso\s+de\s+privacidad/i,
];

const NOISE_SELECTORS = [
  "nav", "header", "footer", "aside",
  ".cookie-banner", ".cookie-notice", ".nav", ".navbar",
  "[role='navigation']", "[role='banner']", "[role='contentinfo']",
  "script", "style", "noscript",
];

export function isLegalDocument(): boolean {
  const title = document.title + " " + (document.querySelector("h1")?.textContent ?? "");
  return LEGAL_TITLE_PATTERNS.some((p) => p.test(title));
}

export function extractDocumentText(): string {
  const clone = document.body.cloneNode(true) as HTMLElement;

  for (const sel of NOISE_SELECTORS) {
    clone.querySelectorAll(sel).forEach((el) => el.remove());
  }

  const main =
    clone.querySelector("main") ??
    clone.querySelector("article") ??
    clone.querySelector('[role="main"]') ??
    clone;

  return extractText(main);
}

function extractText(root: Element): string {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];
  let node: Node | null;

  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim();
    if (text && text.length > 2) {
      parts.push(text);
    }
  }

  return parts.join(" ").replace(/\s{2,}/g, " ").trim();
}

export function detectLanguage(): string {
  return document.documentElement.lang ||
    (document.querySelector("html")?.getAttribute("lang")) ||
    navigator.language ||
    "en";
}

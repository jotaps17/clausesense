import { extractDocumentText, detectLanguage } from "./extractor";
import type { DocumentMeta } from "../shared/types";

declare const browser: typeof chrome;
const api: typeof chrome = typeof browser !== "undefined" ? browser : chrome;

api.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "EXTRACT_REQUEST") {
    try {
      const text = extractDocumentText();
      const meta: DocumentMeta = {
        url: window.location.href,
        title: document.title,
        language: detectLanguage(),
      };
      sendResponse({ text, meta });
    } catch (err) {
      sendResponse({ error: err instanceof Error ? err.message : "Extraction failed" });
    }
    return true;
  }
  return false;
});

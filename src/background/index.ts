import type { DocumentMeta, ScanResult } from "../shared/types";
import { runEngine } from "../engine/index";
import { saveReport, getLastReport, clearReports, getPreferences } from "../shared/storage";
import type { Message } from "./messages";

declare const browser: typeof chrome;
const api: typeof chrome = typeof browser !== "undefined" ? browser : chrome;

api.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse: (response: unknown) => void) => {
    if (message.type === "SCAN_REQUEST") {
      handleScan().then(sendResponse).catch((err: unknown) => {
        sendResponse({
          status: "error",
          error: err instanceof Error ? err.message : String(err),
        } satisfies ScanResult);
      });
      return true; // keep channel open for async response
    }

    if (message.type === "GET_LAST_REPORT") {
      getLastReport()
        .then((report) => sendResponse({ status: report ? "done" : "idle", report } satisfies ScanResult))
        .catch(() => sendResponse({ status: "idle" } satisfies ScanResult));
      return true;
    }

    if (message.type === "CLEAR_REPORTS") {
      clearReports().then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }));
      return true;
    }

    return false;
  }
);

async function handleScan(): Promise<ScanResult> {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { status: "error", error: "No active tab" };

  try {
    await api.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content/index.js"],
    });
  } catch {
    // Content script may already be injected
  }

  const extractResult = await new Promise<
    { text: string; meta: DocumentMeta } | { error: string }
  >((resolve) => {
    api.tabs.sendMessage(tab.id!, { type: "EXTRACT_REQUEST" }, (response) => {
      if (api.runtime.lastError) {
        resolve({ error: api.runtime.lastError.message ?? "Extraction failed" });
      } else {
        resolve(response as { text: string; meta: DocumentMeta });
      }
    });
  });

  if ("error" in extractResult) {
    return { status: "error", error: extractResult.error };
  }

  if (!extractResult.text || extractResult.text.length < 100) {
    return { status: "no_document" };
  }

  const prefs = await getPreferences();
  const report = runEngine(extractResult.text, extractResult.meta, prefs.language);
  await saveReport(report);

  return { status: "done", report };
}

import type { DocumentMeta, ScanResult } from "../shared/types";

export type Message =
  | { type: "SCAN_REQUEST" }
  | { type: "SCAN_RESULT"; payload: ScanResult }
  | { type: "EXTRACT_REQUEST" }
  | { type: "EXTRACT_RESULT"; payload: { text: string; meta: DocumentMeta } | { error: string } }
  | { type: "GET_LAST_REPORT" }
  | { type: "CLEAR_REPORTS" };

export type MessageResponse<T extends Message["type"]> =
  T extends "SCAN_REQUEST" ? ScanResult :
  T extends "GET_LAST_REPORT" ? ScanResult :
  T extends "CLEAR_REPORTS" ? { ok: true } :
  never;

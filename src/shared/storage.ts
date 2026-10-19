import type { Report, UserPreferences } from "./types";
import { DEFAULT_PREFERENCES } from "./types";

const PREFS_KEY = "cs_preferences";
const REPORTS_KEY = "cs_reports";

declare const browser: typeof chrome;
const api: typeof chrome =
  typeof browser !== "undefined" ? browser : chrome;

export async function getPreferences(): Promise<UserPreferences> {
  const result = await api.storage.local.get(PREFS_KEY);
  return { ...DEFAULT_PREFERENCES, ...(result[PREFS_KEY] as Partial<UserPreferences> ?? {}) };
}

export async function setPreferences(prefs: Partial<UserPreferences>): Promise<void> {
  const current = await getPreferences();
  await api.storage.local.set({ [PREFS_KEY]: { ...current, ...prefs } });
}

export async function getStoredReports(): Promise<Report[]> {
  const result = await api.storage.local.get(REPORTS_KEY);
  return (result[REPORTS_KEY] as Report[] | undefined) ?? [];
}

export async function saveReport(report: Report): Promise<void> {
  const prefs = await getPreferences();
  const reports = await getStoredReports();
  const updated = [report, ...reports].slice(0, prefs.maxStoredReports);
  await api.storage.local.set({ [REPORTS_KEY]: updated });
}

export async function clearReports(): Promise<void> {
  await api.storage.local.remove(REPORTS_KEY);
}

export async function getLastReport(): Promise<Report | undefined> {
  const reports = await getStoredReports();
  return reports[0];
}

import { getPreferences, setPreferences, clearReports } from "../shared/storage";

async function init() {
  const prefs = await getPreferences();

  const langEl = document.getElementById("language") as HTMLSelectElement;
  const themeEl = document.getElementById("theme") as HTMLSelectElement;
  const verbEl = document.getElementById("verbosity") as HTMLSelectElement;
  const maxEl = document.getElementById("maxReports") as HTMLInputElement;
  const saveBtn = document.getElementById("save") as HTMLButtonElement;
  const savedMsg = document.getElementById("savedMsg") as HTMLElement;
  const clearBtn = document.getElementById("clearReports") as HTMLButtonElement;
  const clearedMsg = document.getElementById("clearedMsg") as HTMLElement;

  langEl.value = prefs.language;
  themeEl.value = prefs.theme;
  verbEl.value = prefs.verbosity;
  maxEl.value = String(prefs.maxStoredReports);

  saveBtn.addEventListener("click", async () => {
    await setPreferences({
      language: langEl.value as "en" | "pt" | "es",
      theme: themeEl.value as "light" | "dark" | "system",
      verbosity: verbEl.value as "compact" | "full",
      maxStoredReports: parseInt(maxEl.value, 10) || 5,
    });
    savedMsg.style.display = "inline";
    setTimeout(() => { savedMsg.style.display = "none"; }, 2000);
  });

  clearBtn.addEventListener("click", async () => {
    await clearReports();
    clearedMsg.style.display = "inline";
    setTimeout(() => { clearedMsg.style.display = "none"; }, 2000);
  });
}

init();

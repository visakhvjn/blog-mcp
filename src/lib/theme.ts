export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "blog-mcp-theme";
export const DEFAULT_THEME: Theme = "dark";

export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark");}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "dark" || value === "light";
}

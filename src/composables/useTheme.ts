import { ref, watchEffect } from "vue";

const THEME_KEY = "alegra-theme";

type Theme = "light" | "dark";

const systemPrefersDark = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return systemPrefersDark() ? "dark" : "light";
};

const theme = ref<Theme>(getInitialTheme());

function applyTheme(next: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
}

watchEffect(() => {
  applyTheme(theme.value);
});

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
  };

  return {
    theme,
    toggleTheme,
  };
}

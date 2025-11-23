;(function () {
  const STORAGE_KEY = "rickoteca-theme"

  const prefersLight =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: light)").matches

  function detectInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "light" || saved === "dark") {
      return saved
    }
    return prefersLight ? "light" : "dark"
  }

  function updateToggleButton(btn, isLight) {
    if (!btn) return

    if (btn.id === "themeToggle") {
      btn.textContent = isLight ? "🌙" : "🌞"
    } else {
      btn.textContent = isLight ? "🌞" : "🌙"
    }

    const label = isLight
      ? "Alternar para modo escuro"
      : "Alternar para modo claro"

    btn.setAttribute("aria-label", label)
    btn.title = isLight ? "Modo claro" : "Modo escuro"
  }

  function applyTheme(theme) {
    const isLight = theme === "light"
    document.body.classList.toggle("light", isLight)
    localStorage.setItem(STORAGE_KEY, isLight ? "light" : "dark")

    const buttons = document.querySelectorAll(
      '#themeToggle, [data-action="toggle-theme"]',
    )
    buttons.forEach((btn) => updateToggleButton(btn, isLight))
  }

  function toggleTheme() {
    const nextTheme = document.body.classList.contains("light") ? "dark" : "light"
    applyTheme(nextTheme)
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(detectInitialTheme())

    const buttons = document.querySelectorAll(
      '#themeToggle, [data-action="toggle-theme"]',
    )
    buttons.forEach((btn) => {
      btn.addEventListener("click", toggleTheme)
    })
  })
})()
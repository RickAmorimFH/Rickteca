// Sistema de Acessibilidade para Daltônicos
class AccessibilityManager {
  constructor() {
    this.currentMode = localStorage.getItem("colorBlindMode") || "normal"
    this.modes = {
      normal: {
        name: "Normal",
        icon: "👁️",
        description: "Cores padrão",
      },
      protanopia: {
        name: "Protanopia",
        icon: "🔴",
        description: "Dificuldade com vermelho",
      },
      deuteranopia: {
        name: "Deuteranopia",
        icon: "🟢",
        description: "Dificuldade com verde",
      },
      tritanopia: {
        name: "Tritanopia",
        icon: "🔵",
        description: "Dificuldade com azul",
      },
      highContrast: {
        name: "Alto Contraste",
        icon: "⚫",
        description: "Contraste máximo",
      },
    }

    this.init()
  }

  init() {
    this.createAccessibilityButton()
    this.applyMode(this.currentMode)
  }

  createAccessibilityButton() {
    // Criar botão flutuante
    const button = document.createElement("button")
    button.id = "accessibilityBtn"
    button.className = "accessibility-btn"
    button.innerHTML = `
      <span class="accessibility-icon">${this.modes[this.currentMode].icon}</span>
    `
    button.title = "Modo de Acessibilidade"
    document.body.appendChild(button)

    // Criar menu de opções
    const menu = document.createElement("div")
    menu.id = "accessibilityMenu"
    menu.className = "accessibility-menu"
    menu.innerHTML = `
      <div class="accessibility-menu-header">
        <h3>Modo de Acessibilidade</h3>
        <button class="close-accessibility-menu">&times;</button>
      </div>
      <div class="accessibility-options">
        ${Object.entries(this.modes)
          .map(
            ([key, mode]) => `
          <button class="accessibility-option ${key === this.currentMode ? "active" : ""}" data-mode="${key}">
            <span class="option-icon">${mode.icon}</span>
            <div class="option-info">
              <span class="option-name">${mode.name}</span>
              <span class="option-description">${mode.description}</span>
            </div>
          </button>
        `,
          )
          .join("")}
      </div>
    `
    document.body.appendChild(menu)

    // Event listeners
    button.addEventListener("click", () => this.toggleMenu())

    menu.querySelector(".close-accessibility-menu").addEventListener("click", () => this.closeMenu())

    menu.querySelectorAll(".accessibility-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        const mode = e.currentTarget.dataset.mode
        this.changeMode(mode)
      })
    })

    // Fechar menu ao clicar fora
    document.addEventListener("click", (e) => {
      if (!button.contains(e.target) && !menu.contains(e.target)) {
        this.closeMenu()
      }
    })
  }

  toggleMenu() {
    const menu = document.getElementById("accessibilityMenu")
    menu.classList.toggle("show")
  }

  closeMenu() {
    const menu = document.getElementById("accessibilityMenu")
    menu.classList.remove("show")
  }

  changeMode(mode) {
    this.currentMode = mode
    localStorage.setItem("colorBlindMode", mode)
    this.applyMode(mode)

    // Atualizar botão
    const button = document.getElementById("accessibilityBtn")
    button.querySelector(".accessibility-icon").textContent = this.modes[mode].icon

    // Atualizar opções ativas
    document.querySelectorAll(".accessibility-option").forEach((option) => {
      option.classList.toggle("active", option.dataset.mode === mode)
    })

    this.closeMenu()
  }

  applyMode(mode) {
    // Remover todas as classes de modo
    document.body.classList.remove("protanopia", "deuteranopia", "tritanopia", "high-contrast")

    // Adicionar classe do modo atual
    if (mode !== "normal") {
      document.body.classList.add(mode === "highContrast" ? "high-contrast" : mode)
    }
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  new AccessibilityManager()
})

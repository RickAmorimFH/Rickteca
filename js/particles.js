// Sistema de partículas animadas
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById("particlesCanvas")
    this.ctx = this.canvas.getContext("2d")
    this.particles = []
    this.particleCount = 50
    this.currentTheme = "default"

    this.themes = {
      default: {
        colors: ["rgba(0, 212, 255, 0.6)", "rgba(0, 150, 255, 0.6)", "rgba(100, 200, 255, 0.6)"],
        shapes: ["circle"],
        speed: 0.5,
      },
      holy: {
        colors: ["rgba(255, 215, 0, 0.6)", "rgba(255, 255, 255, 0.6)", "rgba(255, 240, 200, 0.6)"],
        shapes: ["cross", "circle"],
        speed: 0.3,
      },
      gaming: {
        colors: ["rgba(255, 0, 128, 0.6)", "rgba(128, 0, 255, 0.6)", "rgba(0, 255, 255, 0.6)"],
        shapes: ["square", "triangle"],
        speed: 0.8,
      },
      manga: {
        colors: ["rgba(255, 100, 150, 0.6)", "rgba(255, 200, 220, 0.6)", "rgba(255, 150, 200, 0.6)"],
        shapes: ["star", "circle"],
        speed: 0.6,
      },
      sports: {
        colors: ["rgba(0, 255, 100, 0.6)", "rgba(255, 200, 0, 0.6)", "rgba(255, 100, 0, 0.6)"],
        shapes: ["circle", "hexagon"],
        speed: 0.7,
      },
    }

    this.init()
    this.animate()
    this.setupEventListeners()
  }

  init() {
    this.resize()
    window.addEventListener("resize", () => this.resize())
    this.createParticles()
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createParticles() {
    this.particles = []
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle())
    }
  }

  createParticle() {
    const theme = this.themes[this.currentTheme]
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * theme.speed,
      speedY: (Math.random() - 0.5) * theme.speed,
      color: theme.colors[Math.floor(Math.random() * theme.colors.length)],
      shape: theme.shapes[Math.floor(Math.random() * theme.shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }
  }

  drawParticle(particle) {
    this.ctx.save()
    this.ctx.translate(particle.x, particle.y)
    this.ctx.rotate(particle.rotation)
    this.ctx.fillStyle = particle.color

    switch (particle.shape) {
      case "circle":
        this.ctx.beginPath()
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
        this.ctx.fill()
        break

      case "square":
        this.ctx.fillRect(-particle.size, -particle.size, particle.size * 2, particle.size * 2)
        break

      case "triangle":
        this.ctx.beginPath()
        this.ctx.moveTo(0, -particle.size)
        this.ctx.lineTo(particle.size, particle.size)
        this.ctx.lineTo(-particle.size, particle.size)
        this.ctx.closePath()
        this.ctx.fill()
        break

      case "star":
        this.drawStar(0, 0, 5, particle.size, particle.size / 2)
        break

      case "cross":
        this.ctx.fillRect(-particle.size / 4, -particle.size, particle.size / 2, particle.size * 2)
        this.ctx.fillRect(-particle.size, -particle.size / 4, particle.size * 2, particle.size / 2)
        break

      case "hexagon":
        this.drawHexagon(0, 0, particle.size)
        break
    }

    this.ctx.restore()
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    this.ctx.beginPath()
    this.ctx.moveTo(cx, cy - outerRadius)

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      this.ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      this.ctx.lineTo(x, y)
      rot += step
    }

    this.ctx.lineTo(cx, cy - outerRadius)
    this.ctx.closePath()
    this.ctx.fill()
  }

  drawHexagon(cx, cy, size) {
    this.ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i
      const x = cx + size * Math.cos(angle)
      const y = cy + size * Math.sin(angle)
      if (i === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    }
    this.ctx.closePath()
    this.ctx.fill()
  }

  updateParticle(particle) {
    particle.x += particle.speedX
    particle.y += particle.speedY
    particle.rotation += particle.rotationSpeed

    // Wrap around screen
    if (particle.x < 0) particle.x = this.canvas.width
    if (particle.x > this.canvas.width) particle.x = 0
    if (particle.y < 0) particle.y = this.canvas.height
    if (particle.y > this.canvas.height) particle.y = 0
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.particles.forEach((particle) => {
      this.updateParticle(particle)
      this.drawParticle(particle)
    })

    requestAnimationFrame(() => this.animate())
  }

  changeTheme(theme) {
    if (this.themes[theme]) {
      this.currentTheme = theme
      // Transição suave das partículas
      this.particles.forEach((particle, index) => {
        setTimeout(() => {
          const newParticle = this.createParticle()
          particle.color = newParticle.color
          particle.shape = newParticle.shape
          particle.speedX = newParticle.speedX
          particle.speedY = newParticle.speedY
        }, index * 20)
      })
    }
  }

  setupEventListeners() {
    // Escutar mudanças de categoria
    document.addEventListener("categoryChange", (e) => {
      this.changeTheme(e.detail.animation)
    })
  }
}

// Inicializar sistema de partículas quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  new ParticleSystem()
})

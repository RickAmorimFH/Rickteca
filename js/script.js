// Elementos do DOM
const searchInput = document.getElementById("searchInput")
const categoryButtons = document.querySelectorAll(".category-btn")
const bookCards = document.querySelectorAll(".book-card")
const bookModal = document.getElementById("bookModal")
const contactModal = document.getElementById("contactModal")
const aboutModal = document.getElementById("aboutModal")
const navLinks = document.querySelectorAll(".nav-link")
const closeButtons = document.querySelectorAll(".close-modal")

let currentBookId = null
const likesData = JSON.parse(localStorage.getItem("bookLikes") || "{}")
const ratingsData = JSON.parse(localStorage.getItem("bookRatings") || "{}")
const commentsData = JSON.parse(localStorage.getItem("bookComments") || "{}")
const userEmail = localStorage.getItem("userEmail") || "guest@rickoteca.com"

document.addEventListener("DOMContentLoaded", () => {
  initializeLikesAndRatings()
})

const commentText = document.getElementById("commentText")
const commentUserName = document.getElementById("commentUserName")
const postCommentBtn = document.getElementById("postCommentBtn")
const charCount = document.getElementById("charCount")

commentText.addEventListener("input", () => {
  const length = commentText.value.length
  charCount.textContent = `${length}/500`

  if (length > 450) {
    charCount.style.color = "#ff6b6b"
  } else {
    charCount.style.color = "rgba(255, 255, 255, 0.5)"
  }
})

postCommentBtn.addEventListener("click", () => {
  postComment()
})

commentText.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    postComment()
  }
})

function postComment() {
  const userName = commentUserName.value.trim()
  const commentContent = commentText.value.trim()

  if (!userName) {
    alert("Por favor, digite seu nome!")
    commentUserName.focus()
    return
  }

  if (!commentContent) {
    alert("Por favor, escreva um comentário!")
    commentText.focus()
    return
  }

    localStorage.setItem("userName", userName)

  if (!commentsData[currentBookId]) {
    commentsData[currentBookId] = []
  }

  const newComment = {
    id: Date.now(),
    userName,
    userEmail,
    comment: commentContent,
    createdAt: new Date().toISOString(),
  }

  commentsData[currentBookId].unshift(newComment)
  localStorage.setItem("bookComments", JSON.stringify(commentsData))

  commentText.value = ""
  charCount.textContent = "0/500"

  displayComments()

  postCommentBtn.textContent = "Publicado!"
  postCommentBtn.disabled = true
  setTimeout(() => {
    postCommentBtn.textContent = "Publicar Comentário"
    postCommentBtn.disabled = false
  }, 2000)
}

function displayComments() {
  const commentsList = document.getElementById("commentsList")
  const comments = commentsData[currentBookId] || []

  if (comments.length === 0) {
    commentsList.innerHTML = '<p class="no-comments">Seja o primeiro a comentar sobre este livro!</p>'
    return
  }

  commentsList.innerHTML = comments
    .map((comment) => {
      const date = new Date(comment.createdAt)
      const formattedDate = formatDate(date)
      const initials = comment.userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      const canDelete = comment.userEmail === userEmail

      return `
      <div class="comment-item" data-comment-id="${comment.id}">
        <div class="comment-header">
          <div class="comment-author">
            <div class="comment-avatar">${initials}</div>
            <span class="comment-author-name">${escapeHtml(comment.userName)}</span>
          </div>
          <div class="comment-meta">
            <span class="comment-date">${formattedDate}</span>
            ${canDelete ? `<button class="delete-comment-btn" onclick="deleteComment(${comment.id})">Excluir</button>` : ""}
          </div>
        </div>
        <p class="comment-text">${escapeHtml(comment.comment)}</p>
      </div>
    `
    })
    .join("")
}

function deleteComment(commentId) {
  if (!confirm("Tem certeza que deseja excluir este comentário?")) {
    return
  }

  const comments = commentsData[currentBookId] || []
  const index = comments.findIndex((c) => c.id === commentId)

  if (index > -1) {
    comments.splice(index, 1)
    commentsData[currentBookId] = comments
    localStorage.setItem("bookComments", JSON.stringify(commentsData))
    displayComments()
  }
}

function formatDate(date) {
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Agora"
  if (diffMins < 60) return `${diffMins} min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays < 7) return `${diffDays}d atrás`

  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function initializeLikesAndRatings() {
  bookCards.forEach((card) => {
    const bookId = card.getAttribute("data-book-id")
    updateBookCardStats(card, bookId)
  })
}

function updateBookCardStats(card, bookId) {
  const likeBtn = card.querySelector(".like-btn")
  const likeCount = card.querySelector(".like-count")
  const stars = card.querySelector(".stars")
  const ratingCount = card.querySelector(".rating-count")

  const likes = likesData[bookId] || []
  likeCount.textContent = likes.length
  if (likes.includes(userEmail)) {
    likeBtn.classList.add("liked")
    likeBtn.querySelector(".heart-icon").textContent = "♥"
  }

  const ratings = ratingsData[bookId] || []
  const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0

  const fullStars = Math.round(avgRating)
  const starsText = "★".repeat(fullStars) + "☆".repeat(5 - fullStars)
  stars.textContent = starsText
  ratingCount.textContent = `(${ratings.length})`
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".like-btn") && !e.target.closest(".modal")) {
    e.stopPropagation()
    const btn = e.target.closest(".like-btn")
    const bookId = btn.getAttribute("data-book-id")
    toggleLike(bookId, btn)
  }
})

function toggleLike(bookId, btn = null) {
  if (!likesData[bookId]) {
    likesData[bookId] = []
  }

  const index = likesData[bookId].indexOf(userEmail)
  if (index > -1) {
    likesData[bookId].splice(index, 1)
  } else {
    likesData[bookId].push(userEmail)
  }

  localStorage.setItem("bookLikes", JSON.stringify(likesData))

  if (btn) {
    const card = btn.closest(".book-card")
    updateBookCardStats(card, bookId)
  }

  if (currentBookId === bookId) {
    updateModalLikeButton()
  }
}

function updateModalLikeButton() {
  const modalLikeBtn = document.getElementById("modalLikeBtn")
  const modalLikeCount = document.getElementById("modalLikeCount")
  const likes = likesData[currentBookId] || []

  modalLikeCount.textContent = likes.length

  if (likes.includes(userEmail)) {
    modalLikeBtn.classList.add("liked")
    modalLikeBtn.querySelector(".heart-icon").textContent = "♥"
  } else {
    modalLikeBtn.classList.remove("liked")
    modalLikeBtn.querySelector(".heart-icon").textContent = "♡"
  }
}

document.getElementById("modalLikeBtn").addEventListener("click", (e) => {
  e.stopPropagation()
  toggleLike(currentBookId)

  const card = document.querySelector(`[data-book-id="${currentBookId}"]`)
  if (card) {
    updateBookCardStats(card, currentBookId)
  }
})

const starRating = document.getElementById("userStarRating")
const stars = starRating.querySelectorAll(".star")

stars.forEach((star) => {
  star.addEventListener("mouseenter", () => {
    const rating = Number.parseInt(star.getAttribute("data-rating"))
    highlightStars(rating)
  })

  star.addEventListener("click", () => {
    const rating = Number.parseInt(star.getAttribute("data-rating"))
    saveRating(currentBookId, rating)
  })
})

starRating.addEventListener("mouseleave", () => {
  const userRating = getUserRating(currentBookId)
  highlightStars(userRating)
})

function highlightStars(rating) {
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("hover")
      star.textContent = "★"
    } else {
      star.classList.remove("hover")
      star.textContent = "☆"
    }
  })
}

function saveRating(bookId, rating) {
  if (!ratingsData[bookId]) {
    ratingsData[bookId] = []
  }

  const existingRatingIndex = ratingsData[bookId].findIndex((r) => r.email === userEmail)

  if (existingRatingIndex > -1) {
    ratingsData[bookId][existingRatingIndex].rating = rating
  } else {
    ratingsData[bookId].push({ email: userEmail, rating })
  }

  localStorage.setItem("bookRatings", JSON.stringify(ratingsData))

  updateModalRatingDisplay()

  const card = document.querySelector(`[data-book-id="${bookId}"]`)
  if (card) {
    updateBookCardStats(card, bookId)
  }

  stars.forEach((star) => star.classList.add("selected"))
  setTimeout(() => {
    const userRating = getUserRating(bookId)
    highlightStars(userRating)
  }, 300)
}

function getUserRating(bookId) {
  const ratings = ratingsData[bookId] || []
  const userRating = ratings.find((r) => r.email === userEmail)
  return userRating ? userRating.rating : 0
}

function updateModalRatingDisplay() {
  const ratings = ratingsData[currentBookId] || []
  const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0

  document.getElementById("modalAverageRating").textContent = avgRating.toFixed(1)
  document.getElementById("modalTotalRatings").textContent = `(${ratings.length} avaliações)`

  const fullStars = Math.round(avgRating)
  const starsText = "★".repeat(fullStars) + "☆".repeat(5 - fullStars)
  document.getElementById("modalRatingStars").textContent = starsText

  const userRating = getUserRating(currentBookId)
  highlightStars(userRating)
}

// Filtro por categoria com animações
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")

    const category = button.getAttribute("data-category")
    const animation = button.getAttribute("data-animation")

    // Disparar evento para mudar tema das partículas
    document.dispatchEvent(new CustomEvent("categoryChange", { detail: { animation } }))

    bookCards.forEach((card) => {
      if (category === "todos" || card.getAttribute("data-category") === category) {
        card.style.display = "block"
        card.style.animation = "scaleIn 0.5s ease-out"
      } else {
        card.style.display = "none"
      }
    })
  })
})

// Pesquisa de livros
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase()

  bookCards.forEach((card) => {
    const title = card.getAttribute("data-title").toLowerCase()
    const author = card.getAttribute("data-author").toLowerCase()
    const description = card.getAttribute("data-description").toLowerCase()

    if (title.includes(searchTerm) || author.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = "block"
      card.style.animation = "scaleIn 0.5s ease-out"
    } else {
      card.style.display = "none"
    }
  })
})

// Abrir modal de detalhes do livro
bookCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest(".like-btn")) {
      return
    }

    const bookId = card.getAttribute("data-book-id")
    const title = card.getAttribute("data-title")
    const author = card.getAttribute("data-author")
    const description = card.getAttribute("data-description")
    const cover = card.getAttribute("data-cover")
    const download = card.getAttribute("data-download")

    currentBookId = bookId

    document.getElementById("modalTitle").textContent = title
    document.getElementById("modalAuthor").textContent = author
    document.getElementById("modalDescription").textContent = description
    document.getElementById("modalCover").src = cover
    document.getElementById("modalCover").alt = title
    document.getElementById("modalDownload").href = download

    updateModalLikeButton()
    updateModalRatingDisplay()

    displayComments()

    commentText.value = ""
    commentUserName.value = localStorage.getItem("userName") || ""
    charCount.textContent = "0/500"

    bookModal.style.display = "block"
    document.body.style.overflow = "hidden"
  })
})

// Navegação
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const page = link.getAttribute("data-page")

    if (page === "contato") {
      e.preventDefault()
      contactModal.style.display = "block"
      document.body.style.overflow = "hidden"
    } else if (page === "sobre") {
      e.preventDefault()
      aboutModal.style.display = "block"
      document.body.style.overflow = "hidden"
    } else if (page === "home") {
      e.preventDefault()
      navLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")
      contactModal.style.display = "none"
      aboutModal.style.display = "none"
      document.body.style.overflow = "auto"
    }
  })
})

// Fechar modais
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    bookModal.style.display = "none"
    contactModal.style.display = "none"
    aboutModal.style.display = "none"
    document.body.style.overflow = "auto"
  })
})

// Fechar modal ao clicar fora
window.addEventListener("click", (e) => {
  if (e.target === bookModal || e.target === contactModal || e.target === aboutModal) {
    bookModal.style.display = "none"
    contactModal.style.display = "none"
    aboutModal.style.display = "none"
    document.body.style.overflow = "auto"
  }
})

// Prevenir scroll do body quando modal está aberto
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    bookModal.style.display = "none"
    contactModal.style.display = "none"
    aboutModal.style.display = "none"
    document.body.style.overflow = "auto"
  }
})

// === THEME TOGGLER ===
;(function () {
  const STORAGE_KEY = "rickoteca-theme"
  const body = document.body
  const btn = document.getElementById("themeToggle")

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

  function applyTheme(theme) {
    const isLight = theme === "light"
    body.classList.toggle("light", isLight)
    localStorage.setItem(STORAGE_KEY, isLight ? "light" : "dark")
  }

   function applyTheme(theme) {
    const isLight = theme === "light"
    body.classList.toggle("light", isLight)
    localStorage.setItem(STORAGE_KEY, isLight ? "light" : "dark")

    if (btn) {
      btn.textContent = isLight ? "🌙" : "🌞"
      btn.setAttribute(
        "aria-label",
        isLight ? "Alternar para modo escuro" : "Alternar para modo claro",
      )
      btn.title = isLight ? "Modo claro" : "Modo escuro"
    }
  }

  applyTheme(detectInitialTheme())

  if (btn) {
    btn.addEventListener("click", () => {
      const nextTheme = body.classList.contains("light") ? "dark" : "light"
      applyTheme(nextTheme)
    })
  }
})()
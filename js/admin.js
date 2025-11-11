// Credenciais de admin (em produção, isso deveria estar no backend)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
}

// Elementos do DOM
const loginScreen = document.getElementById("loginScreen")
const adminDashboard = document.getElementById("adminDashboard")
const adminLoginForm = document.getElementById("adminLoginForm")
const logoutBtn = document.getElementById("logoutBtn")

// Verificar se já está logado
if (localStorage.getItem("adminLoggedIn") === "true") {
  showDashboard()
} else {
  showLogin()
}

// Login
adminLoginForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const username = document.getElementById("adminUsername").value
  const password = document.getElementById("adminPassword").value

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem("adminLoggedIn", "true")
    showDashboard()
  } else {
    alert("Usuário ou senha incorretos!")
  }
})

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminLoggedIn")
  showLogin()
})

function showLogin() {
  loginScreen.style.display = "flex"
  adminDashboard.style.display = "none"
}

function showDashboard() {
  loginScreen.style.display = "none"
  adminDashboard.style.display = "block"
  loadDashboardData()
}

// Carregar dados do dashboard
function loadDashboardData() {
  loadStatistics()
  loadUsers()
  loadComments()
  loadDetailedStats()
}

// Carregar estatísticas gerais
function loadStatistics() {
  const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const likes = JSON.parse(localStorage.getItem("bookLikes") || "{}")
  const ratings = JSON.parse(localStorage.getItem("bookRatings") || "{}")
  const comments = JSON.parse(localStorage.getItem("bookComments") || "{}")

  // Contar total de livros (assumindo 4 livros de exemplo)
  const totalBooks = document.querySelectorAll(".book-card").length || 4

  // Contar curtidas
  let totalLikes = 0
  for (const bookId in likes) {
    totalLikes += likes[bookId].length
  }

  // Contar avaliações
  let totalRatings = 0
  for (const bookId in ratings) {
    totalRatings += ratings[bookId].length
  }

  // Contar comentários
  let totalComments = 0
  for (const bookId in comments) {
    totalComments += comments[bookId].length
  }

  document.getElementById("totalBooks").textContent = totalBooks
  document.getElementById("totalUsers").textContent = users.length
  document.getElementById("totalLikes").textContent = totalLikes
  document.getElementById("totalRatings").textContent = totalRatings
  document.getElementById("totalComments").textContent = totalComments
}

// Carregar usuários
function loadUsers() {
  const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const tbody = document.getElementById("usersTableBody")

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="no-data">Nenhum usuário cadastrado ainda</td></tr>'
    return
  }

  tbody.innerHTML = users
    .map(
      (user, index) => `
    <tr>
      <td>${escapeHtml(user.nome)}</td>
      <td>${escapeHtml(user.email)}</td>
      <td>${escapeHtml(user.telefone)}</td>
      <td>${formatDate(new Date(user.createdAt))}</td>
      <td>
        <button class="action-btn small danger" onclick="deleteUser(${index})">Excluir</button>
      </td>
    </tr>
  `,
    )
    .join("")
}

// Deletar usuário
function deleteUser(index) {
  if (!confirm("Tem certeza que deseja excluir este usuário?")) {
    return
  }

  const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  users.splice(index, 1)
  localStorage.setItem("registeredUsers", JSON.stringify(users))
  loadUsers()
  loadStatistics()
}

// Exportar usuários para CSV
document.getElementById("exportUsersBtn").addEventListener("click", () => {
  const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

  if (users.length === 0) {
    alert("Não há usuários para exportar!")
    return
  }

  let csv = "Nome,Email,Telefone,Descrição,Data de Cadastro\n"
  users.forEach((user) => {
    csv += `"${user.nome}","${user.email}","${user.telefone}","${user.descricao || ""}","${new Date(user.createdAt).toLocaleString("pt-BR")}"\n`
  })

  const blob = new Blob([csv], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `usuarios_rickoteca_${new Date().toISOString().split("T")[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
})

// Carregar comentários
function loadComments() {
  const comments = JSON.parse(localStorage.getItem("bookComments") || "{}")
  const container = document.getElementById("commentsAdminList")

  const allComments = []
  for (const bookId in comments) {
    comments[bookId].forEach((comment) => {
      allComments.push({ ...comment, bookId })
    })
  }

  if (allComments.length === 0) {
    container.innerHTML = '<p class="no-data">Nenhum comentário encontrado</p>'
    return
  }

  allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  container.innerHTML = allComments
    .map(
      (comment) => `
    <div class="admin-comment-item">
      <div class="admin-comment-header">
        <div>
          <strong>${escapeHtml(comment.userName)}</strong>
          <span class="comment-meta">${escapeHtml(comment.userEmail)}</span>
          <span class="comment-meta">Livro ID: ${escapeHtml(comment.bookId)}</span>
        </div>
        <div>
          <span class="comment-date">${formatDate(new Date(comment.createdAt))}</span>
          <button class="action-btn small danger" onclick="deleteCommentAdmin('${comment.bookId}', ${comment.id})">Excluir</button>
        </div>
      </div>
      <p class="admin-comment-text">${escapeHtml(comment.comment)}</p>
    </div>
  `,
    )
    .join("")
}

// Deletar comentário (admin)
function deleteCommentAdmin(bookId, commentId) {
  if (!confirm("Tem certeza que deseja excluir este comentário?")) {
    return
  }

  const comments = JSON.parse(localStorage.getItem("bookComments") || "{}")
  if (comments[bookId]) {
    const index = comments[bookId].findIndex((c) => c.id === commentId)
    if (index > -1) {
      comments[bookId].splice(index, 1)
      localStorage.setItem("bookComments", JSON.stringify(comments))
      loadComments()
      loadStatistics()
    }
  }
}

// Limpar todos os comentários
document.getElementById("clearAllCommentsBtn").addEventListener("click", () => {
  if (!confirm("ATENÇÃO: Isso irá excluir TODOS os comentários do sistema. Tem certeza?")) {
    return
  }

  localStorage.setItem("bookComments", "{}")
  loadComments()
  loadStatistics()
  alert("Todos os comentários foram excluídos!")
})

// Carregar estatísticas detalhadas
function loadDetailedStats() {
  const likes = JSON.parse(localStorage.getItem("bookLikes") || "{}")
  const ratings = JSON.parse(localStorage.getItem("bookRatings") || "{}")
  const comments = JSON.parse(localStorage.getItem("bookComments") || "{}")

  // Top livros curtidos
  const topLiked = Object.entries(likes)
    .map(([bookId, likesList]) => ({ bookId, count: likesList.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  document.getElementById("topLikedBooks").innerHTML =
    topLiked.length > 0
      ? topLiked
          .map(
            (item) => `
      <div class="stats-item">
        <span class="stats-book-id">${item.bookId}</span>
        <span class="stats-count">${item.count} curtidas</span>
      </div>
    `,
          )
          .join("")
      : '<p class="no-data">Nenhum dado disponível</p>'

  // Top livros avaliados
  const topRated = Object.entries(ratings)
    .map(([bookId, ratingsList]) => {
      const avg = ratingsList.reduce((sum, r) => sum + r.rating, 0) / ratingsList.length
      return { bookId, avg: avg.toFixed(1), count: ratingsList.length }
    })
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5)

  document.getElementById("topRatedBooks").innerHTML =
    topRated.length > 0
      ? topRated
          .map(
            (item) => `
      <div class="stats-item">
        <span class="stats-book-id">${item.bookId}</span>
        <span class="stats-count">⭐ ${item.avg} (${item.count} avaliações)</span>
      </div>
    `,
          )
          .join("")
      : '<p class="no-data">Nenhum dado disponível</p>'

  // Top livros comentados
  const topCommented = Object.entries(comments)
    .map(([bookId, commentsList]) => ({ bookId, count: commentsList.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  document.getElementById("topCommentedBooks").innerHTML =
    topCommented.length > 0
      ? topCommented
          .map(
            (item) => `
      <div class="stats-item">
        <span class="stats-book-id">${item.bookId}</span>
        <span class="stats-count">${item.count} comentários</span>
      </div>
    `,
          )
          .join("")
      : '<p class="no-data">Nenhum dado disponível</p>'
}

// Tabs
const adminTabs = document.querySelectorAll(".admin-tab")
const tabContents = document.querySelectorAll(".admin-tab-content")

adminTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const tabName = tab.getAttribute("data-tab")

    adminTabs.forEach((t) => t.classList.remove("active"))
    tabContents.forEach((c) => c.classList.remove("active"))

    tab.classList.add("active")
    document.getElementById(`${tabName}Tab`).classList.add("active")
  })
})

// Busca de usuários
document.getElementById("userSearch").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase()
  const rows = document.querySelectorAll("#usersTableBody tr")

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase()
    row.style.display = text.includes(searchTerm) ? "" : "none"
  })
})

// Busca de comentários
document.getElementById("commentSearch").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase()
  const items = document.querySelectorAll(".admin-comment-item")

  items.forEach((item) => {
    const text = item.textContent.toLowerCase()
    item.style.display = text.includes(searchTerm) ? "" : "none"
  })
})

// Funções auxiliares
function formatDate(date) {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

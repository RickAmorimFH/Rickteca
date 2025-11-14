// Elementos do DOM
const cadastroForm = document.getElementById("cadastroForm")
const successMessage = document.getElementById("successMessage")

// Máscara para telefone
const telefoneInput = document.getElementById("telefone")
telefoneInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "")

  if (value.length <= 11) {
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
    value = value.replace(/(\d)(\d{4})$/, "$1-$2")
  }

  e.target.value = value
})

// Envio do formulário
cadastroForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Coleta os dados do formulário
  const formData = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
    descricao: document.getElementById("descricao").value || null,
  }

  console.log("[v0] Dados do formulário:", formData)

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  registeredUsers.push({ ...formData, createdAt: new Date().toISOString() })
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

  localStorage.setItem("userName", formData.nome)
  localStorage.setItem("userEmail", formData.email)

  // AQUI VOCÊ PODE ADICIONAR A INTEGRAÇÃO COM SUPABASE
  // Exemplo de como seria:
  /*
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .insert([formData]);

        if (error) throw error;
        
        console.log('[v0] Usuário cadastrado com sucesso:', data);
    } catch (error) {
        console.error('[v0] Erro ao cadastrar:', error);
        alert('Erro ao realizar cadastro. Tente novamente.');
        return;
    }
    */

  // Mostra mensagem de sucesso
  successMessage.classList.add("show")
  cadastroForm.style.display = "none"

  // Redireciona após 3 segundos
  setTimeout(() => {
    window.location.href = "../index.html"
  }, 3000)
})

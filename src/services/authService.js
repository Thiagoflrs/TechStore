const API_URL = "http://localhost:5248/api/Usuarios";

export const login = async (email, senha) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const responseText = await response.text();
    let result = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      result = null;
    }

    if (response.ok && result) {
      return {
        Token: result.Token,
        Nome: result.Nome,
        Saldo: result.Saldo ?? 0,
        UsuarioId: result.UsuarioId || result.id || result.Id || null,
      };
    } else {
      const errorMsg = "E-mail ou senha inválidos.";
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error("Erro no serviço de login:", error);
    throw error;
  }
};

export const logoutService = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = response.headers.get("content-type");
    let data = {};
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("saldo");
    localStorage.removeItem("usuarioId");

    return data.Mensagem || "Logout realizado";
  } catch (error) {
    localStorage.clear();
    throw error;
  }
};

export const register = async (data) => {
  try {
    const [year, month, day] = data.birthDate.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    const body = {
      Nome: data.name,
      Email: data.email,
      Senha: data.password,
      Perfil: "CLIENTE",
      DataNascimento: formattedDate,
      Sexo:
        data.gender === "male"
          ? "MASCULINO"
          : data.gender === "female"
            ? "FEMININO"
            : "OUTRO",
    };

    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    let responseData = null;

    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      responseData = null;
    }

    if (!response.ok) {
      const errorMsg = responseData?.Mensagem || responseText || "Erro ao cadastrar usuário";
      throw new Error(errorMsg);
    }

    return responseData;
  } catch (error) {
    console.error("Erro no registro:", error);
    throw error;
  }
};
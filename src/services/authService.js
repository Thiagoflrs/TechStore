const API_URL = "http://localhost:5248/api/Usuarios";

export const login = async (email, senha) => { 
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }), 
    });

    if (response.ok) {
      const result = await response.json();
      return { token: result.Token, nome: result.Nome, saldo: result.Saldo ?? 0 };
    } else {
      const errorMsg = await response.text();
      throw new Error(errorMsg || "Email ou senha inválidos");
    }

  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  const token = localStorage.getItem("token");
  await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  localStorage.removeItem("token");
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

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || "Erro ao cadastrar usuário");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
import { jwtDecode } from "jwt-decode";

export const login = async (email, senha) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Usuarios/login`, {
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
      let idFinal = result.UsuarioId || result.usuarioId || result.id || result.Id;

      if (!idFinal && result.Token) {
        try {
          const decoded = jwtDecode(result.Token);
          idFinal = decoded.user_id || decoded.sub;
        } catch (decodeError) {
          console.error("Erro ao decodificar token:", decodeError);
        }
      }

      return {
        Token: result.Token || result.token,
        Nome: result.Nome || result.nome,
        Saldo: result.Saldo ?? 0,
        UsuarioId: idFinal,
      };
    } else {
      const errorMsg = result?.Mensagem || "E-mail ou senha inválidos.";
      throw new Error(errorMsg);
    }
  } catch (error) {
    throw error;
  }
};

export const logoutService = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Usuarios/logout`, {
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

const aguardar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Usuarios`, {
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

    await aguardar(2500);


    return responseData;
  } catch (error) {
    throw error;
  }
};
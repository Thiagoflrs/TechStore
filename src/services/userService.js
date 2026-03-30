export const getUser = async (id, token) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Usuarios/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  return await response.json();
};
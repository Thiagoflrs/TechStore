export const validationMessages = {
   name: {
    required: "O nome é obrigatório",
    invalid: "O nome deve ter 3 caracteres"
  },
  email: {
    required: "O email é obrigatório",
    invalid: "Digite um email válido"
  },
  birthDate: {
    required: "A data de nascimento é obrigatória",
    invalid: "Digite uma data de nascimento válida",
    underage: "Você deve ter pelo menos 18 anos"
  },
  gender: {
    required: "O gênero é obrigatório"
  },
  password: {
    required: "A senha é obrigatória",
    short: "A senha deve ter no mínimo 6 caracteres"
  },
  confirmPassword: {
    required: "Confirme sua senha",
    mismatch: "As senhas não conferem"
  }
};
import { useState } from "react";

export function useForm(initialValues, validate) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Limpa o erro do campo assim que o usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    
    const validationErrors = validate(form);

    // LOG DE SEGURANÇA: Deve imprimir um OBJETO ou NULL
    console.log("Resultado da validação:", validationErrors);

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; 
    }

    setErrors({});
    callback(form);
  };

  return { form, errors, handleChange, handleSubmit };
}
import { motion } from "framer-motion";
import { useForm } from "../../../hooks/useForm";
import { validateRegister } from "../../../validators/authValidator";

function RegisterForm() {
  const { form, errors, handleChange, handleSubmit } = useForm(
    { name: "", email: "", password: "", confirmPassword: "" },
    validateRegister
  );

  const onSubmit = (data) => console.log("Cadastro válido:", data);

  const shakeVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    error: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.form
      className="auth-form"
      onSubmit={handleSubmit(onSubmit)}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {/* Campo Nome */}
      <motion.div 
        variants={shakeVariant} 
        animate={errors.name ? "error" : "visible"}
      >
        <input
          type="text"
          name="name"
          className={errors.name ? "input-error" : ""}
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </motion.div>

      {/* Campo Email */}
      <motion.div 
        variants={shakeVariant} 
        animate={errors.email ? "error" : "visible"}
      >
        <input
          type="email"
          name="email"
          className={errors.email ? "input-error" : ""}
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </motion.div>

      {/* Campo Senha */}
      <motion.div 
        variants={shakeVariant} 
        animate={errors.password ? "error" : "visible"}
      >
        <input
          type="password"
          name="password"
          className={errors.password ? "input-error" : ""}
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </motion.div>

      {/* Campo Confirmar Senha */}
      <motion.div 
        variants={shakeVariant} 
        animate={errors.confirmPassword ? "error" : "visible"}
      >
        <input
          type="password"
          name="confirmPassword"
          className={errors.confirmPassword ? "input-error" : ""}
          placeholder="Confirmar senha"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
      </motion.div>

      <motion.button type="submit"
      variants={shakeVariant}
      whileHover={{ scale : 1.02 }}
      whileTap={{ scale: 0.98 }}>
        Criar conta
      </motion.button>
    </motion.form>
  );
}

export default RegisterForm;
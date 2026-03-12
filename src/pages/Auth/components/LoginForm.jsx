import { motion } from "framer-motion";
import { useForm } from "../../../hooks/useForm";
import { validateLogin } from "../../../validators/authValidator";

function LoginForm() {
  const { form, errors, handleChange, handleSubmit } = useForm(
    {
      email: "",
      password: ""
    },
    validateLogin
  );

  const onSubmit = (data) => {
    console.log("Login válido:", data);
  };

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
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      {/* Campo Email*/}
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

      {/* Campo Senha*/}
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

      <motion.button 
        type="submit" 
        variants={shakeVariant}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Entrar
      </motion.button>
    </motion.form>
  );
}

export default LoginForm;
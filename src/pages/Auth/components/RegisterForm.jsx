import { motion } from "framer-motion";
import { useForm } from "../../../hooks/useForm";
import { validateRegister } from "../../../validators/authValidator";
import { useAge } from "../../../hooks/useAge";

function RegisterForm() {
  const { form, errors, handleChange, handleSubmit } = useForm(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      gender: "",
    },
    validateRegister,
  );

  const age = useAge(form.birthDate);

  const onSubmit = (data) => {
    if (errors && Object.keys(errors).length > 0) return;
    console.log("Cadastro válido:", data);
  };

  const shakeVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    error: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
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

      {/* Campo Data de Nascimento */}
      <motion.div
        variants={shakeVariant}
        animate={errors.birthDate ? "error" : "visible"}
      >
        <input
          type="date"
          name="birthDate"
          className={errors.birthDate ? "input-error" : ""}
          placeholder="Data de nascimento"
          value={form.birthDate}
          onChange={handleChange}
          max={
            new Date(new Date().setFullYear(new Date().getFullYear() - 18))
              .toISOString()
              .split("T")[0]
          }
        />
        {errors.birthDate && <p className="error">{errors.birthDate}</p>}

        {/* Idade dinâmica */}
        {age !== null && !errors.birthDate && (
          <p className={age >= 18 ? "age-valid" : "age-invalid"}>
            {age >= 18
              ? `Idade: ${age} anos (válido)`
              : `Idade: ${age} anos (mínimo 18 anos)`}
          </p>
        )}
      </motion.div>

      {/* Campo Gênero */}
      <motion.div
        variants={shakeVariant}
        animate={errors.gender ? "error" : "visible"}
      >
        <select
          name="gender"
          className={errors.gender ? "input-error" : ""}
          value={form.gender}
          onChange={handleChange}
        >
          <option value="" disabled hidden>
            Selecione o gênero
          </option>
          <option value="male">Masculino</option>
          <option value="female">Feminino</option>
          <option value="other">Outro</option>
        </select>
        {errors.gender && <p className="error">{errors.gender}</p>}
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
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}
      </motion.div>

      <motion.button
        type="submit"
        disabled={errors && Object.keys(errors).length > 0}
        className={
          errors && Object.keys(errors).length > 0 ? "btn-disabled" : ""
        }
        variants={shakeVariant}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Criar conta
      </motion.button>
    </motion.form>
  );
}

export default RegisterForm;

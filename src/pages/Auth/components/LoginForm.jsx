import { motion } from "framer-motion";
import { useForm } from "../../../hooks/useForm";
import { validateLogin } from "../../../validators/authValidator";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useCart } from "../../../context/CartContext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate, useLocation } from "react-router-dom";

function LoginForm() {
  const { form, errors, handleChange, handleSubmit } = useForm(
    { email: "", senha: "" },
    validateLogin,
  );

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const { login } = useAuth();
  const { setUserId } = useCart();
  const [loading, setLoading] = useState(false);
  const [errorField, setErrorField] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorField("");
    try {
      const { login: loginService } =
        await import("../../../services/authService");
      const response = await loginService(data.email, data.senha);

      const idParaCarrinho = response.UsuarioId || response.Id || response.id;
      if (idParaCarrinho) {
        setUserId(idParaCarrinho);
        localStorage.setItem("usuarioId", idParaCarrinho);
      }

      login(response);

      await Swal.fire({
        icon: "success",
        title: "Bem-vindo(a)!",
        text: "Login realizado com sucesso!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Erro no login:", error);

      await Swal.fire({
        icon: "error",
        title: "Falha no acesso",
        text: error.message || "Erro ao conectar com o servidor.",
        confirmButtonText: "Tentar novamente",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  const shakeVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    error: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } },
  };

  useEffect(() => {
    if (errorField) {
      const el = document.querySelector(`input[name="${errorField}"]`);
      el?.focus();
    }
  }, [errorField]);

  return (
    <motion.form
      className="auth-form"
      onSubmit={handleSubmit(onSubmit)}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div
        variants={shakeVariant}
        animate={errors.email || errorField === "email" ? "error" : "visible"}
      >
        <input
          type="email"
          name="email"
          className={
            errors.email || errorField === "email" ? "input-error" : ""
          }
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {(errors.email || errorField === "email") && (
          <p className="error">{errors.email}</p>
        )}
      </motion.div>

      <motion.div
        variants={shakeVariant}
        animate={errors.senha || errorField === "senha" ? "error" : "visible"}
      >
        <input
          type="password"
          name="senha"
          className={
            errors.senha || errorField === "senha" ? "input-error" : ""
          }
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
        />
        {(errors.senha || errorField === "senha") && (
          <p className="error">{errors.senha}</p>
        )}
      </motion.div>

      <motion.button
        type="submit"
        disabled={loading}
        variants={shakeVariant}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={loading ? "btn-loading" : ""}
      >
        {loading ? "Entrando..." : "Entrar"}
      </motion.button>
    </motion.form>
  );
}

export default LoginForm;
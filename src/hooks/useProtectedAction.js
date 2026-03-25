import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export function useProtectedAction() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAction = (callback, redirectTo) => {
    if (!user) {
      navigate("/auth", {
        state: { from: redirectTo || location.pathname },
      });
      return;
    }
    callback();
  };

  return { handleAction };
}
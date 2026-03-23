import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  );
}

export default App;
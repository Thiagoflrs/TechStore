import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const USER_ID_KEY = "usuarioId";
  const GUEST_CART_KEY = "cart_guest";

  const [userId, setUserId] = useState(() => localStorage.getItem(USER_ID_KEY));

  const [cart, setCart] = useState(() => {
    const id = localStorage.getItem(USER_ID_KEY);
    const key = id ? `cart_${id}` : GUEST_CART_KEY;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!userId) {
      setCart([]);
      return;
    }
    const saved = localStorage.getItem(`cart_${userId}`);
    setCart(saved ? JSON.parse(saved) : []);
  }, [userId]);

  useEffect(() => {
    const key = userId ? `cart_${userId}` : GUEST_CART_KEY;
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, userId]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const itemExists = prevCart.find((item) => item.id === product.id);
      if (itemExists) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    const key = userId ? `cart_${userId}` : GUEST_CART_KEY;
    localStorage.removeItem(key);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const setUserIdHandler = (id) => {
    if (id) {
      const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
      
      const userCart = JSON.parse(localStorage.getItem(`cart_${id}`) || "[]");

      const mergedCart = [...userCart];
      guestCart.forEach((guestItem) => {
        const existingItem = mergedCart.find((item) => item.id === guestItem.id);
        if (existingItem) {
          existingItem.quantity += guestItem.quantity;
        } else {
          mergedCart.push(guestItem);
        }
      });

      localStorage.setItem(`cart_${id}`, JSON.stringify(mergedCart));
      localStorage.removeItem(GUEST_CART_KEY);
      
      setUserId(id);
      localStorage.setItem(USER_ID_KEY, id);
      setCart(mergedCart); 
    } else {
      localStorage.removeItem(USER_ID_KEY);
      setUserId(null);
      setCart([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,
        setUserId: setUserIdHandler,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
import { createContext, useContext, useEffect, useState } from "react";
import { addToCart, getCart, removeCart } from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCartItems(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

 
  const addItem = async (foodId) => {
    try {
      await addToCart({ foodId, quantity: 1 });
      await fetchCart(); 
    } catch (err) {
      console.error(err);
    }
  };

  
  const decreaseItem = async (foodId) => {

    const item = cartItems.find(i => i.foodId === foodId);

    if (!item) return;

    if (item.quantity === 1) {
      await removeCart(item.id);
    } else {
      await addToCart({ foodId, quantity: -1 }); 
    }

    await fetchCart();
  };


  const removeItem = async (foodId) => {
    const item = cartItems.find(i => i.foodId === foodId);
    if (!item) return;

    await removeCart(item.id);
    await fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addItem,
        decreaseItem,
        removeItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

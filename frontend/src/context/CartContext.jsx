import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartSummary, setCartSummary] = useState({ totalItems: 0, subtotal: 0, totalAmount: 0 });
    const [cartCount, setCartCount] = useState(0);
    const { isAuthenticated } = useAuth();

    const fetchCart = async () => {
        if (!isAuthenticated) { setCartItems([]); setCartCount(0); return; }
        try {
            const res = await cartAPI.get();
            setCartItems(res.data.cart.items);
            setCartSummary(res.data.cart.summary);
            setCartCount(res.data.cart.summary.totalItems);
        } catch (e) { console.error('Cart fetch error:', e); }
    };

    useEffect(() => { fetchCart(); }, [isAuthenticated]);

    const addToCart = async (productId, quantity = 1) => {
        const res = await cartAPI.add({ productId, quantity });
        await fetchCart();
        return res.data;
    };

    const updateCartItem = async (id, quantity) => {
        await cartAPI.update(id, { quantity });
        await fetchCart();
    };

    const removeFromCart = async (id) => {
        await cartAPI.remove(id);
        await fetchCart();
    };

    const clearCart = async () => {
        await cartAPI.clear();
        await fetchCart();
    };

    return (
        <CartContext.Provider value={{ cartItems, cartSummary, cartCount, addToCart, updateCartItem, removeFromCart, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

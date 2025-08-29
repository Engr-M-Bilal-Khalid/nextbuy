"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useGuest } from "@/context/GuestContext";
import { getCookie } from "@/lib/cookieHelpers";
import { addToCartApi, removeFromCartApi, fetchCartApi, updateCartQuantityApi } from "@/lib/cartHelpers";
import { errorNotifier, successNotifier } from "@/lib/sonnerNotifications";
import { debounce } from "@/lib/debounce";

type CartItem = {
  variantId: string;
  quantity: number;
};

// New types for the API response data with different names to avoid conflict
interface ApiCart {
  cart_id: string;
  customer_id: string | null;
  guest_id: string | null;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

interface ApiCartItem {
  item_id: number;
  variant_id: string;
  name: string;
  quantity: number;
  price_without_discount: string;
  discount: string;
  stock: number;
  firstimage: string;
  product_id: string;
  product_name: string;
}

interface FetchCartResponse {
  cart: ApiCart;
  items: ApiCartItem[];
}

type CartContextType = {
  cartVersion:number,
  cart: CartItem[];
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
  getCartUserId: () => string | null;
  fullCart?: FetchCartResponse,
  updateQuantity:(variantId: string, quantity: number) => void
};

const CartContext = createContext<CartContextType>({
  cartVersion:0,
  cart: [],
  addToCart: async () => { },
  removeFromCart: async () => { },
  fetchCart: async () => { },
  getCartUserId: () => null,
  updateQuantity: (_variantId: string, _quantity: number) => {}
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fullCart, setFullCart] = useState<FetchCartResponse>();
  const [cartVersion, setCartVersion] = useState(0);
  const { guestId } = useGuest();

  // ✅ single source of truth for deciding cart identity
  const getCartUserId = () => {
    const sessionToken = getCookie("signInToken"); // or "signInToken", whichever is correct in your flow
    if (sessionToken) {
      // decode & extract real userId here instead of returning raw token
      return sessionToken;
    }
    return guestId;
  };

  const addToCart = async (variantId: string, quantity: number = 1) => {
    const cartUserId = getCartUserId();
    if (!cartUserId) return;

    const updatedCart = await addToCartApi(cartUserId, variantId, quantity);
    if (updatedCart) {
      setCart(updatedCart);
      setCartVersion((v) => v + 1);  // trigger update
      successNotifier.notify(`Added successfully chk db`)
    } else {
      errorNotifier.notify(`Fail to add`)
    }

  };

  const removeFromCart = async (variantId: string) => {
    const cartUserId = getCartUserId();
    if (!cartUserId) return;

    const updatedCart = await removeFromCartApi(cartUserId, variantId);
    setCart(updatedCart);
  };

  const fetchCart = async () => {
    const cartUserId = getCartUserId();
    if (!cartUserId) return;

    const userCart = await fetchCartApi(cartUserId);
    //i have to use this type here 
    setFullCart(userCart);
  };

  const debouncedUpdateQuantity = debounce(
  async (variantId: string, quantity: number) => {
    const cartUserId = getCartUserId();
    if (!cartUserId) return;
    try {
      await updateCartQuantityApi(cartUserId, variantId, quantity);
      setCartVersion(v => v + 1); // trigger refetch
    } catch (err) {
      console.error("Failed to update cart quantity", err);
    }
  },
  500 // wait 500ms after last change
);

const updateQuantity = (variantId: string, quantity: number) => {
   debouncedUpdateQuantity(variantId, quantity);
};


  

  // optional: auto-fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [guestId, cartVersion]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, fetchCart, getCartUserId, fullCart, cartVersion , updateQuantity}}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

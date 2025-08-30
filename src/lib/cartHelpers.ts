// /lib/cartHelpers.ts

export const addToCartApi = async (cartUserId: string, variantId: string, quantity: number) => {
  const res = await fetch("/api/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartUserId, variantId, quantity }),
  });
  return res.json();
};

export const removeFromCartApi = async (cartUserId: string, variantId: string) => {
  const res = await fetch("/api/cart/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartUserId, variantId }),
  });
  return res.json();
};

// lib/api/fetchCart.ts
export const fetchCartApi = async (cartUserId: string) => {
  const res = await fetch("/api/cart/fetchCartData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartUserId }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cart data");
  }

  return res.json();
};



export const updateCartQuantityApi = async (cartUserId: string, variantId: string, quantity: number) => {
  await fetch("/api/cart/update", {
    method: "POST",
    body: JSON.stringify({ cartUserId, variantId, quantity }),
    headers: { "Content-Type": "application/json" },
  });
};


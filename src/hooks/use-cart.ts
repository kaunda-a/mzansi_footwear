'use client';

import { useCartStore } from '@/lib/cart-store';

/**
 * Custom hook that provides cart functionality
 * This is a wrapper around the cart store for easier usage
 */
export function useCart() {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  } = useCartStore();

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  };
}

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from "react";
import type { CartAction, CartState } from "../types/cart";
import { cartReducer, initialCartState } from "../reducers/cartReducer";

type CartContextValue = {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  cartItemCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const cartItemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const cartTotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const value: CartContextValue = useMemo(
    () => ({ state, dispatch, cartItemCount, cartTotal }),
    [state, cartItemCount, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error(
      "useCartContext must be used within a CartProvider. " +
      "Wrap your component tree with <CartProvider>."
    );
  }
  return context;
}
export const useCart = useCartContext;

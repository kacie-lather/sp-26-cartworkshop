import type { CartAction, CartState } from "../types/cart";

export const initialCartState: CartState = {
  items: [],
  isOpen: false,
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: action.payload.productId,
            productName: action.payload.productName,
            price: action.payload.price,
            imageUrl: action.payload.imageUrl,
            quantity: 1,
          },
        ],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.productId !== action.payload.productId
        ),
      };

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity < 1) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.productId !== action.payload.productId
          ),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      };
  }
}

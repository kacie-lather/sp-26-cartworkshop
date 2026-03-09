export type CartItem = {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

export type CartAction =
  | {
      type: "ADD_TO_CART";
      payload: {
        productId: number;
        productName: string;
        price: number;
        imageUrl?: string;
      };
    }
  | {
      type: "REMOVE_FROM_CART";
      payload: { productId: number };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: number; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" };
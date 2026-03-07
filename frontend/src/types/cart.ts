export interface CartItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

export interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

type AddToCartAction = {
    type: "ADD_TO_CART";
    payload: {
        productId: number;
        productName: string;
        price: number;
        imageUrl?: string;
    };
};

type RemoveFromCartAction = {
    type: "REMOVE_FROM_CART";
    payload: { productId: number };
};

type UpdateQuantityAction = {
    type: "UPDATE_QUANTITY";
    payload: { productId: number; quantity: number };
};

type ClearCartAction = {
    type: "CLEAR_CART";
};

type ToggleCartAction = {
    type: "TOGGLE_CART";
};

export type CartAction =
    | AddToCartAction
    | RemoveFromCartAction
    | UpdateQuantityAction
    | ClearCartAction
    | ToggleCartAction;

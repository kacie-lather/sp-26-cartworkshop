import { Link } from "react-router-dom";
import { useCartContext } from "../contexts/CartContext";
import type { CartItem } from "../types/cart";
import styles from "./CartPage.module.css";

function QuantitySelector({ item }: { item: CartItem }) {
  const { dispatch } = useCartContext();

  function handleDecrement() {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId: item.productId, quantity: Math.max(1, item.quantity - 1) },
    });
  }

  function handleIncrement() {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId: item.productId, quantity: Math.min(99, item.quantity + 1) },
    });
  }

  return (
    <div className={styles.quantitySelector} role="group" aria-label={`Quantity for ${item.productName}`}>
      <button type="button" className={styles.quantityButton} onClick={handleDecrement} disabled={item.quantity === 1} aria-label={`Decrease quantity of ${item.productName}`}>−</button>
      <span className={styles.quantityValue} aria-live="polite">{item.quantity}</span>
      <button type="button" className={styles.quantityButton} onClick={handleIncrement} disabled={item.quantity === 99} aria-label={`Increase quantity of ${item.productName}`}>+</button>
    </div>
  );
}

import { CheckoutForm } from "../components/CheckoutForm/CheckoutForm";

export default function CartPage() {
  const { state, dispatch, cartTotal } = useCartContext();
  const { items } = state;

  function handleRemove(productId: number) {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId } });
  }

  function handleProceedToCheckout() {
    document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth" });
  }

  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <h1 className={styles.heading}>Your Cart</h1>
        <div className={styles.empty}>
          <p className={styles.emptyMessage}>Your cart is empty.</p>
          <Link to="/" className={styles.browseLink}>Browse Products</Link>
        </div>
        {items.length > 0 && <CheckoutForm />}
    </main>
    );
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Your Cart</h1>
      <div className={styles.layout}>
        <section className={styles.itemList} aria-label="Cart items">
          <ul className={styles.items}>
            {items.map((item) => (
              <li key={item.productId} className={styles.item}>
                <div className={styles.productInfo}>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.productName} className={styles.productImage} />}
                  <span className={styles.productName}>{item.productName}</span>
                </div>
                <span className={styles.price}>${item.price.toFixed(2)}</span>
                <QuantitySelector item={item} />
                <span className={styles.lineTotal}>${(item.price * item.quantity).toFixed(2)}</span>
                <button type="button" className={styles.removeButton} onClick={() => handleRemove(item.productId)} aria-label={`Remove ${item.productName} from cart`}>Remove</button>
              </li>
            ))}
          </ul>
        </section>
        <aside className={styles.summary} aria-label="Order summary">
          <h2 className={styles.summaryHeading}>Order Summary</h2>
          <div className={styles.summaryRow}><span>Total</span><span>${cartTotal.toFixed(2)}</span></div>
          <button type="button" className={styles.checkoutButton} onClick={handleProceedToCheckout} aria-label="Proceed to checkout">Proceed to Checkout</button>
        </aside>
      </div>
      {items.length > 0 && <CheckoutForm />}
    </main>
  );
}

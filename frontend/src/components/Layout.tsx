import { Link, Outlet } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { CartSidebar } from "./CartSidebar/CartSidebar";
import styles from "./Layout.module.css";

export default function Layout() {
  const { cartItemCount } = useCart();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🌰</span>
            <h1 className={styles.title}>Buckeye Marketplace</h1>
          </Link>
          <Link
            to="/cart"
            className={styles.cartButton}
            aria-label={`Shopping cart with ${cartItemCount} items`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartItemCount > 0 && <span className={styles.badge}>{cartItemCount}</span>}
          </Link>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <CartSidebar />
    </div>
  );
}

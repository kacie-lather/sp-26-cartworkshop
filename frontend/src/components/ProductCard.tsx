import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { ProductResponse } from "../types/product";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.cardLink}>
        <div className={styles.imageWrapper}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name ?? "Product"}
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholder}>
              <span>📦</span>
            </div>
          )}
        </div>
        <div className={styles.body}>
          <span className={styles.category}>{product.categoryName}</span>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <div className={styles.cardActions}>
        <button
          className={styles.addToCartButton}
          onClick={() =>
            dispatch({
              type: "ADD_TO_CART",
              payload: {
                productId: product.id,
                productName: product.name ?? "Product",
                price: product.price,
                imageUrl: product.imageUrl ?? undefined,
              },
            })
          }
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

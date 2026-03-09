import { useState } from "react";
import { useCartContext } from "../../contexts/CartContext";
import styles from "./CheckoutForm.module.css";

interface FormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const INITIAL_FORM: FormData = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

const US_STATES = [
  { value: "CA", label: "California" },
  { value: "FL", label: "Florida" },
  { value: "NY", label: "New York" },
  { value: "OH", label: "Ohio" },
  { value: "TX", label: "Texas" },
];

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (data.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }
  if (!data.email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }
  if (data.address.trim().length < 5) {
    errors.address = "Shipping address must be at least 5 characters.";
  }
  if (data.city.trim().length === 0) {
    errors.city = "City is required.";
  }
  if (data.state === "") {
    errors.state = "Please select a state.";
  }
  if (!/^\d{5}$/.test(data.zipCode)) {
    errors.zipCode = "Zip code must be exactly 5 digits.";
  }

  return errors;
}

export function CheckoutForm() {
  const { cartTotal, cartItemCount, dispatch } = useCartContext();

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched.has(name)) {
      const fieldErrors = validateForm(updated);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name as keyof FormData] }));
    }
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name } = e.target;
    const nextTouched = new Set(touched).add(name);
    setTouched(nextTouched);

    const fieldErrors = validateForm(formData);
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name as keyof FormData] }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const allErrors = validateForm(formData);
    const hasErrors = Object.keys(allErrors).length > 0;

    if (hasErrors) {
      const allFields = new Set(Object.keys(INITIAL_FORM));
      setTouched(allFields);
      setErrors(allErrors);
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    dispatch({ type: "CLEAR_CART" });
    setIsProcessing(false);
    setIsSuccess(true);
  }

  function getFieldProps(name: keyof FormData) {
    const hasError = touched.has(name) && !!errors[name];
    return {
      id: name,
      name,
      value: formData[name],
      onChange: handleChange,
      onBlur: handleBlur,
      "aria-invalid": hasError ? (true as const) : undefined,
      "aria-describedby": hasError ? `${name}-error` : undefined,
      className: `${styles.input} ${hasError ? styles.inputError : ""}`,
    };
  }

  if (isSuccess) {
    return (
      <section id="checkout-form" className={styles.section}>
        <div className={styles.success} role="status" aria-live="polite">
          <div className={styles.successIcon} aria-hidden="true">✓</div>
          <h2 className={styles.successHeading}>Order Placed!</h2>
          <p className={styles.successMessage}>
            Thanks for shopping at Buckeye Marketplace. You'll receive a
            confirmation email at <strong>{formData.email}</strong> shortly.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="checkout-form" className={styles.section}>
      <h2 className={styles.heading}>Checkout</h2>

      <div className={styles.layout}>
        <form
          onSubmit={handleSubmit}
          className={styles.form}
          noValidate
          aria-label="Checkout form"
        >
          {/* Full Name */}
          <div className={styles.field}>
            <label htmlFor="fullName" className={styles.label}>
              Full Name <span className={styles.required} aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              required
              autoComplete="name"
              aria-label="Full name"
              {...getFieldProps("fullName")}
            />
            {touched.has("fullName") && errors.fullName && (
              <span id="fullName-error" className={styles.error} role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email <span className={styles.required} aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              aria-label="Email address"
              {...getFieldProps("email")}
            />
            {touched.has("email") && errors.email && (
              <span id="email-error" className={styles.error} role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Shipping Address */}
          <div className={styles.field}>
            <label htmlFor="address" className={styles.label}>
              Shipping Address <span className={styles.required} aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              required
              autoComplete="street-address"
              aria-label="Shipping address"
              {...getFieldProps("address")}
            />
            {touched.has("address") && errors.address && (
              <span id="address-error" className={styles.error} role="alert">
                {errors.address}
              </span>
            )}
          </div>

          {/* City + State + Zip */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="city" className={styles.label}>
                City <span className={styles.required} aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                required
                autoComplete="address-level2"
                aria-label="City"
                {...getFieldProps("city")}
              />
              {touched.has("city") && errors.city && (
                <span id="city-error" className={styles.error} role="alert">
                  {errors.city}
                </span>
              )}
            </div>

            <div className={`${styles.field} ${styles.fieldNarrow}`}>
              <label htmlFor="state" className={styles.label}>
                State <span className={styles.required} aria-hidden="true">*</span>
              </label>
              <select
                required
                autoComplete="address-level1"
                aria-label="State"
                {...getFieldProps("state")}
              >
                <option value="">— Select —</option>
                {US_STATES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {touched.has("state") && errors.state && (
                <span id="state-error" className={styles.error} role="alert">
                  {errors.state}
                </span>
              )}
            </div>

            <div className={`${styles.field} ${styles.fieldNarrow}`}>
              <label htmlFor="zipCode" className={styles.label}>
                Zip Code <span className={styles.required} aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                required
                inputMode="numeric"
                maxLength={5}
                autoComplete="postal-code"
                aria-label="Zip code"
                {...getFieldProps("zipCode")}
              />
              {touched.has("zipCode") && errors.zipCode && (
                <span id="zipCode-error" className={styles.error} role="alert">
                  {errors.zipCode}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className={styles.submitRow}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={cartItemCount === 0 || isProcessing}
              aria-label={
                isProcessing ? "Processing your order" : "Place your order"
              }
              aria-busy={isProcessing}
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>

            {cartItemCount === 0 && (
              <p className={styles.emptyWarning} role="status">
                Add items to your cart before placing an order.
              </p>
            )}
          </div>
        </form>

        {/* Order summary */}
        <aside className={styles.summary} aria-label="Order total">
          <h3 className={styles.summaryHeading}>Order Total</h3>
          <div className={styles.summaryRow}>
            <span>Items ({cartItemCount})</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

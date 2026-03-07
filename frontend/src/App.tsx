import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { CartProvider } from "./context/CartContext";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListPage from "./pages/ProductListPage";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<ProductListPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

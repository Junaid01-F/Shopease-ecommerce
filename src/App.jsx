import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import "./App.css";


function ScrollToTop() {

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


function NotFound() {

  return (
    <main className="page">
      <div className="empty-state">
        <div className="empty-icon">🧭</div>
        <h1>Page not found</h1>
        <p>The page you are looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </main>
  );
}


function App() {

  return (

    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <BrowserRouter>

            <ScrollToTop />

            <div className="app-shell">

              <Navbar />

              <div className="app-main">

                <Routes>

                  <Route path="/" element={<Home />} />

                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />

                  <Route path="/cart" element={<Cart />} />

                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route
                    path="/profile"
                    element={<ProtectedRoute><Profile /></ProtectedRoute>}
                  />

                  <Route
                    path="/checkout"
                    element={<ProtectedRoute><Checkout /></ProtectedRoute>}
                  />

                  <Route
                    path="/orders"
                    element={<ProtectedRoute><Orders /></ProtectedRoute>}
                  />

                  <Route
                    path="/orders/:orderId"
                    element={<ProtectedRoute><OrderDetails /></ProtectedRoute>}
                  />

                  <Route
                    path="/order-success/:orderId"
                    element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>}
                  />

                  <Route path="*" element={<NotFound />} />

                </Routes>

              </div>

              <Footer />

            </div>

          </BrowserRouter>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>

  );
}

export default App;
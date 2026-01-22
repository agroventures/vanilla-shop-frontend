import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Refund from "./pages/Refund";
import OrderSuccess from "./pages/OrderSuccess";
import OrderCancel from "./pages/OrderCancel";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Admin from "./pages/Admin";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./components/NotFound";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import PaymentReturn from "./pages/PaymentReturn";


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/return" element={<PaymentReturn />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/order-cancel" element={<OrderCancel />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

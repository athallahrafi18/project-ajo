import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

// Lazy-loaded components
const Home = lazy(() => import("../pages/Home"));
const Menu = lazy(() => import("../pages/Menu"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/Login"));
const Payment = lazy(() => import("../pages/Payment"));

const CustomerRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* ✅ Halaman Login TANPA layout */}
        <Route path="/login" element={<Login />} />

        {/* ✅ Semua halaman lain pakai layout Navbar + Footer */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col bg-[#FDF8F5]">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/payment" element={<Payment />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default CustomerRoutes;

import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import PaymentPage from "./pages/PaymentPage";
import { useUserStore } from "./stores/useUserStore";
import Wrapper from "./pages/Warehouse/Wrapper";
import Expenses from "./pages/Warehouse/Expenses";
import ProfileLayout from "./components/Profile/ProfileLayout";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import WarehouseInventories from "./pages/Warehouse/WarehouseInventories.jsx";
import Daily from "./pages/Warehouse/Daily.jsx";
import Geography from "./pages/Warehouse/Geography.jsx";
import CreateInventory from "./pages/Warehouse/CreateInventory.jsx";
import WarehouseOrders from "./pages/Warehouse/WarehouseOrders.jsx";
import VehicleListPage from "./pages/VehicleManagement/VehicleListPage.jsx";
import WrapperVehicle from "./pages/VehicleManagement/WrapperVehicle.jsx";
import './echo.js'
import UserAddressesPage from "./pages/UserAddressPage.jsx";
import WrapperMap from "./pages/Map/WrapperMap.jsx";
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './stripe'; // Make sure you have stripe.js configured
import LicensePlateCapturePage from "./pages/Warehouse/LicensePlateCapturePage.jsx";
import CreateFeedbackForm from "./pages/FeedbackForm/CreateFeedbackForm.jsx";
import SocialMediaPage from "./pages/SocialMedia/SocialMediaPage.jsx";
import NotificationsPage from "./pages/SocialMedia/NotificationsPage.jsx";
import NetworkPage from "./pages/SocialMedia/NetworkPage.jsx";
function App() {
  const { user, checkingAuth, checkAuth } = useUserStore();
  
  // On initial load, check authentication status
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // If the authentication is still being checked, show checkingAuth spinner
  if (checkingAuth) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
  
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/product/:id" element={<ProductDetailPage />} /> {/* Product details page */}
          <Route
            path="/secret-dashboard"
            element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/" />}
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
          <Route
            path="/purchase-success"
            element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchase-cancel"
            element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
          />

          {/* Payment Route - Wrapped in Elements */}
          <Route
            path="/payment"
            element={user ? (
              <Elements stripe={stripePromise}>
                <PaymentPage />
              </Elements>
            ) : <Navigate to="/login" />}
          />

          <Route
            path="/map"
            element={user ? <WrapperMap /> : <Navigate to="/login" />}
          />
            <Route path="/social-media" element={authUser ? <SocialMediaPage /> : <Navigate to="/login" />} />
            <Route path="/notification" element={authUser ? <NotificationsPage /> : <Navigate to="/login" />} />
            <Route path="/network" element={authUser ? <NetworkPage /> : <Navigate to="/login" />} />
            
            <Route path="/warehouse" element={user ? <Wrapper/> : <Navigate to="/login" />}>
            <Route index element={<Expenses />} />
            <Route path="products" element={<WarehouseInventories />} />
            <Route path="linechart" element={<Daily />} />
            <Route path="geography" element={<Geography />} />
            <Route path="create-inventory" element={<CreateInventory />} />
            <Route path="orders" element={<WarehouseOrders />} />
            <Route path="license-plate" element={<LicensePlateCapturePage />} />
          </Route>

          <Route path="/vehicle" element={user ? <WrapperVehicle/> : <Navigate to="/login" />}>
            <Route index element={<VehicleListPage />} />
          </Route>

          <Route path="/profile" element={user ? <ProfileLayout/> : <Navigate to="/login"/> }>
            <Route index element={<ProfilePage />} /> {/* This will be the default route */}
            <Route path="edit" element={<EditProfilePage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
            <Route path="address" element={<UserAddressesPage />} />
          </Route>

          <Route path="/feedback-forms/create" element={user ? <CreateFeedbackForm /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;

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
import { stripePromise } from './stripe';
import LicensePlateCapturePage from "./pages/Warehouse/LicensePlateCapturePage.jsx";
import CreateFeedbackForm from "./pages/FeedbackForm/CreateFeedbackForm.jsx";
import SocialMediaPage from "./pages/SocialMedia/SocialMediaPage.jsx";
import NotificationsPage from "./pages/SocialMedia/NotificationsPage.jsx";
import NetworkPage from "./pages/SocialMedia/NetworkPage.jsx";
import ChatWrapper from "./pages/Chat/ChatWrapper.jsx";
import DashboardLayout from "./pages/ChatBot/DashboardLayout.jsx";
import DashboardPage from "./pages/ChatBot/DashboardPage.jsx";
import ChatPage from "./pages/ChatBot/ChatPage.jsx";
import LiveStreamWrapper from "./pages/LiveStream/LiveStreamWrapper.jsx";
import { useTwoFactorAuthenticationStore } from "./stores/useTwoFactorAuthenticationStore.js";
import TwoFactorAuthentication from "./pages/TwoFactorAuthentication.jsx";
import Wheel from "./pages/Wheel/Wheel.jsx";
import Editor from "./pages/Editor/Editor.jsx";

function App() {
  const { user, checkingAuth, checkAuth } = useUserStore();
  const { is2FAComplete } = useTwoFactorAuthenticationStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  const require2FA = user && !is2FAComplete;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>

          {/* Auth */}
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to={is2FAComplete ? "/" : "/2fa"} />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to={is2FAComplete ? "/" : "/2fa"} />}
          />

          {/* 2FA */}
          <Route
            path="/2fa"
            element={
              user
                ? (is2FAComplete ? <Navigate to="/" /> : <TwoFactorAuthentication />)
                : <Navigate to="/login" />
            }
          />

          {/* Public */}
          <Route
            path="/"
            element={require2FA ? <Navigate to="/2fa" /> : <HomePage />}
          />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />

          {/* Admin */}
          <Route
            path="/secret-dashboard"
            element={
              user?.role === "admin"
                ? (require2FA ? <Navigate to="/2fa" /> : <AdminPage />)
                : <Navigate to="/" />
            }
          />

          {/* Protected */}
          <Route path="/cart" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <CartPage />) : <Navigate to="/login" />
          } />

          <Route path="/purchase-success" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <PurchaseSuccessPage />) : <Navigate to="/login" />
          } />

          <Route path="/purchase-cancel" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <PurchaseCancelPage />) : <Navigate to="/login" />
          } />

          <Route path="/payment" element={
            user
              ? (require2FA ? <Navigate to="/2fa" /> : (
                  <Elements stripe={stripePromise}>
                    <PaymentPage />
                  </Elements>
                ))
              : <Navigate to="/login" />
          } />

          <Route path="/social-media" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <SocialMediaPage />) : <Navigate to="/login" />
          } />

          <Route path="/notification" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <NotificationsPage />) : <Navigate to="/login" />
          } />

          <Route path="/network" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <NetworkPage />) : <Navigate to="/login" />
          } />

          <Route path="/map" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <WrapperMap />) : <Navigate to="/login" />
          } />

          {/* Warehouse */}
          <Route path="/warehouse" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <Wrapper />) : <Navigate to="/login" />
          }>
            <Route index element={<Expenses />} />
            <Route path="products" element={<WarehouseInventories />} />
            <Route path="linechart" element={<Daily />} />
            <Route path="geography" element={<Geography />} />
            <Route path="create-inventory" element={<CreateInventory />} />
            <Route path="orders" element={<WarehouseOrders />} />
            <Route path="license-plate" element={<LicensePlateCapturePage />} />
          </Route>

          {/* Vehicle */}
          <Route path="/vehicle" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <WrapperVehicle />) : <Navigate to="/login" />
          }>
            <Route index element={<VehicleListPage />} />
          </Route>

          {/* Profile */}
          <Route path="/profile" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <ProfileLayout />) : <Navigate to="/login" />
          }>
            <Route index element={<ProfilePage />} />
            <Route path="edit" element={<EditProfilePage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
            <Route path="address" element={<UserAddressesPage />} />
          </Route>

          {/* Chatbot */}
          <Route path="/chatbot" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <DashboardLayout />) : <Navigate to="/login" />
          }>
            <Route index element={<DashboardPage />} />
            <Route path="chats/:id" element={<ChatPage />} />
          </Route>

          <Route path="/feedback-forms/create" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <CreateFeedbackForm />) : <Navigate to="/login" />
          } />

          <Route path="/chat" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <ChatWrapper />) : <Navigate to="/login" />
          } />

          <Route path="/wheel" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <Wheel />) : <Navigate to="/login" />
          } />

          <Route path="/editor" element={
            user ? (require2FA ? <Navigate to="/2fa" /> : <Editor />) : <Navigate to="/login" />
          } />

          <Route path="/live-stream" element={
            user
              ? (require2FA ? <Navigate to="/2fa" /> : (
                  <Elements stripe={stripePromise}>
                    <LiveStreamWrapper />
                  </Elements>
                ))
              : <Navigate to="/login" />
          } />

        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
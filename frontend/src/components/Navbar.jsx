import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Lock,
  User,
} from "lucide-react";
import Select from "react-select";
import Flag from "react-world-flags";

import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

/* =======================
   NAV CONFIG
======================= */

const NAV_ITEMS = [
  { key: "home", label: "Home", path: "/" },
  { key: "warehouse", label: "Warehouse", path: "/warehouse" },
  { key: "vehicle", label: "Vehicle", path: "/vehicle" },
  { key: "map", label: "Map", path: "/map" },
  { key: "feedback", label: "Create Feedback Form", path: "/feedback-forms/create" },
  { key: "social", label: "Social Media", path: "/social-media" },
  { key: "notification", label: "Notifications", path: "/notification" },
  { key: "network", label: "Network", path: "/network" },
  { key: "chat", label: "Chat", path: "/chat" },
  { key: "chatbot", label: "Chat Bot", path: "/chatbot" },
  { key: "livestream", label: "Live Stream", path: "/live-stream" },
  { key: "editor", label: "Editor", path: "/editor" },
  { key: "cart", label: "Cart", path: "/cart" },
];

const ROLE_NAV_ACCESS = {
  Administration: NAV_ITEMS.map(i => i.key),

  WarehouseManager: ["home", "warehouse", "map", "notification"],

  VehicleManager: ["home", "vehicle", "map", "notification"],

  DeliveryDriver: ["home", "vehicle", "map", "notification"],
  DeliveryMan: ["home", "vehicle", "map", "notification"],

  Customer: [
    "home",
    "cart",
    "social",
    "notification",
    "network",
    "chat",
    "chatbot",
    "livestream",
    "editor",
  ],

  ProductSaler: [
    "home",
    "cart",
    "feedback",
    "social",
    "notification",
    "network",
    "chat",
    "chatbot",
    "livestream",
    "editor",
  ],

  CustomerSupportStaff: [
    "home",
    "social",
    "notification",
    "chat",
    "chatbot",
  ],

  FinanceManager: [
    "home",
    "cart",
    "notification",
    "map",
  ],

  ShipmentManager: [
    "home",
    "vehicle",
    "map",
    "notification",
  ],
};

/* =======================
   COMPONENT
======================= */

const Navbar = () => {
  const { user, logout, setLanguage } = useUserStore();
  const { cart } = useCartStore();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const role = user?.role;
  console.log(role);Z
  const allowedKeys = ROLE_NAV_ACCESS[role] || ["home"];
  const visibleNavItems = NAV_ITEMS.filter(item =>
    allowedKeys.includes(item.key)
  );

  /* ===== Language ===== */

  const languageOptions = [
    { value: "en", label: "English", flag: "GB" },
    { value: "es", label: "Spanish", flag: "ES" },
    { value: "fr", label: "French", flag: "FR" },
    { value: "de", label: "German", flag: "DE" },
    { value: "ka", label: "Georgian", flag: "GE" },
  ];

  const handleLanguageChange = (option) => {
    setSelectedLanguage(option);
    setLanguage(option.value);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 border-b border-emerald-800 z-50">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">

          {/* ===== Dynamic Tabs ===== */}
          {visibleNavItems.map(item => (
            <Link
              key={item.key}
              to={item.path}
              className="text-gray-300 hover:text-emerald-400 transition"
            >
              {item.label}
            </Link>
          ))}

          {/* ===== Cart ===== */}
          {user && allowedKeys.includes("cart") && (
            <Link
              to="/cart"
              className="relative text-gray-300 hover:text-emerald-400"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 text-xs">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {/* ===== Admin Dashboard ===== */}
          {role === "Administration" && (
            <Link
              to="/secret-dashboard"
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md flex items-center"
            >
              <Lock size={18} className="mr-1" />
              Dashboard
            </Link>
          )}

          {/* ===== Auth ===== */}
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center text-gray-300 hover:text-emerald-400"
              >
                <User size={20} className="mr-1" />
                Profile
              </Link>

              <button
                onClick={logout}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center"
              >
                <LogOut size={18} />
                <span className="ml-1 hidden sm:inline">Log Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md flex items-center"
              >
                <UserPlus size={18} className="mr-1" />
                Sign Up
              </Link>

              <Link
                to="/login"
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center"
              >
                <LogIn size={18} className="mr-1" />
                Login
              </Link>
            </>
          )}

          {/* ===== Language ===== */}
          <Select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            options={languageOptions}
            placeholder="Language"
            getOptionLabel={(e) => (
              <div className="flex items-center">
                <Flag code={e.flag} className="w-5 h-5 mr-2" />
                {e.label}
              </div>
            )}
            className="w-36"
            menuPortalTarget={document.body}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
            }}
          />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

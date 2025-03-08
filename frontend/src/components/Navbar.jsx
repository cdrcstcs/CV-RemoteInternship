import { useState } from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import Select from "react-select";
import Flag from "react-world-flags";

const Navbar = () => {
  const { user, logout, setLanguage } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Language options with flags
  const languageOptions = [
    { value: "en", label: "English", flag: "GB" },
    { value: "es", label: "Spanish", flag: "ES" },
    { value: "fr", label: "French", flag: "FR" },
    { value: "de", label: "German", flag: "DE" },
    { value: "ka", label: "Georgian", flag: "GE" },
    // Add more languages here as needed
  ];

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
    setLanguage(selectedOption.value);
    console.log(`Language changed to: ${selectedOption.label}`);
    // Here, you can handle language change logic like i18n or custom language change
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 border-b border-emerald-800 mb-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <nav className="flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link to={"/"} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
              Home
            </Link>
            <Link to={"/warehouse"} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
              Warehouse
            </Link>
            <Link to={"/vehicle"} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
              Vehicle
            </Link>
            <Link to={"/map"} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
              Map
            </Link>
            <Link to={"/feedback-forms/create"} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
              Create Feedback Form
            </Link>
            <Link to={"/social-media"} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
              Social Media
            </Link>
            <Link to={"/notification"} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
              Notifications
            </Link>
            <Link to={"/network"} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
              Network
            </Link>
            <Link to={"/chat"} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
              Chat
            </Link>
            <Link to={"/chatbot"} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
              Chat Bot
            </Link>
            <Link to={"/live-stream"} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
              Live Stream
            </Link>
            {user && (
              <Link
                to={"/cart"}
                className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
              >
                <ShoppingCart className="inline-block mr-1 group-hover:text-emerald-400" size={20} />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span
                    className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
                  >
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
                to={"/secret-dashboard"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <>
                {/* Profile Link */}
                <Link
                  to={"/profile"}
                  className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center"
                >
                  <User className="inline-block mr-2" size={20} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Log Out Button */}
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline ml-2">Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
            {/* Language Dropdown */}
            <div className="ml-4 relative">
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                options={languageOptions}
                getOptionLabel={(e) => (
                  <div className="flex items-center">
                    <Flag code={e.flag} className="w-5 h-5 mr-2" />
                    <span>{e.label}</span>
                  </div>
                )}
                className="w-36"
                classNamePrefix="react-select"
                placeholder="Language"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minWidth: 150,
                    zIndex: 9999, // Ensures dropdown is visible above other elements
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999, // Ensures dropdown is visible above other elements
                  }),
                }}
                menuPortalTarget={document.body} // Ensures dropdown is rendered correctly even in containers with overflow
              />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { dark, setDark } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo or Title */}
        <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
          💸 CryptoWallet
        </Link>

        {/* Right: Links + Toggle */}
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="text-sm text-gray-700 dark:text-gray-200 hover:underline"
          >
            Dashboard
          </Link>
          <Link
            to="/earn"
            className="text-sm text-gray-700 dark:text-gray-200 hover:underline"
          >
            Earn Points
          </Link>
          <Link
            to="/scan-pay"
            className="text-sm text-gray-700 dark:text-gray-200 hover:underline"
          >
            Scan & Pay
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

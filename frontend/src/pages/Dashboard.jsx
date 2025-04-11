import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useTheme } from "../context/ThemeContext";
import { notify } from "../utils/notify.js";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const { dark, setDark } = useTheme();

  useEffect(() => {
    if (!user) return navigate("/");
    const fetchBalance = async () => {
      try {
        const res = await axios.get(`${API}/api/wallet/balance`, {
          headers: {
            Authorization: user.token,
          },
        });
        setPoints(res.data.points);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBalance();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`${API}/api/wallet/transactions`, {
        headers: {
          Authorization: user.token,
        },
      })
      .then((res) => {
        const fetchedTransactions = res.data.transactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setTransactions(fetchedTransactions);

        const lastTxn = fetchedTransactions[0];
        const lastNotifiedId = localStorage.getItem("lastNotifiedTxnId");

        if (
          lastTxn &&
          lastTxn.type === "received" &&
          lastTxn._id !== lastNotifiedId
        ) {
          console.log("Triggering notification for received txn:", lastTxn);
          notify(
            "💸 Points Received!",
            `You got ${lastTxn.amount} points from ${lastTxn.with}`
          );
          localStorage.setItem("lastNotifiedTxnId", lastTxn._id);
        }
      })
      .catch((err) => {
        if (err.response?.status === 403 || err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          logout();
          navigate("/");
        } else {
          console.error("Failed to fetch transactions:", err);
        }
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 py-10 transition-colors">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6 transition-all">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Welcome, {user?.username} 👋
          </h1>
          <p className="text-md text-gray-600 dark:text-gray-300">
            Your current balance:
          </p>
          <p className="text-4xl font-bold text-green-600 mt-2 mb-4">
            {points} 💰 points
          </p>
        </div>

        <div className="flex flex-col items-center">
          <QRCodeCanvas value={user?.username} size={140} className="mb-2" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Scan this QR to pay <b>{user.username}</b>
          </p>
          <button
            onClick={() => navigate("/scan-pay")}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-5 rounded-lg transition"
          >
            🚀 Scan & Pay
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📜 Transaction History
          </h3>
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No transactions yet.
            </p>
          ) : (
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <li
                  key={tx._id}
                  className={`rounded-xl p-4 border shadow-sm transition ${
                    tx.type === "sent"
                      ? "bg-red-50 dark:bg-red-200/10 border-red-400"
                      : "bg-green-50 dark:bg-green-200/10 border-green-400"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {tx.type === "sent" ? "Sent to" : "Received from"}{" "}
                    <b>{tx.with}</b>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Amount: <b>{tx.amount}</b> points
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(tx.date).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <Link
            to="/earn"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            🎯 Earn More Points
          </Link>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              🚪 Logout
            </button>

            <button
              onClick={() => setDark(!dark)}
              className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg text-sm transition"
            >
              {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

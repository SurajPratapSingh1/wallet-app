import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useTheme } from "../context/ThemeContext";
const API = import.meta.env.VITE_API_BASE_URL;
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [points, setPoints] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();
    const { dark, setDark } = useTheme();

    useEffect(() => {
        if(!user) return navigate("/");
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
  
      axios.get(`${API}/api/wallet/transactions`, {
          headers: {
              Authorization: user.token
          }
      })
      .then((res) => {
          const fetchedTransactions = res.data.transactions;
          setTransactions(fetchedTransactions);

          const lastTxn = fetchedTransactions[0];
          const lastNotifiedId = localStorage.getItem("lastNotifiedTxnId");

          if (
              lastTxn &&
              lastTxn.type === "received" &&
              lastTxn._id !== lastNotifiedId
          ) {
              notify("💸 Points Received!", `You got ${lastTxn.amount} points from ${lastTxn.with}`);
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">Welcome, {user?.username} 👋</h1>
        <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">Your current balance:</p>
        <p className="text-4xl font-extrabold text-green-600 mb-6">{points} 💰 points</p>

        <QRCodeCanvas value={user?.username} size={128} className="mx-auto mt-4" />
        <p className="text-sm mt-2 text-black dark:text-white">
        Scan this QR to pay <b>{user.username}</b>
        </p>

        <button
        onClick={() => navigate("/scan-pay")}
        className="bg-purple-600 text-white mt-4 px-4 py-2 rounded hover:bg-purple-700 transition"
        >
        Scan & Pay
        </button>

        <div className="mt-10 w-full bg-white dark:bg-gray-800 shadow p-4 md:p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Transaction History</h3>
        {transactions.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">No transactions yet.</p>
        ) : (
        <ul className="space-y-3">
          {transactions.map((tx, index) => (
            <li
              key={index}
              className={`p-3 rounded-lg border ${
                tx.type === "sent"
                  ? "border-red-500 bg-red-50 dark:bg-red-200/20"
                  : "border-green-500 bg-green-50 dark:bg-green-200/20"
              }`}
            >
              <p className="font-medium text-black dark:text-white">
                {tx.type === "sent" ? "Sent to" : "Received from"} <b>{tx.with}</b>
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

    <Link to="/earn" className="text-blue-600 hover:underline block mt-4 dark:text-blue-400">
      Earn Points
    </Link>

    <button
      onClick={() => {
        logout();
        navigate("/");
      }}
      className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600 transition"
    >
      Logout
    </button>

    <button
      onClick={() => setDark(!dark)}
      className="text-sm px-4 py-2 mt-3 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
    >
      {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  </div>
</div>

    )

}
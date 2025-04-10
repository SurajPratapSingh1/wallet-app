import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { notify } from "../utils/Notify";
const API = import.meta.env.VITE_API_BASE_URL;

export default function ScanPay() {
    const { user } = useAuth();
    const [receiver, setReceiver] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handlePay = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/api/wallet/transfer`, {
                to: receiver,
                amount: Number(amount),
                }, {
                headers: {
                    Authorization: user.token,
                },
            });
            setMessage(res.data.message);
            notify("Payment Successful", `Sent ₹{amount} points to ${receiver}!`);
            setTimeout(() => navigate("/dashboard"),2000);
        } catch (err) {
          if (err.response?.status === 403 || err.response?.status === 401) {
            alert("Session expired. Please log in again.");
            logout();
            navigate("/");
          } else {
            setMessage(err.response?.data?.error || "Payment failed");
          }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <form onSubmit={handlePay} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md">
    <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Scan & Pay</h2>

    <input
      className="w-full mb-4 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
      placeholder="Receiver Username"
      value={receiver}
      onChange={(e) => setReceiver(e.target.value)}
      required
    />

    <input
      className="w-full mb-4 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
      placeholder="Amount"
      type="number"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      required
    />

    <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
      Send Points
    </button>

    {message && (
      <p className="mt-4 text-center text-sm text-green-700 dark:text-green-400">{message}</p>
    )}
  </form>
</div>

);

}
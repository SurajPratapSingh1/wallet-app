import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { notify } from "../utils/notify.js";
import { Html5Qrcode } from "html5-qrcode";

const API = import.meta.env.VITE_API_BASE_URL;

export default function ScanPay() {
  const { user, logout } = useAuth();
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const backCamera = devices.find((d) =>
          d.label.toLowerCase().includes("back")
        );
        const cameraId = backCamera ? backCamera.id : devices[0].id;

        scanner
          .start(
            cameraId,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              setReceiver(decodedText);
              notify("Scanned!", `Scanned username: ${decodedText}`);
              scanner.stop().then(() => console.log("Scanner stopped after scan"));
            },
            (errorMessage) => {
              console.warn("QR Scan Error:", errorMessage);
            }
          )
          .then(() => {
            scannerRef.current = scanner;
          })
          .catch((err) => {
            console.error("Error starting scanner:", err);
          });
      }
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current.clear())
          .catch((err) => console.error("Cleanup error:", err));
      }
    };
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API}/api/wallet/transfer`,
        {
          to: receiver,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: user.token,
          },
        }
      );

      notify("Payment Successful", `Sent ₹${amount} points to ${receiver}!`);
      setMessage(res.data.message || "Payment successful! Redirecting...");

      // Clean up QR scanner before redirect
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Payment Error:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        logout();
        navigate("/");
      } else {
        const fallbackMsg = "Payment failed. But if points were deducted, please check the receiver's wallet.";
        setMessage(err.response?.data?.error || fallbackMsg);
        notify("Payment Status", fallbackMsg);

        // Still redirect if payment might have succeeded silently
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4 text-center text-black dark:text-white">
          📷 Scan QR Code
        </h2>
        <div id="qr-reader" className="w-full aspect-square rounded-lg overflow-hidden" />
      </div>

      <form
        onSubmit={handlePay}
        className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
          Send Points
        </h2>

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

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Send Points"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-green-700 dark:text-green-400">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

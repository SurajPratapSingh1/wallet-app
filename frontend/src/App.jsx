import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ScanPay from './pages/ScanPay';
import EarnPoints from './pages/EarnPoints';
import Navbar from './components/NavBar';
import { askNotificationPermission } from './utils/notify.js';

function AppContent() {
  const location = useLocation();

  const hideNavbarPaths = ["/", "/register"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scan-pay" element={<ScanPay />} />
        <Route path="/earn" element={<EarnPoints />} />
      </Routes>
    </>
  );
}

export default function App() {
  useEffect(() => {
    askNotificationPermission();
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

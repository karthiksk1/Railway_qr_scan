import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from "@/components/auth/LoginForm";
import Navbar from "@/components/layout/Navbar";
import Dashboard from "@/pages/Dashboard";
import HomePage from '@/pages/HomePage';
import Installations from "@/pages/Installations";
import Inventory from "@/pages/Inventory";
import Reports from "@/pages/Reports";
import QRGenerator from '@/pages/QRGenerator';
import NotFound from "@/pages/NotFound";
import { useAuth } from '@/hooks/useAuth';
import LogoShowcase from '@/LogoShowcase';

const App = () => {
  const { user, login, logout } = useAuth();
  
  return ( 
    <div className="min-h-screen bg-background">
      {user && <Navbar userRole={user.role} onLogout={logout} />}
      {user && <LogoShowcase />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {!user ? (
            <>
              {/* Public-only route for login */}
              <Route path="/login" element={<LoginForm onLogin={login} />} />
              {/* Redirect any other path to login if not authenticated */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              {/* Default route after login */}
              <Route path="/" element={<HomePage userRole={user.role} />} />

              {/* Admin Routes */}
              {user.role === 'admin' && (
                <>
                  <Route path="/dashboard" element={<Dashboard userRole={user.role} />} />
                  <Route path="/qr-generator" element={<QRGenerator />} />
                  <Route path="/admin" element={<div>Admin Panel Coming Soon</div>} />
                </>
              )}

              {/* Inspector and Vendor Routes */}
              {(user.role === 'inspector' || user.role === 'vendor') && (
                <>
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/installations" element={<Installations />} />
                </>
              )}

              {/* Inspector-only Routes */}
              {user.role === 'inspector' && (
                <Route path="/reports" element={<Reports />} />
              )}

              {/* If logged in, redirect from /login to home */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              
              {/* Fallback for any other route when logged in - show not found page */}
              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};

export default App;

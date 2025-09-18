import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Home, 
  ScanLine, 
  Package, 
  Wrench, 
  BarChart3, 
  Settings,
  Menu,
  QrCode,
  X,
  LogOut,
  Train,
  LayoutDashboard
} from "lucide-react";
import { useModal } from "@/ModalContext";

interface NavbarProps {
  userRole: 'admin' | 'inspector' | 'vendor';
  onLogout: () => void;
}

const Navbar = ({ userRole, onLogout }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openScanner } = useModal();

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: "Home", path: "/" },
      { icon: ScanLine, label: "Scan", action: () => openScanner(userRole) },
    ];

    switch (userRole) {
      case 'admin':
        return [
          ...baseItems,
          { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
          { icon: QrCode, label: "Generator", path: "/qr-generator" },
          { icon: Settings, label: "Admin", path: "/admin" },
        ];
      case 'inspector':
        return [
          ...baseItems,
          { icon: Package, label: "Inventory", path: "/inventory" },
          { icon: Wrench, label: "Installations", path: "/installations" },
          { icon: BarChart3, label: "Reports", path: "/reports" },
        ];
      case 'vendor':
        return [
          ...baseItems,
          { icon: Package, label: "Inventory", path: "/inventory" },
          { icon: Wrench, label: "Installations", path: "/installations" },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-gradient-primary shadow-rail-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Train className="h-8 w-8 text-primary-foreground mr-3" />
              <h1 className="text-xl font-bold text-primary-foreground">
                Rail-QR
              </h1>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {navItems.map((item) => (
                <Fragment key={item.label}>
                  {item.path ? (
                    <Button asChild variant="ghost" className="text-primary-foreground hover:bg-primary-hover flex items-center space-x-2 px-3 py-2">
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="ghost" className="text-primary-foreground hover:bg-primary-hover flex items-center space-x-2 px-3 py-2" onClick={item.action}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <span className="text-primary-foreground/80 text-sm capitalize">
              {userRole}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-foreground"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Fragment key={item.label}>
                {item.path ? (
                  <Button asChild variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary-hover">
                    <Link to={item.path} onClick={() => setIsMenuOpen(false)}>
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Link>
                  </Button>
                ) : (
                  <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary-hover" onClick={() => { item.action(); setIsMenuOpen(false); }}>
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                )}
              </Fragment>
            ))}
            <div className="border-t border-primary-foreground/10 pt-3 mt-3">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-primary-foreground/80 text-sm capitalize">
                  {userRole}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};


export default Navbar;
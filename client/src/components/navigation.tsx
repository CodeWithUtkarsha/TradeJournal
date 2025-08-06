import { Link, useLocation } from "wouter";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ChartLine, Brain, BarChart3, User, LogOut } from "lucide-react";

interface NavigationProps {
  user?: any;
}

export default function Navigation({ user }: NavigationProps) {
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    auth.logout();
    setLocation("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-cyber-purple rounded-lg flex items-center justify-center">
              <ChartLine className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold gradient-text">TradeZella</span>
          </Link>
          
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/dashboard" data-testid="nav-dashboard">
                  <Button variant="ghost" className="text-gray-300 hover:text-electric-blue">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/analytics" data-testid="nav-analytics">
                  <Button variant="ghost" className="text-gray-300 hover:text-electric-blue">
                    <Brain className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
                <Link href="/profile" data-testid="nav-profile">
                  <Button variant="ghost" className="text-gray-300 hover:text-electric-blue">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  Welcome, {user.firstName}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-gray-300 hover:text-red-400"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" data-testid="nav-login">
                <Button variant="ghost" className="text-gray-300 hover:text-electric-blue">
                  Login
                </Button>
              </Link>
              <Link href="/signup" data-testid="nav-signup">
                <Button className="btn-primary" data-testid="button-signup">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

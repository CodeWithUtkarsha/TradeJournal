import { Switch, Route } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";
import type { User } from "@shared/schema";

// Components
import Navigation from "@/components/navigation";
import ProtectedRoute from "@/components/protected-route";

// Pages
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function AppContent() {
  // Get current user if authenticated
  const { data: userData } = useQuery<{ user: User } | null>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      if (!auth.isAuthenticated()) return null;
      
      try {
        const response = await auth.getCurrentUser();
        return response ? { user: response } : null;
      } catch {
        return null;
      }
    },
    enabled: auth.isAuthenticated(),
  });

  return (
    <div className="min-h-screen bg-dark-navy">
      <Navigation user={userData?.user} />
      
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        
        {/* Protected Routes */}
        <Route path="/dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>
        
        <Route path="/analytics">
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        </Route>
        
        <Route path="/profile">
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </Route>
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

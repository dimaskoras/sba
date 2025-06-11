import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import { useServerAuth } from "@/hooks/useServerAuth";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";

// Pages
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import About from "@/pages/About";
import Contacts from "@/pages/Contacts";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminRequests from "@/pages/admin/Requests";
import NotFound from "@/pages/not-found";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useServerAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">SmartBuildAstana - Админ панель</h1>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <a href="/admin/dashboard" className="text-brand-primary hover:text-brand-primary/80">Панель</a>
                <a href="/admin/products" className="text-brand-primary hover:text-brand-primary/80">Товары</a>
                <a href="/admin/categories" className="text-brand-primary hover:text-brand-primary/80">Категории</a>
                <a href="/admin/requests" className="text-brand-primary hover:text-brand-primary/80">Заявки</a>
                <a href="/" className="text-gray-600 hover:text-gray-800">На сайт</a>
              </nav>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Пользователь: {user?.username}</span>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/about" component={About} />
      <Route path="/contacts" component={Contacts} />
      
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard">
        <ProtectedAdminRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedAdminRoute>
      </Route>
      <Route path="/admin/products">
        <ProtectedAdminRoute>
          <AdminLayout>
            <AdminProducts />
          </AdminLayout>
        </ProtectedAdminRoute>
      </Route>
      <Route path="/admin/categories">
        <ProtectedAdminRoute>
          <AdminLayout>
            <AdminCategories />
          </AdminLayout>
        </ProtectedAdminRoute>
      </Route>
      <Route path="/admin/requests">
        <ProtectedAdminRoute>
          <AdminLayout>
            <AdminRequests />
          </AdminLayout>
        </ProtectedAdminRoute>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Switch>
            <Route path="/admin/*">
              <Router />
            </Route>
            <Route>
              <Layout>
                <Router />
              </Layout>
            </Route>
          </Switch>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

import { useState, useEffect } from "react";
import "@fontsource/inter";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Products } from "./components/Products";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminProductsPage } from "./pages/AdminProductsPage";
import { AdminProductEdit } from "./pages/AdminProductEdit";

interface Product {
  id?: number;
  name: string;
  nameAr: string;
  brand: string;
  price: string;
  image: string;
  inStock: boolean;
  features: string[];
  whatsappMessage: string;
}

type AdminPage = "login" | "dashboard" | "products" | "edit" | null;

function App() {
  const [adminPage, setAdminPage] = useState<AdminPage>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Check URL on mount
  useEffect(() => {
    const pathName = window.location.pathname;
    if (pathName.includes("/admin")) {
      // Check if already logged in (in session)
      const logged = sessionStorage.getItem("adminLoggedIn");
      if (logged) {
        setIsLoggedIn(true);
        setAdminPage("dashboard");
      } else {
        setAdminPage("login");
      }
    }
  }, []);

  const handleLogin = (password: string) => {
    setIsLoggedIn(true);
    sessionStorage.setItem("adminLoggedIn", "true");
    setAdminPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminPage("login");
    sessionStorage.removeItem("adminLoggedIn");
  };

  const handleSelectPage = (page: string) => {
    setAdminPage(page as AdminPage);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setAdminPage("edit");
  };

  const handleSaveProduct = async (product: Product) => {
    try {
      if (product.id) {
        await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
      }
      setAdminPage("products");
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Render admin pages
  if (adminPage === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (adminPage === "dashboard" && isLoggedIn) {
    return (
      <AdminDashboard onLogout={handleLogout} onSelectPage={handleSelectPage} />
    );
  }

  if (adminPage === "products" && isLoggedIn) {
    return (
      <AdminProductsPage
        onBack={() => setAdminPage("dashboard")}
        onEditProduct={handleEditProduct}
        onLogout={handleLogout}
      />
    );
  }

  if (adminPage === "edit" && isLoggedIn) {
    return (
      <AdminProductEdit
        product={editingProduct}
        onBack={() => setAdminPage("products")}
        onSave={handleSaveProduct}
        onLogout={handleLogout}
      />
    );
  }

  // Default: render home page
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Products />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;

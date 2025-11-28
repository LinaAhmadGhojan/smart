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
import { AdminCategoriesPage } from "./pages/AdminCategoriesPage";
import { AdminCategoryEdit } from "./pages/AdminCategoryEdit";

interface Product {
  id?: number;
  name: string;
  nameAr: string;
  brand: string;
  price: string;
  image: string;
  inStock: boolean;
  categoryId?: number;
  features: string[];
  whatsappMessage: string;
}

interface Category {
  id?: number;
  name: string;
  nameAr: string;
  description?: string;
}

type AdminPage = "login" | "dashboard" | "products" | "edit" | "categories" | "categoryEdit" | null;

function App() {
  const [adminPage, setAdminPage] = useState<AdminPage>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Check URL on mount and route accordingly
  useEffect(() => {
    const pathName = window.location.pathname;
    const logged = sessionStorage.getItem("adminLoggedIn");

    if (pathName === "/admin" || pathName === "/admin/") {
      if (logged) {
        setIsLoggedIn(true);
        setAdminPage("dashboard");
      } else {
        setAdminPage("login");
      }
    } else if (pathName === "/admin/products") {
      if (logged) {
        setIsLoggedIn(true);
        setAdminPage("products");
      } else {
        setAdminPage("login");
      }
    } else if (pathName === "/admin/categories") {
      if (logged) {
        setIsLoggedIn(true);
        setAdminPage("categories");
      } else {
        setAdminPage("login");
      }
    }
  }, []);

  const handleLogin = (email: string, userId: number) => {
    setIsLoggedIn(true);
    sessionStorage.setItem("adminLoggedIn", "true");
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userId", userId.toString());
    setAdminPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminPage("login");
    sessionStorage.removeItem("adminLoggedIn");
  };

  const handleSelectPage = (page: string) => {
    setAdminPage(page as AdminPage);
    // Update URL
    if (page === "dashboard") {
      window.history.pushState({}, "", "/admin");
    } else if (page === "products") {
      window.history.pushState({}, "", "/admin/products");
    } else if (page === "categories") {
      window.history.pushState({}, "", "/admin/categories");
    }
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
      window.history.pushState({}, "", "/admin/products");
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setAdminPage("categoryEdit");
  };

  const handleSaveCategory = async (category: Category) => {
    try {
      if (category.id) {
        await fetch(`/api/categories/${category.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        });
      } else {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        });
      }
      setAdminPage("categories");
      window.history.pushState({}, "", "/admin/categories");
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
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

  if (adminPage === "categories" && isLoggedIn) {
    return (
      <AdminCategoriesPage
        onBack={() => setAdminPage("dashboard")}
        onEditCategory={handleEditCategory}
        onLogout={handleLogout}
      />
    );
  }

  if (adminPage === "categoryEdit" && isLoggedIn) {
    return (
      <AdminCategoryEdit
        category={editingCategory}
        onBack={() => setAdminPage("categories")}
        onSave={handleSaveCategory}
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

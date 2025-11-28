import { useState } from "react";
import "@fontsource/inter";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Products } from "./components/Products";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { AdminProducts } from "./pages/AdminProducts";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  // Check if admin page is requested via URL hash
  const pathName = window.location.pathname;
  const isAdmin = pathName.includes("/admin");

  if (isAdmin) {
    return <AdminProducts />;
  }

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

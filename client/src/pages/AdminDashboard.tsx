import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

interface DashboardProps {
  onLogout: () => void;
  onSelectPage: (page: string) => void;
}

interface Stats {
  productsCount: number;
  categoriesCount: number;
}

export function AdminDashboard({ onLogout, onSelectPage }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({ productsCount: 0, categoriesCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const productsRes = await fetch("/api/products");
      const productsData = await productsRes.json();
      const categoriesRes = await fetch("/api/categories");
      const categoriesData = await categoriesRes.json();

      setStats({
        productsCount: productsData.products?.length || 0,
        categoriesCount: Array.isArray(categoriesData) ? categoriesData.length : 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="pt-24 pb-20 bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl font-bold text-blue-900">📊 لوحة التحكم</h1>
              <p className="text-gray-600 mt-2">مرحباً بك في إدارة محتوى SmartFlow</p>
            </div>
            <Button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 px-6 py-2"
            >
              🚪 تسجيل خروج
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <Card className="border-l-4 border-blue-600 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 font-semibold">إجمالي المنتجات</p>
                        <p className="text-5xl font-bold text-blue-600">{stats.productsCount}</p>
                      </div>
                      <div className="text-6xl">📦</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-green-600 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 font-semibold">إجمالي الفئات</p>
                        <p className="text-5xl font-bold text-green-600">{stats.categoriesCount}</p>
                      </div>
                      <div className="text-6xl">📂</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Management Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Products Management */}
                <Card className="hover:shadow-2xl transition-all cursor-pointer hover:scale-105 border-2 border-transparent hover:border-blue-500">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <span className="text-4xl">📦</span>
                      إدارة المنتجات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      أضف وعدّل واحذف المنتجات من المتجر. أدر الأسعار والصور والأوصاف.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => onSelectPage("products")}
                        className="bg-blue-600 hover:bg-blue-700 flex-1"
                      >
                        ➜ إدارة المنتجات
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Categories Management */}
                <Card className="hover:shadow-2xl transition-all cursor-pointer hover:scale-105 border-2 border-transparent hover:border-green-500">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <span className="text-4xl">📂</span>
                      إدارة الفئات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      أنشئ وعدّل وحذف الفئات المختلفة. نظم منتجاتك بشكل أفضل.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => onSelectPage("categories")}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        ➜ إدارة الفئات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

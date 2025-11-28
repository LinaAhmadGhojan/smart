import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

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

interface AdminProductsPageProps {
  onBack: () => void;
  onEditProduct: (product: Product) => void;
  onLogout: () => void;
}

export function AdminProductsPage({ onBack, onEditProduct, onLogout }: AdminProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("تأكيد الحذف؟")) {
      try {
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="pt-24 pb-20 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-blue-900">📦 إدارة المنتجات</h1>
              <p className="text-gray-600 mt-2">{products.length} منتج</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  const emptyProduct: Product = {
                    name: "",
                    nameAr: "",
                    brand: "",
                    price: "",
                    image: "",
                    inStock: true,
                    features: [],
                    whatsappMessage: "",
                  };
                  onEditProduct(emptyProduct);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                + منتج جديد
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
              >
                ← رجوع للداشبورد
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : (
            <>
              {products.length === 0 ? (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-2xl text-gray-500 mb-6">لا توجد منتجات</p>
                    <Button
                      onClick={() => {
                        const emptyProduct: Product = {
                          name: "",
                          nameAr: "",
                          brand: "",
                          price: "",
                          image: "",
                          inStock: true,
                          features: [],
                          whatsappMessage: "",
                        };
                        onEditProduct(emptyProduct);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      + أضف أول منتج
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-blue-900 text-white">
                      <tr>
                        <th className="px-6 py-4 text-right">الصورة</th>
                        <th className="px-6 py-4 text-right">الاسم</th>
                        <th className="px-6 py-4 text-right">العلامة</th>
                        <th className="px-6 py-4 text-right">السعر</th>
                        <th className="px-6 py-4 text-right">الحالة</th>
                        <th className="px-6 py-4 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr
                          key={product.id}
                          className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors`}
                        >
                          <td className="px-6 py-4">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-blue-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.nameAr}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{product.brand}</td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-green-600">{product.price}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                product.inStock
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.inStock ? "✓ متوفر" : "✗ غير متوفر"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                onClick={() => onEditProduct(product)}
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600"
                              >
                                ✎ تعديل
                              </Button>
                              <Button
                                onClick={() => product.id && handleDelete(product.id)}
                                size="sm"
                                className="bg-red-500 hover:bg-red-600"
                              >
                                × حذف
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

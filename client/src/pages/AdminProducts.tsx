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
  categoryId?: number;
  features: string[];
  whatsappMessage: string;
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Product>({
    name: "",
    nameAr: "",
    brand: "",
    price: "",
    image: "",
    inStock: true,
    features: [],
    whatsappMessage: "",
  });

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

  const handleSave = async () => {
    try {
      if (editingProduct?.id) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
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

  const resetForm = () => {
    setFormData({
      name: "",
      nameAr: "",
      brand: "",
      price: "",
      image: "",
      inStock: true,
      features: [],
      whatsappMessage: "",
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  if (loading) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  return (
    <>
      <Header />
      <div className="pt-24 pb-20 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900">إدارة المنتجات</h1>
            <Button
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: "",
                  nameAr: "",
                  brand: "",
                  price: "",
                  image: "",
                  inStock: true,
                  features: [],
                  whatsappMessage: "",
                });
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              + إضافة منتج جديد
            </Button>
          </div>

          {showForm && (
            <Card className="mb-8 border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">اسم المنتج (إنجليزي)</label>
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">اسم المنتج (عربي)</label>
                    <input
                      type="text"
                      placeholder="اسم المنتج"
                      value={formData.nameAr}
                      onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">العلامة التجارية</label>
                    <input
                      type="text"
                      placeholder="Brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">السعر</label>
                    <input
                      type="text"
                      placeholder="2,000.00 AED"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">رابط الصورة</label>
                  <input
                    type="text"
                    placeholder="/smartflow-logo.jpeg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">رسالة WhatsApp</label>
                  <textarea
                    placeholder="رسالة WhatsApp الافتراضية"
                    value={formData.whatsappMessage}
                    onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 h-24"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">متوفر | In Stock</span>
                </label>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 px-8"
                  >
                    حفظ المنتج
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {products.length === 0 ? (
              <Card>
                <CardContent className="pt-8 text-center text-gray-500">
                  لا توجد منتجات. اضغط "إضافة منتج جديد" للبدء!
                </CardContent>
              </Card>
            ) : (
              products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h3 className="text-xl font-bold text-blue-900">
                              {product.name}
                            </h3>
                            <p className="text-gray-600">{product.nameAr}</p>
                            <p className="text-sm text-gray-500">العلامة: {product.brand}</p>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mb-2">
                          {product.price}
                        </p>
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded text-sm font-semibold ${
                              product.inStock
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.inStock ? "✓ متوفر" : "✗ غير متوفر"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          onClick={() => startEdit(product)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          ✎ تعديل
                        </Button>
                        <Button
                          onClick={() => product.id && handleDelete(product.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          × حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

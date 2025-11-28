import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

interface Product {
  id?: number;
  name: string;
  nameAr: string;
  brand?: string;
  price: string;
  image?: string;
  inStock: boolean;
  categoryId?: number;
  features?: string[];
  whatsappMessage?: string;
}

interface AdminProductsPageProps {
  onBack: () => void;
  onEditProduct: (product: Product) => void;
  onLogout: () => void;
}

interface Category {
  id: number;
  name: string;
  nameAr: string;
}

export function AdminProducts({ onBack, onEditProduct, onLogout }: AdminProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">(0);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    nameAr: "",
    price: "",
    inStock: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.nameAr || !newProduct.price) {
      alert("يرجى ملء جميع الحقول المطلوبة!");
      return;
    }

    let imageUrl = newProduct.image;

    // Upload image if selected
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);
      try {
        const uploadRes = await fetch("/api/products/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.image;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("خطأ في رفع الصورة!");
        return;
      }
    }

    try {
      const productData = {
        ...newProduct,
        image: imageUrl,
        categoryId: selectedCategory ? parseInt(selectedCategory.toString()) : null,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        setNewProduct({ name: "", nameAr: "", price: "", inStock: true });
        setSelectedImage(null);
        setImagePreview("");
        setSelectedCategory("");
        setShowForm(false);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("خطأ في إضافة المنتج!");
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

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "بدون فئة";
    const category = categories.find((c) => c.id === categoryId);
    return category?.nameAr || "فئة غير معروفة";
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
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {showForm ? "إلغاء" : "+ منتج جديد"}
              </Button>
              <Button onClick={onBack} variant="outline">
                ← رجوع للداشبورد
              </Button>
            </div>
          </div>

          {/* Add Product Form */}
          {showForm && (
            <Card className="mb-8 bg-blue-50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="اسم المنتج (English)"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="اسم المنتج (عربي)"
                    value={newProduct.nameAr}
                    onChange={(e) => setNewProduct({ ...newProduct, nameAr: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="الماركة (اختياري)"
                    value={newProduct.brand || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="السعر"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value === "" ? "" : parseInt(e.target.value))}
                    className="border rounded px-3 py-2"
                  >
                    <option value="">-- اختر فئة --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameAr} ({cat.name})
                      </option>
                    ))}
                  </select>
                  <label className="border rounded px-3 py-2 cursor-pointer bg-white hover:bg-gray-50">
                    📷 اختر صورة
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">معاينة الصورة:</p>
                    <img src={imagePreview} alt="preview" className="max-w-xs max-h-40 rounded" />
                  </div>
                )}

                <div className="mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newProduct.inStock}
                      onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                    />
                    <span>متوفر بالمخزن</span>
                  </label>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
                    💾 حفظ المنتج
                  </Button>
                  <Button
                    onClick={() => {
                      setShowForm(false);
                      setNewProduct({ name: "", nameAr: "", price: "", inStock: true });
                      setSelectedImage(null);
                      setImagePreview("");
                      setSelectedCategory("");
                    }}
                    variant="outline"
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Table */}
          {loading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-2xl text-gray-500 mb-6">لا توجد منتجات</p>
                <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  + أضف أول منتج
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-3 text-right">الصورة</th>
                    <th className="border p-3 text-right">الاسم (عربي)</th>
                    <th className="border p-3 text-right">الاسم (EN)</th>
                    <th className="border p-3 text-right">السعر</th>
                    <th className="border p-3 text-right">الفئة</th>
                    <th className="border p-3 text-right">الحالة</th>
                    <th className="border p-3 text-right">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 border-b">
                      <td className="border p-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.nameAr}
                            className="h-12 w-12 rounded object-cover"
                          />
                        )}
                      </td>
                      <td className="border p-3">{product.nameAr}</td>
                      <td className="border p-3">{product.name}</td>
                      <td className="border p-3">{product.price}</td>
                      <td className="border p-3 text-sm">{getCategoryName(product.categoryId)}</td>
                      <td className="border p-3 text-sm">
                        <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                          {product.inStock ? "✅ متوفر" : "❌ غير متوفر"}
                        </span>
                      </td>
                      <td className="border p-3 space-x-2">
                        <Button
                          onClick={() => onEditProduct(product)}
                          size="sm"
                          variant="outline"
                          className="text-blue-600"
                        >
                          ✏️ تعديل
                        </Button>
                        <Button
                          onClick={() => handleDelete(product.id!)}
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          🗑️ حذف
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

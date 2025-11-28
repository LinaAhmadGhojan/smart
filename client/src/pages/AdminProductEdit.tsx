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

interface Category {
  id: number;
  name: string;
  nameAr: string;
}

interface AdminProductEditProps {
  product: Product | null;
  onBack: () => void;
  onSave: (product: Product) => Promise<void>;
  onLogout: () => void;
}

export function AdminProductEdit({ product, onBack, onSave, onLogout }: AdminProductEditProps) {
  const [formData, setFormData] = useState<Product>(
    product || {
      name: "",
      nameAr: "",
      brand: "",
      price: "",
      image: "",
      inStock: true,
      categoryId: undefined,
      features: [],
      whatsappMessage: "",
    }
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(formData.image || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let imageUrl = formData.image;

      // Upload image if a new file was selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", selectedFile);
        try {
          const uploadRes = await fetch("/api/products/upload", {
            method: "POST",
            body: uploadFormData,
          });
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.image;
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("خطأ في رفع الصورة!");
          setSaving(false);
          return;
        }
      }

      const productToSave = {
        ...formData,
        image: imageUrl,
      };

      await onSave(productToSave);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <div className="pt-24 pb-20 bg-white min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900">
              {product?.id ? "✎ تعديل المنتج" : "+ منتج جديد"}
            </h1>
            <Button onClick={onBack} variant="outline">
              ← رجوع
            </Button>
          </div>

          <Card className="border-2 border-blue-500">
            <CardContent className="pt-8 space-y-6">
              {/* English Name */}
              <div>
                <label className="block font-bold mb-2 text-blue-900">
                  اسم المنتج (إنجليزي)
                </label>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Arabic Name */}
              <div>
                <label className="block font-bold mb-2 text-blue-900">
                  اسم المنتج (عربي)
                </label>
                <input
                  type="text"
                  placeholder="اسم المنتج"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block font-bold mb-2 text-blue-900">
                  العلامة التجارية
                </label>
                <input
                  type="text"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block font-bold mb-2 text-blue-900">
                  السعر
                </label>
                <input
                  type="text"
                  placeholder="2,000.00 AED"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold mb-2 text-blue-900">
                  الفئة
                </label>
                <select
                  value={formData.categoryId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryId: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- اختر فئة (اختياري) --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameAr} ({cat.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Image File Upload */}
              <div>
                <label className="block font-bold mb-2 text-blue-900">
                  📷 الصورة
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {selectedFile ? `✓ تم اختيار: ${selectedFile.name}` : "اختر ملف صورة"}
                </p>
                {imagePreview && (
                  <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-40 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              {/* WhatsApp Message */}
              <div>
                <label className="block font-bold mb-2 text-blue-900">
                  رسالة WhatsApp الافتراضية
                </label>
                <textarea
                  placeholder="رسالة WhatsApp"
                  value={formData.whatsappMessage}
                  onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-24"
                />
              </div>

              {/* In Stock */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-6 h-6"
                />
                <span className="font-bold text-blue-900">متوفر | In Stock</span>
              </label>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 flex-1 py-3 font-bold"
                >
                  {saving ? "جاري الحفظ..." : "✓ حفظ المنتج"}
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="px-8 py-3"
                >
                  ✕ إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}

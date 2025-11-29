import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Product {
  id?: number;
  name: string;
  nameAr: string;
  brand: string;
  price: string;
  image: string;
  categoryId?: number;
  inStock: boolean;
  features: string[];
  whatsappMessage: string;
}

interface Category {
  id: number;
  name: string;
  nameAr: string;
}

export function AdminProductForm({ onProductSaved, product: initialProduct }: { onProductSaved?: () => void; product?: any }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product>(
    initialProduct || {
      name: "",
      nameAr: "",
      brand: "SmartFlow",
      price: "",
      image: "",
      categoryId: undefined,
      inStock: true,
      features: [""],
      whatsappMessage: "",
    }
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...product.features];
    newFeatures[index] = value;
    setProduct((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const addFeature = () => {
    setProduct((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setProduct((prev) => ({
        ...prev,
        image: data.image,
      }));
      alert("✅ تم رفع الصورة بنجاح!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("❌ خطأ في رفع الصورة");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...product,
      categoryId: product.categoryId ? parseInt(String(product.categoryId)) : undefined,
      features: product.features.filter((f) => f.trim() !== ""),
    };

    try {
      const method = product.id ? "PUT" : "POST";
      const url = product.id ? `/api/products/${product.id}` : "/api/products";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        const message = product.id ? "✅ تم تحديث المنتج بنجاح!" : "✅ تم إضافة المنتج بنجاح!";
        alert(message);
        setProduct({
          name: "",
          nameAr: "",
          brand: "SmartFlow",
          price: "",
          image: "",
          categoryId: undefined,
          inStock: true,
          features: [""],
          whatsappMessage: "",
        });
        onProductSaved?.();
      } else {
        const errorMsg = product.id ? "❌ خطأ في تحديث المنتج" : "❌ خطأ في إضافة المنتج";
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("❌ خطأ في الاتصال");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-50 border-b-2 border-blue-200">
        <CardTitle className="text-2xl">
          {product.id ? "تعديل المنتج | Edit Product" : "+ منتج جديد | Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* English Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">اسم المنتج (إنجليزي)</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Arabic Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">اسم المنتج (عربي)</label>
            <input
              type="text"
              name="nameAr"
              value={product.nameAr}
              onChange={handleInputChange}
              placeholder="اسم المنتج"
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">العلامة التجارية</label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
              placeholder="Brand"
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price with Currency */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">السعر</label>
            <input
              type="text"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              placeholder="2,000.00 AED"
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">مثال: 2,000.00 AED</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">الفئة</label>
            <select
              name="categoryId"
              value={product.categoryId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- اختر فئة (اختياري) --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameAr} ({cat.name})
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">📷 الصورة</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border-2 rounded-lg"
            />
            {product.image && (
              <div className="mt-2">
                <img
                  src={product.image}
                  alt="Product preview"
                  className="w-24 h-24 object-contain border rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">✅ تم رفع الصورة</p>
              </div>
            )}
          </div>

          {/* Features - DYNAMIC */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-gray-900">✨ المميزات</label>
              <Button
                type="button"
                onClick={addFeature}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
              >
                + إضافة ميزة
              </Button>
            </div>

            <div className="space-y-3">
              {product.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1} / الميزة ${index + 1}`}
                    className="flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {product.features.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3"
                    >
                      حذف
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Message */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">رسالة واتساب</label>
            <textarea
              name="whatsappMessage"
              value={product.whatsappMessage}
              onChange={handleInputChange}
              placeholder="مثال: مرحباً، أنا مهتم بهذا المنتج"
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* In Stock */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              name="inStock"
              checked={product.inStock}
              onChange={handleInputChange}
              className="w-5 h-5 cursor-pointer"
            />
            <label className="text-sm font-medium cursor-pointer">متوفر في المخزن ✅</label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg">
            {product.id ? "💾 حفظ التعديلات" : "➕ إضافة المنتج"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

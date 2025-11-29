import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Product {
  id?: number;
  name: string;
  nameAr: string;
  brand: string;
  price: string;
  currency: string;
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

export function AdminProductForm({ onProductSaved }: { onProductSaved?: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product>({
    name: "",
    nameAr: "",
    brand: "SmartFlow",
    price: "",
    currency: "AED",
    image: "",
    categoryId: undefined,
    inStock: true,
    features: [""],
    whatsappMessage: "",
  });

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
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        alert("✅ تم إضافة المنتج بنجاح!");
        setProduct({
          name: "",
          nameAr: "",
          brand: "SmartFlow",
          price: "",
          currency: "AED",
          image: "",
          categoryId: undefined,
          inStock: true,
          features: [""],
          whatsappMessage: "",
        });
        onProductSaved?.();
      } else {
        alert("❌ خطأ في إضافة المنتج");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("❌ خطأ في الاتصال");
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>إضافة منتج جديد | Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* English Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Name (English)</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              placeholder="e.g. Automatic Gate System"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Arabic Name */}
          <div>
            <label className="block text-sm font-medium mb-2">اسم المنتج (عربي)</label>
            <input
              type="text"
              name="nameAr"
              value={product.nameAr}
              onChange={handleInputChange}
              placeholder="مثال: نظام البوابة الأوتوماتيكية"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
              placeholder="e.g. SmartFlow"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="text"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                placeholder="e.g. 2,500.00"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <input
                type="text"
                name="currency"
                value={product.currency}
                onChange={handleInputChange}
                placeholder="AED"
                maxLength={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="categoryId"
              value={product.categoryId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} - {cat.nameAr}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {product.image && (
              <div className="mt-2">
                <img
                  src={product.image}
                  alt="Product preview"
                  className="w-32 h-32 object-contain border rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Image URL: {product.image}</p>
              </div>
            )}
          </div>

          {/* Features - DYNAMIC */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold">✨ Features (المميزات)</label>
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
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium mb-2">WhatsApp Message (Arabic)</label>
            <textarea
              name="whatsappMessage"
              value={product.whatsappMessage}
              onChange={handleInputChange}
              placeholder="مثال: مرحباً، أنا مهتم بهذا المنتج"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* In Stock */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              checked={product.inStock}
              onChange={handleInputChange}
              className="w-4 h-4 cursor-pointer"
            />
            <label className="text-sm font-medium cursor-pointer">In Stock ✅</label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
            إضافة المنتج | Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

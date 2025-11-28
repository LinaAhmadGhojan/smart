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
  inStock: boolean;
  categoryId?: number;
  features: string[];
  whatsappMessage: string;
}

interface Category {
  id?: number;
  name: string;
  nameAr: string;
}

export function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSave = async (product: Product) => {
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
      setEditingProduct(null);
      setShowForm(false);
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

  if (loading) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-900">إدارة المنتجات</h1>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + إضافة منتج
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              product={editingProduct || {
                name: "",
                nameAr: "",
                brand: "",
                price: "",
                image: "",
                inStock: true,
                features: [],
                whatsappMessage: "",
              }}
              categories={categories}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900">{product.name}</h3>
                  <p className="text-gray-600">{product.nameAr}</p>
                  <p className="text-green-600 font-bold mt-2">{product.price}</p>
                  <div className="mt-2 flex gap-2">
                    <span className={`px-3 py-1 rounded text-sm ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {product.inStock ? "متوفر" : "غير متوفر"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    تعديل
                  </Button>
                  <Button
                    onClick={() => product.id && handleDelete(product.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                  >
                    حذف
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product: Product;
  categories: Category[];
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(product);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Product Name (English)"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="text"
        placeholder="اسم المنتج (عربي)"
        value={formData.nameAr}
        onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="text"
        placeholder="Brand"
        value={formData.brand}
        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="text"
        placeholder="Price (e.g., 2,000.00 AED)"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="text"
        placeholder="Image URL"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.inStock}
          onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
        />
        <span>متوفر | In Stock</span>
      </label>
      <div className="flex gap-2">
        <Button onClick={() => onSave(formData)} className="bg-green-600 hover:bg-green-700">
          حفظ
        </Button>
        <Button onClick={onCancel} variant="outline">
          إلغاء
        </Button>
      </div>
    </div>
  );
}

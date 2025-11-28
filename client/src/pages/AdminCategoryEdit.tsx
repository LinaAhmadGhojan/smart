import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

interface Category {
  id?: number;
  name: string;
  nameAr: string;
  description?: string;
}

interface AdminCategoryEditProps {
  category: Category | null;
  onBack: () => void;
  onSave: (category: Category) => Promise<void>;
  onLogout: () => void;
}

export function AdminCategoryEdit({ category, onBack, onSave, onLogout }: AdminCategoryEditProps) {
  const [formData, setFormData] = useState<Category>(
    category || {
      name: "",
      nameAr: "",
      description: "",
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
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
            <h1 className="text-4xl font-bold text-green-900">
              {category?.id ? "✎ تعديل الفئة" : "+ فئة جديدة"}
            </h1>
            <Button onClick={onBack} variant="outline">
              ← رجوع
            </Button>
          </div>

          <Card className="border-2 border-green-500">
            <CardContent className="pt-8 space-y-6">
              {/* Arabic Name */}
              <div>
                <label className="block font-bold mb-2 text-green-900">
                  اسم الفئة (عربي)
                </label>
                <input
                  type="text"
                  placeholder="اسم الفئة"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>

              {/* English Name */}
              <div>
                <label className="block font-bold mb-2 text-green-900">
                  اسم الفئة (إنجليزي)
                </label>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold mb-2 text-green-900">
                  الوصف (اختياري)
                </label>
                <textarea
                  placeholder="وصف الفئة"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 h-24"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 flex-1 py-3 font-bold"
                >
                  {saving ? "جاري الحفظ..." : "✓ حفظ الفئة"}
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

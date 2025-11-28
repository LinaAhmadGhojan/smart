import { useState, useEffect } from "react";
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

interface AdminCategoriesPageProps {
  onBack: () => void;
  onEditCategory: (category: Category) => void;
  onLogout: () => void;
}

export function AdminCategoriesPage({ onBack, onEditCategory, onLogout }: AdminCategoriesPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("تأكيد الحذف؟")) {
      try {
        await fetch(`/api/categories/${id}`, { method: "DELETE" });
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
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
              <h1 className="text-4xl font-bold text-green-900">📂 إدارة الفئات</h1>
              <p className="text-gray-600 mt-2">{categories.length} فئة</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  const emptyCategory: Category = {
                    name: "",
                    nameAr: "",
                    description: "",
                  };
                  onEditCategory(emptyCategory);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                + فئة جديدة
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
              {categories.length === 0 ? (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-2xl text-gray-500 mb-6">لا توجد فئات</p>
                    <Button
                      onClick={() => {
                        const emptyCategory: Category = {
                          name: "",
                          nameAr: "",
                          description: "",
                        };
                        onEditCategory(emptyCategory);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      + أضف أول فئة
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-green-900 text-white">
                      <tr>
                        <th className="px-6 py-4 text-right">الاسم (عربي)</th>
                        <th className="px-6 py-4 text-right">الاسم (إنجليزي)</th>
                        <th className="px-6 py-4 text-right">الوصف</th>
                        <th className="px-6 py-4 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category, index) => (
                        <tr
                          key={category.id}
                          className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50 transition-colors`}
                        >
                          <td className="px-6 py-4">
                            <p className="font-bold text-green-900">{category.nameAr}</p>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{category.name}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm">
                            {category.description || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                onClick={() => onEditCategory(category)}
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                              >
                                ✎ تعديل
                              </Button>
                              <Button
                                onClick={() => category.id && handleDelete(category.id)}
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

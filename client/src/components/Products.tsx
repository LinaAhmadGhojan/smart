import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Product {
  id: number;
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

interface CompanyInfo {
  contact: {
    whatsapp: string;
  };
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/categories').then(res => res.json()),
      fetch('/company-info.json').then(res => res.json())
    ])
      .then(([productsData, categoriesData, companyData]) => {
        setProducts(productsData.products || []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setCompanyInfo(companyData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return null;
    const category = categories.find((c) => c.id === categoryId);
    return category;
  };

  const handleWhatsAppClick = (product: Product) => {
    const phoneNumber = companyInfo?.contact.whatsapp || "971562566232";
    const message = encodeURIComponent(product.whatsappMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <section id="products" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-gray-600">جاري التحميل...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            منتجاتنا | Our Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            حلول متكاملة لأنظمة الطاقة والبيوت الذكية
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const category = getCategoryName(product.categoryId);
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-64 bg-white flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                  {product.inStock && (
                    <Badge className="absolute top-4 right-4 bg-green-600">
                      متوفر | In Stock
                    </Badge>
                  )}
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{product.name}</CardTitle>
                      <CardDescription className="text-sm">{product.nameAr}</CardDescription>
                    </div>
                  </div>
                  
                  {/* Badges Row - Brand and Category */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.brand && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        {product.brand}
                      </Badge>
                    )}
                    {category && (
                      <Badge variant="outline" className="text-purple-600 border-purple-600">
                        📁 {category.nameAr}
                      </Badge>
                    )}
                  </div>

                  <div className="text-2xl font-bold text-green-600">
                    {product.price}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleWhatsAppClick(product)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    اطلب عبر واتساب | Order on WhatsApp
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    اضغط للتواصل معنا مباشرة
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-lg font-semibold text-blue-900 mb-2">
                هل تحتاج حلول مخصصة؟ | Need a custom solution?
              </p>
              <p className="text-gray-700 mb-4">
                تواصل معنا للحصول على استشارة مجانية وعروض أسعار مخصصة
              </p>
              <Button
                onClick={() => {
                  const phoneNumber = companyInfo?.contact.whatsapp || "971562566232";
                  window.open(`https://wa.me/${phoneNumber}`, "_blank");
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                احصل على عرض سعر | Get Custom Quote
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

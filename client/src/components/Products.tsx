import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ProductSkeleton } from "./ProductSkeleton";

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

const PRODUCTS_PER_PAGE = 6;

export function Products() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        // Load products
        const productsRes = await fetch('/api/products');
        const productsData = await productsRes.json();
        setAllProducts(productsData.products || []);

        // Load company info
        const companyRes = await fetch('/company-info.json');
        const companyData = await companyRes.json();
        setCompanyInfo(companyData);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Memoize displayed products to avoid recalculation
  const displayedProducts = useMemo(() => {
    return allProducts.slice(0, displayCount);
  }, [allProducts, displayCount]);

  // Memoize categories map for faster lookups
  const categoryMap = useMemo(() => {
    return categories.reduce((map, cat) => {
      map[cat.id] = cat;
      return map;
    }, {} as Record<number, Category>);
  }, [categories]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + PRODUCTS_PER_PAGE);
      setLoadingMore(false);
    }, 300);
  };

  const handleWhatsAppClick = (product: Product) => {
    const phoneNumber = companyInfo?.contact.whatsapp || "971562566232";
    const message = encodeURIComponent(product.whatsappMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  if (loading) {
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
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
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

        {displayedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">لا توجد منتجات متاحة</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product) => {
                const category = product.categoryId ? categoryMap[product.categoryId] : null;
                return (
                  <Card key={product.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col border-0 shadow-md">
                    <div className="relative h-48 bg-gradient-to-b from-blue-50 to-white flex items-center justify-center overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-contain p-3"
                      />
                      {product.inStock && (
                        <Badge className="absolute top-3 right-3 bg-green-600 shadow-lg">
                          متوفر | In Stock
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader className="flex-1 pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
                          <CardDescription className="text-xs text-gray-500">{product.nameAr}</CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.brand && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                            {product.brand}
                          </Badge>
                        )}
                        {category && (
                          <Badge variant="outline" className="text-purple-600 border-purple-600 text-xs">
                            📁 {category.nameAr}
                          </Badge>
                        )}
                      </div>

                      <div className="text-2xl font-bold text-green-600">
                        {product.price} <span className="text-lg">درهم</span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 py-2">
                      <ul className="space-y-1">
                        {product.features.slice(0, 2).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-1.5 pt-0">
                      <Button
                        onClick={() => handleWhatsAppClick(product)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold shadow-lg transform transition hover:shadow-xl py-2"
                      >
                        💬 اطلب عبر واتساب
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {displayCount < allProducts.length && (
              <div className="mt-12 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                >
                  {loadingMore ? "جاري التحميل..." : `تحميل المزيد (${allProducts.length - displayCount} منتج)`}
                </Button>
              </div>
            )}
          </>
        )}

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

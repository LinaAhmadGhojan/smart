import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface CompanyInfo {
  companyName: string;
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionEn: string;
  contact: {
    whatsapp: string;
  };
}

export function Hero() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    fetch('/company-info.json')
      .then(res => res.json())
      .then(data => setCompanyInfo(data))
      .catch(error => console.error('Error loading company info:', error));
  }, []);

  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const whatsappNumber = companyInfo?.contact.whatsapp || "971562566232";

  return (
    <section id="home" className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
              {companyInfo?.taglineAr || "منزلك آمن معنا"}
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">
              {companyInfo?.tagline || "Your Home is Safe With Us"}
            </h2>
            <p className="text-xl text-gray-700 mb-4 leading-relaxed">
              {companyInfo?.description || "شركة رائدة في مجال نقل الطاقة الكهربائية والتحكم بها وأنظمة البيوت الذكية"}
            </p>
            <p className="text-lg text-gray-600 mb-8">
              {companyInfo?.descriptionEn || "Leading company in electrical power transmission, control systems, and smart home solutions"}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={scrollToProducts}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
              >
                اكتشف منتجاتنا | View Products
              </Button>
              <Button
                onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
                size="lg"
                variant="outline"
                className="text-lg px-8 border-green-600 text-green-600 hover:bg-green-50"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                تواصل معنا | Contact Us
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-2xl">
              <img
                src="/smartflow-logo.jpeg"
                alt="SmartFlow"
                className="w-full h-auto rounded-xl"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900">100% آمن | Secure</p>
                  <p className="text-sm text-gray-600">موثوق من الآلاف</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

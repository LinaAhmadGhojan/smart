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
  const services = companyInfo?.about?.services || [];

  return (
    <section id="home" className="pt-24 pb-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              {companyInfo?.taglineAr || "منزلك آمن معنا"}
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-6">
              {companyInfo?.tagline || "Your Home is Safe With Us"}
            </h2>
            <p className="text-lg text-gray-200 mb-4 leading-relaxed">
              {companyInfo?.description || "شركة رائدة في مجال نقل الطاقة الكهربائية والتحكم بها وأنظمة البيوت الذكية"}
            </p>
            <p className="text-base text-gray-300 mb-8">
              {companyInfo?.descriptionEn || "Leading company in electrical power transmission, control systems, and smart home solutions"}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={scrollToProducts}
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white text-lg px-8"
              >
                اكتشف منتجاتنا | View Products
              </Button>
              <Button
                onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-8"
              >
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                تواصل معنا | Contact Us
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-1 shadow-2xl">
              <div className="bg-slate-900 rounded-3xl p-8">
                <img
                  src="/smartflow-logo.jpeg"
                  alt="SmartFlow"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-cyan-500/20 pt-12">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            خدماتنا الشاملة | Our Complete Services
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md border border-cyan-400/30 rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300 hover:border-cyan-400">
                <div className="text-2xl mb-2">🔧</div>
                <p className="text-white font-semibold text-sm leading-tight">{service.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

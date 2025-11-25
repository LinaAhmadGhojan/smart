import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface Service {
  name: string;
  nameEn: string;
}

interface CompanyInfo {
  companyName: string;
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionEn: string;
  contact: {
    whatsapp: string;
  };
  about?: {
    services?: Service[];
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

  // Icon mapping for services
  const serviceIcons: { [key: string]: string } = {
    "أنظمة نقل الطاقة الكهربائية": "🔌",
    "أنظمة التحكم والمراقبة": "📡",
    "البيوت الذكية المتكاملة": "🏠",
    "البوابات الأوتوماتيكية": "🚪",
    "الصيانة والدعم الفني": "🔧",
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden pt-20 pb-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Logo and Title */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img
              src="/smartflow-logo.jpeg"
              alt="SmartFlow"
              className="h-20 w-20 object-contain"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            SMARTFLOW
          </h1>
          <p className="text-2xl text-cyan-400 font-semibold mb-4">
            YOUR HOME IS SAFE WITH US
          </p>
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">
            {companyInfo?.taglineAr || "منزلك آمن معنا"}
          </p>
          <p className="text-lg text-cyan-300 max-w-3xl mx-auto">
            {companyInfo?.description || "شركة رائدة في مجال نقل الطاقة الكهربائية والتحكم بها وأنظمة البيوت الذكية"}
          </p>
        </div>

        {/* Services Grid Section */}
        <div className="mt-20 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            خدماتنا
          </h2>
          <p className="text-xl text-cyan-300 text-center mb-12 font-semibold">
            نقدم خدمات متكاملة تشمل:
          </p>

          {/* Services Grid - 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const icon = serviceIcons[service.name] || "⚙️";
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-md border border-cyan-400/50 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-cyan-300 transition-all duration-300 group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <p className="text-white font-bold text-sm leading-tight group-hover:text-cyan-300 transition-colors">
                    {service.name}
                  </p>
                </div>
              );
            })}

            {/* Additional service cards if needed */}
            {services.length === 0 && (
              <>
                <div className="bg-white/5 backdrop-blur-md border border-cyan-400/50 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
                  <div className="text-5xl mb-4">🔌</div>
                  <p className="text-white font-bold text-sm">التحكم في المحولات</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-cyan-400/50 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
                  <div className="text-5xl mb-4">📡</div>
                  <p className="text-white font-bold text-sm">التحكم في الستائر</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-cyan-400/50 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
                  <div className="text-5xl mb-4">🚪</div>
                  <p className="text-white font-bold text-sm">كاميرات ذكية</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-cyan-400/50 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
                  <div className="text-5xl mb-4">🔒</div>
                  <p className="text-white font-bold text-sm">أجهزة التشفير</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-6 justify-center mt-16">
          <Button
            onClick={scrollToProducts}
            size="lg"
            className="bg-cyan-500 hover:bg-cyan-600 text-white text-lg px-10 py-6 rounded-full font-bold shadow-lg hover:shadow-cyan-500/50"
          >
            اكتشف منتجاتنا | View Products
          </Button>
          <Button
            onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-10 py-6 rounded-full font-bold shadow-lg hover:shadow-green-600/50"
          >
            <svg className="w-6 h-6 ml-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            تواصل معنا | Contact
          </Button>
        </div>
      </div>
    </section>
  );
}

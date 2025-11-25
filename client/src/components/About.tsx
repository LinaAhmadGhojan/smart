import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";

interface CompanyInfo {
  about: {
    heading: string;
    headingAr: string;
    subheading: string;
    companyDescriptionAr: string;
    companyDescriptionEn: string;
    stats: {
      projects: string;
      clients: string;
      rating: string;
    };
    features: Array<{
      icon: string;
      title: string;
      titleAr: string;
      description: string;
    }>;
    services: Array<{
      name: string;
      nameEn: string;
    }>;
  };
}

export function About() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/company-info.json')
      .then(res => res.json())
      .then(data => {
        setCompanyInfo(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading company info:', error);
        setLoading(false);
      });
  }, []);

  if (loading || !companyInfo) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-gray-600">جاري التحميل...</div>
        </div>
      </section>
    );
  }

  const { about } = companyInfo;

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            {about.headingAr}
          </h2>
          <h3 className="text-3xl font-bold text-blue-700 mb-4">
            {about.heading}
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {about.subheading}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {about.features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  {feature.titleAr}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{feature.title}</p>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">عن SmartFlow</h3>
              <h4 className="text-2xl font-bold mb-4 text-blue-200">About SmartFlow</h4>
              <p className="text-blue-100 mb-6 leading-relaxed">
                {about.companyDescriptionAr}
              </p>
              <p className="text-blue-100 leading-relaxed">
                {about.companyDescriptionEn}
              </p>
              <div className="grid grid-cols-3 gap-4 text-center mt-6">
                <div>
                  <div className="text-4xl font-bold mb-1">{about.stats.projects}</div>
                  <div className="text-sm text-blue-200">مشروع | Projects</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-1">{about.stats.clients}</div>
                  <div className="text-sm text-blue-200">عميل | Clients</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-1">{about.stats.rating}</div>
                  <div className="text-sm text-blue-200">تقييم | Rating</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h4 className="text-2xl font-bold mb-4">خدماتنا | Our Services</h4>
              <ul className="space-y-3">
                {about.services.map((service, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{service.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

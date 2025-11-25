import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface CompanyInfo {
  contact: {
    phone: string;
    phone2?: string;
    email: string;
    whatsapp: string;
    instagram?: string;
    address: string;
    addressAr: string;
  };
  businessHours: {
    weekdays: string;
    weekdaysAr: string;
    friday: string;
    fridayAr: string;
    emergency: string;
    emergencyAr: string;
  };
}

export function Contact() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    fetch('/company-info.json')
      .then(res => res.json())
      .then(data => setCompanyInfo(data))
      .catch(error => console.error('Error loading company info:', error));
  }, []);

  const whatsappNumber = companyInfo?.contact.whatsapp || "971562566232";
  const phone = companyInfo?.contact.phone || "+971 56 256 6232";
  const phone2 = companyInfo?.contact.phone2 || "+971 4 567 8900";
  const email = companyInfo?.contact.email || "info@smartfowl.com";
  const instagram = companyInfo?.contact.instagram;

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            تواصل معنا | Get in Touch
          </h2>
          <p className="text-xl text-cyan-300">
            جاهزون لجعل منزلك أكثر ذكاءً وأماناً؟ اتصل بنا اليوم!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="bg-white/10 border border-cyan-400/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">معلومات الاتصال | Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-white">
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500/30 border border-cyan-400 rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-cyan-300">الهاتف | Phone</h3>
                  <p className="text-gray-300">{phone}</p>
                  {phone2 && <p className="text-gray-300">{phone2}</p>}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-500/30 border border-green-400 rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-cyan-300">واتساب | WhatsApp</h3>
                  <p className="text-gray-300 mb-2 direction-ltr">{phone}</p>
                  <Button
                    onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    دردش الآن | Chat Now
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-500/30 border border-red-400 rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-cyan-300">البريد الإلكتروني | Email</h3>
                  <p className="text-gray-300">{email}</p>
                </div>
              </div>

              {instagram && (
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 rounded-full p-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">انستقرام | Instagram</h3>
                    <Button
                      onClick={() => window.open(instagram, "_blank")}
                      size="sm"
                      variant="outline"
                      className="border-pink-600 text-pink-600 hover:bg-pink-50"
                    >
                      تابعنا | Follow Us
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">العنوان | Address</h3>
                  <p className="text-gray-600">
                    SmartFlow Technologies<br />
                    {companyInfo?.contact.addressAr || "دبي، الإمارات العربية المتحدة"}<br />
                    {companyInfo?.contact.address || "Dubai, UAE"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">ساعات العمل | Business Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">السبت - الخميس | Sat - Thu</span>
                <span className="text-gray-600">{companyInfo?.businessHours.weekdays || "8:00 AM - 6:00 PM"}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">الجمعة | Friday</span>
                <span className="text-gray-600">{companyInfo?.businessHours.friday || "Closed"}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">خدمة الطوارئ | Emergency</span>
                <span className="text-green-600 font-semibold">{companyInfo?.businessHours.emergency || "24/7 Available"}</span>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mt-6">
                <h3 className="font-bold text-lg mb-3 text-blue-900">
                  ضمان الاستجابة السريعة
                </h3>
                <p className="text-gray-700 mb-4">
                  نرد على جميع رسائل واتساب والمكالمات خلال 30 دقيقة خلال ساعات العمل
                </p>
                <Button
                  onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  تواصل عبر واتساب | WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

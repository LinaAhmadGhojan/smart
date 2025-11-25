import { useState, useEffect } from "react";

interface CompanyInfo {
  companyName: string;
  tagline: string;
  description: string;
  about: {
    services: Array<{
      name: string;
      nameEn: string;
    }>;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    instagram?: string;
    address: string;
    addressAr: string;
  };
}

export function Footer() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    fetch('/company-info.json')
      .then(res => res.json())
      .then(data => setCompanyInfo(data))
      .catch(error => console.error('Error loading company info:', error));
  }, []);

  const whatsappNumber = companyInfo?.contact.whatsapp || "971562566232";

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/smartflow-logo.jpeg"
                alt="SmartFlow"
                className="h-10 w-10 object-contain"
              />
              <h3 className="text-xl font-bold">
                {companyInfo?.companyName || "SMARTFLOW"}
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              {companyInfo?.tagline || "Your Home is Safe With Us"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {companyInfo?.description || "شركة رائدة في مجال نقل الطاقة الكهربائية والتحكم بها وأنظمة البيوت الذكية"}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">روابط سريعة | Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#home" className="hover:text-white transition-colors">الرئيسية | Home</a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors">المنتجات | Products</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">من نحن | About</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">تواصل معنا | Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">خدماتنا | Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {companyInfo?.about?.services ? (
                companyInfo.about.services.map((service, index) => (
                  <li key={index}>{service.name}</li>
                ))
              ) : (
                <>
                  <li>نقل الطاقة الكهربائية</li>
                  <li>أنظمة التحكم الذكية</li>
                  <li>البيوت الذكية</li>
                  <li>البوابات الأوتوماتيكية</li>
                  <li>الصيانة والدعم</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">تواصل معنا | Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📞 {companyInfo?.contact.phone || "+971 56 256 6232"}</li>
              <li>📧 {companyInfo?.contact.email || "info@smartfowl.com"}</li>
              <li>📍 {companyInfo?.contact.addressAr || "دبي، الإمارات"}</li>
              <li className="pt-2 flex gap-2">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </a>
                {companyInfo?.contact.instagram && (
                  <a
                    href={companyInfo.contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} SmartFlow Technologies. جميع الحقوق محفوظة | All rights reserved.</p>
          <p className="mt-2">مدعوم بالابتكار | Secured by Technology</p>
        </div>
      </div>
    </footer>
  );
}

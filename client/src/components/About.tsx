import { Card, CardContent } from "./ui/card";

export function About() {
  const features = [
    {
      icon: "🔒",
      title: "Secure & Reliable",
      titleAr: "آمن وموثوق",
      description: "Advanced security features to protect your home and loved ones"
    },
    {
      icon: "⚡",
      title: "Smart Technology",
      titleAr: "تقنية ذكية",
      description: "State-of-the-art automation systems for modern living"
    },
    {
      icon: "🛠️",
      title: "Expert Installation",
      titleAr: "تركيب احترافي",
      description: "Professional installation and setup by certified technicians"
    },
    {
      icon: "📱",
      title: "Remote Control",
      titleAr: "تحكم عن بعد",
      description: "Control your gates and garage from anywhere with our app"
    },
    {
      icon: "⏰",
      title: "24/7 Support",
      titleAr: "دعم على مدار الساعة",
      description: "Round-the-clock customer support for your peace of mind"
    },
    {
      icon: "✅",
      title: "Warranty Included",
      titleAr: "ضمان شامل",
      description: "Comprehensive warranty on all products and services"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Why Choose SmartFlow?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are the leading provider of smart gate automation systems in the UAE. 
            Our commitment to quality, innovation, and customer satisfaction sets us apart.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{feature.titleAr}</p>
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
              <h3 className="text-3xl font-bold mb-4">About SmartFlow</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                SmartFlow is your trusted partner for smart home automation in Dubai and the UAE. 
                We specialize in automatic gate systems, garage door controllers, and comprehensive 
                home security solutions. With years of experience and thousands of satisfied customers, 
                we deliver excellence in every installation.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-4xl font-bold mb-1">1000+</div>
                  <div className="text-sm text-blue-200">Installations</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-1">500+</div>
                  <div className="text-sm text-blue-200">Happy Clients</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-1">5★</div>
                  <div className="text-sm text-blue-200">Rating</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h4 className="text-2xl font-bold mb-4">Our Services</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Automatic Sliding Gates</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Swing Gate Motors</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Garage Door Automation</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart Home Integration</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Maintenance & Repair</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

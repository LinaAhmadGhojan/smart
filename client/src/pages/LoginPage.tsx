import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface LoginPageProps {
  onLogin: (email: string, userId: number) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("البريد وكلمة السر مطلوبة!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "حدث خطأ!");
        return;
      }

      if (isRegister) {
        setError("");
        setEmail("");
        setPassword("");
        setIsRegister(false);
        alert("تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول الآن");
      } else {
        onLogin(email, data.userId);
      }
    } catch (err) {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="bg-blue-900 text-white rounded-t-lg">
          <CardTitle className="text-3xl text-center">
            {isRegister ? "📝 إنشاء حساب" : "🔐 تسجيل الدخول"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <div className="text-center">
            <p className="text-gray-600 text-lg">لوحة تحكم SmartFlow</p>
            <p className="text-gray-500 text-sm mt-2">إدارة المنتجات والفئات</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold mb-2 text-blue-900">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-600"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-bold mb-2 text-blue-900">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-600"
              disabled={loading}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg font-bold"
          >
            {loading ? "جاري المعالجة..." : isRegister ? "إنشاء الحساب" : "دخول"}
          </Button>

          <div className="text-center pt-4 border-t">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setEmail("");
                setPassword("");
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              {isRegister ? "هل لديك حساب؟ سجل دخول" : "ليس لديك حساب؟ إنشاء حساب"}
            </button>
          </div>

          <div className="text-center pt-2 text-xs text-gray-500">
            <p>📧 استخدم أي بريد إلكتروني وكلمة سر آمنة</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

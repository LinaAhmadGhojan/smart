import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface LoginPageProps {
  onLogin: (password: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const adminPassword = "admin123"; // كلمة السر
    if (password === adminPassword) {
      onLogin(password);
    } else {
      setError("كلمة المرور غير صحيحة!");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="bg-blue-900 text-white rounded-t-lg">
          <CardTitle className="text-3xl text-center">🔐 لوحة التحكم</CardTitle>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <div className="text-center">
            <p className="text-gray-600 text-lg">مرحباً بك في إدارة المحتوى</p>
            <p className="text-gray-500 text-sm mt-2">إدارة المنتجات والفئات</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold mb-2 text-blue-900">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              placeholder="أدخل كلمة المرور"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-600"
              autoFocus
            />
          </div>

          <Button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg font-bold"
          >
            دخول | Login
          </Button>

          <div className="text-center pt-4 border-t">
            <p className="text-gray-500 text-xs">🔑 كلمة المرور الافتراضية: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

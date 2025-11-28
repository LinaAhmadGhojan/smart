import { Router } from "express";
import bcrypt from "bcryptjs";

const router = Router();

// Mock admins data - in production this would use database
let admins: any[] = [];

// Initialize with default admin
async function initializeAdmin() {
  if (admins.length === 0) {
    const hashedPassword = await bcrypt.hash("SmartFlow123!", 10);
    admins = [
      {
        id: 1,
        email: "admin@smartflow.com",
        password: hashedPassword,
      }
    ];
  }
}

initializeAdmin();

// Admin Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "البريد وكلمة السر مطلوبة" });
    }

    const admin = admins.find((a) => a.email === email);

    if (!admin) {
      return res.status(401).json({ error: "البريد أو كلمة السر غير صحيحة" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "البريد أو كلمة السر غير صحيحة" });
    }

    res.json({ success: true, userId: admin.id, email: admin.email, isAdmin: true });
  } catch (error) {
    res.status(500).json({ error: "خطأ في الدخول" });
  }
});

// Admin Register endpoint (for adding new admins)
router.post("/register-admin", async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    // Simple check - in production use proper authorization
    if (adminKey !== "ADMIN_SECRET_KEY") {
      return res.status(403).json({ error: "غير مصرح" });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "البريد وكلمة السر مطلوبة" });
    }

    if (admins.some((a) => a.email === email)) {
      return res.status(400).json({ error: "هذا البريد مسجل بالفعل" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = {
      id: Math.max(...admins.map((a) => a.id || 0), 0) + 1,
      email,
      password: hashedPassword,
    };

    admins.push(newAdmin);

    res.json({ success: true, message: "تم إنشاء حساب الإدمن بنجاح" });
  } catch (error) {
    res.status(500).json({ error: "خطأ في التسجيل" });
  }
});

export default router;

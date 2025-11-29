import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = join(fileURLToPath(import.meta.url), "..", "..", "..");

const router = Router();

// Data directory
const dataDir = join(__dirname, "server", "data");
mkdirSync(dataDir, { recursive: true });
const adminsFile = join(dataDir, "admins.json");

// Helper functions
function loadAdmins() {
  try {
    if (require("fs").existsSync(adminsFile)) {
      return JSON.parse(readFileSync(adminsFile, "utf-8"));
    }
  } catch (error) {
    console.error("Error loading admins:", error);
  }
  return [];
}

function saveAdmins(admins: any[]) {
  writeFileSync(adminsFile, JSON.stringify(admins, null, 2));
}

// Initialize default admin if doesn't exist
function initializeAdmin() {
  try {
    const admins = loadAdmins();
    const existingAdmin = admins.find((a: any) => a.email === "admin@smartflow.com");

    if (!existingAdmin) {
      const hashedPassword = bcrypt.hashSync("SmartFlow123!", 10);
      const newAdmin = {
        id: admins.length > 0 ? Math.max(...admins.map((a: any) => a.id)) + 1 : 1,
        email: "admin@smartflow.com",
        password: hashedPassword,
      };
      admins.push(newAdmin);
      saveAdmins(admins);
      console.log("Default admin created: admin@smartflow.com");
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
}

// Initialize on startup
initializeAdmin();

// Admin Login endpoint
router.post("/login", (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "البريد وكلمة السر مطلوبة" });
    }

    const admins = loadAdmins();
    const admin = admins.find((a: any) => a.email === email);

    if (!admin) {
      return res.status(401).json({ error: "البريد أو كلمة السر غير صحيحة" });
    }

    const isPasswordValid = bcrypt.compareSync(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "البريد أو كلمة السر غير صحيحة" });
    }

    res.json({ success: true, userId: admin.id, email: admin.email, isAdmin: true });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "خطأ في الدخول" });
  }
});

// Admin Register endpoint (for adding new admins)
router.post("/register-admin", (req: Request, res: Response) => {
  try {
    const { email, password, adminKey } = req.body;

    // Simple check - in production use proper authorization
    if (adminKey !== "ADMIN_SECRET_KEY") {
      return res.status(403).json({ error: "غير مصرح" });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "البريد وكلمة السر مطلوبة" });
    }

    const admins = loadAdmins();
    const existingAdmin = admins.find((a: any) => a.email === email);

    if (existingAdmin) {
      return res.status(400).json({ error: "هذا البريد مسجل بالفعل" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAdmin = {
      id: admins.length > 0 ? Math.max(...admins.map((a: any) => a.id)) + 1 : 1,
      email,
      password: hashedPassword,
    };

    admins.push(newAdmin);
    saveAdmins(admins);

    res.json({ success: true, message: "تم إنشاء حساب الإدمن بنجاح", admin: newAdmin });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "خطأ في التسجيل" });
  }
});

export default router;

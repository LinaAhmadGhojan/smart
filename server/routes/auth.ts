import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { admins } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Initialize default admin if doesn't exist
async function initializeAdmin() {
  try {
    const existingAdmin = await db
      .select()
      .from(admins)
      .where(eq(admins.email, "admin@smartflow.com"));

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash("SmartFlow123!", 10);
      await db.insert(admins).values({
        email: "admin@smartflow.com",
        password: hashedPassword,
      });
      console.log("Default admin created: admin@smartflow.com");
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
}

// Initialize on startup
initializeAdmin();

// Admin Login endpoint
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "البريد وكلمة السر مطلوبة" });
    }

    const adminArray = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email));

    const admin = adminArray[0];

    if (!admin) {
      return res.status(401).json({ error: "البريد أو كلمة السر غير صحيحة" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

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
router.post("/register-admin", async (req: Request, res: Response) => {
  try {
    const { email, password, adminKey } = req.body;

    // Simple check - in production use proper authorization
    if (adminKey !== "ADMIN_SECRET_KEY") {
      return res.status(403).json({ error: "غير مصرح" });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "البريد وكلمة السر مطلوبة" });
    }

    const existingAdmin = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email));

    if (existingAdmin.length > 0) {
      return res.status(400).json({ error: "هذا البريد مسجل بالفعل" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await db
      .insert(admins)
      .values({
        email,
        password: hashedPassword,
      })
      .returning();

    res.json({ success: true, message: "تم إنشاء حساب الإدمن بنجاح", admin: newAdmin[0] });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "خطأ في التسجيل" });
  }
});

export default router;

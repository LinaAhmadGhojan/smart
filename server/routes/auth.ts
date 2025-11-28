import { Router } from "express";
import bcrypt from "bcryptjs";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = join(fileURLToPath(import.meta.url), "..", "..", "..");
const usersFilePath = join(__dirname, "data", "users.json");

const router = Router();

// Ensure data directory exists
import { mkdirSync } from "fs";
try {
  mkdirSync(join(__dirname, "data"), { recursive: true });
} catch (e) {}

// Helper to read users from JSON
function getUsers() {
  try {
    if (!require("fs").existsSync(usersFilePath)) {
      return [];
    }
    const data = readFileSync(usersFilePath, "utf-8");
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

// Helper to save users to JSON
function saveUsers(users: any[]) {
  try {
    writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "البريد وكلمة السر مطلوبة" });
    }

    const users = getUsers();
    if (users.some((u: any) => u.email === email)) {
      return res.status(400).json({ error: "هذا البريد مسجل بالفعل" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Math.max(...users.map((u: any) => u.id || 0), 0) + 1,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    res.json({ success: true, message: "تم إنشاء الحساب بنجاح" });
  } catch (error) {
    res.status(500).json({ error: "خطأ في التسجيل" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "البريد وكلمة السر مطلوبة" });
    }

    const users = getUsers();
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return res.status(401).json({ error: "البريد أو كلمة السر غير صحيحة" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "البريد أو كلمة السر غير صحيحة" });
    }

    res.json({ success: true, userId: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "خطأ في الدخول" });
  }
});

export default router;

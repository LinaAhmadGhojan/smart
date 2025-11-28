import { db } from "./db";
import { categories, products, admins } from "@shared/schema";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = join(fileURLToPath(import.meta.url), "..");

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data
    await db.delete(products);
    await db.delete(categories);
    console.log("✓ Cleared existing data");

    // Insert categories
    const categoryData = [
      { name: "Gates", nameAr: "البوابات" },
      { name: "Smart Home", nameAr: "المنزل الذكي" },
      { name: "Security", nameAr: "الأمان" },
    ];

    const insertedCategories = await db
      .insert(categories)
      .values(categoryData)
      .returning();

    console.log("✓ Categories inserted:", insertedCategories.length);

    // Read products from JSON
    const productsFilePath = join(__dirname, "..", "client", "public", "products.json");
    const productsJson = JSON.parse(readFileSync(productsFilePath, "utf-8"));

    // Insert products
    const productsData = productsJson.products.map((p: any) => ({
      name: p.name,
      nameAr: p.nameAr,
      brand: p.brand,
      price: p.price,
      image: p.image,
      inStock: p.inStock,
      categoryId: p.categoryId,
      features: p.features,
      whatsappMessage: p.whatsappMessage,
    }));

    const insertedProducts = await db
      .insert(products)
      .values(productsData)
      .returning();

    console.log("✓ Products inserted:", insertedProducts.length);

    // Insert default admin
    const existingAdmins = await db.select().from(admins);
    if (existingAdmins.length === 0) {
      const hashedPassword = await bcrypt.hash("SmartFlow123!", 10);
      await db.insert(admins).values({
        email: "admin@smartflow.com",
        password: hashedPassword,
      });
      console.log("✓ Default admin created");
    } else {
      console.log("✓ Admin already exists");
    }

    console.log("✅ Database seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();

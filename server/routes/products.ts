import { Router, Request, Response } from "express";
import { readFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import multer, { Multer } from "multer";
import { db } from "../db";
import { products } from "@shared/schema";
import { eq } from "drizzle-orm";

const __dirname = join(fileURLToPath(import.meta.url), "..", "..", "..");

const router = Router();

// Ensure uploads directory exists
const uploadsDir = join(__dirname, "client", "public", "uploads", "products");
try {
  mkdirSync(uploadsDir, { recursive: true });
} catch (e) {}

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const ext = file.originalname.split(".").pop();
    const name = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    cb(null, name);
  },
});
const upload: Multer = multer({ storage });

// Upload image endpoint
router.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  const file = (req as any).file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ image: `/uploads/products/${file.filename}` });
});

// Get all products
router.get("/", async (req: Request, res: Response) => {
  try {
    const allProducts = await db.select().from(products);
    res.json({ products: allProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create product
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, nameAr, brand, price, image, inStock, categoryId, features, whatsappMessage } = req.body;

    if (!name || !nameAr || !price) {
      return res.status(400).json({ error: "Name, Arabic name, and price are required" });
    }

    const newProduct = await db
      .insert(products)
      .values({
        name,
        nameAr,
        brand,
        price,
        image,
        inStock: inStock ?? true,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        features: features || [],
        whatsappMessage,
      })
      .returning();

    res.json(newProduct[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ error: "Invalid product data" });
  }
});

// Update product
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, nameAr, brand, price, image, inStock, categoryId, features, whatsappMessage } = req.body;

    const updated = await db
      .update(products)
      .set({
        name,
        nameAr,
        brand,
        price,
        image,
        inStock,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        features,
        whatsappMessage,
      })
      .where(eq(products.id, productId))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ error: "Invalid product data" });
  }
});

// Delete product
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);

    await db.delete(products).where(eq(products.id, productId));

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;

import { Router } from "express";
import { products, categories, insertProductSchema } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

// Mock db for now - will be replaced with real db
let mockProducts: typeof products.$inferSelect[] = [];

const db = {
  select: () => ({
    from: (table: any) => {
      if (table === products) {
        return { where: (condition: any) => Promise.resolve([]), execute: () => Promise.resolve(mockProducts) };
      }
      return { execute: () => Promise.resolve([]) };
    }
  }),
  insert: (table: any) => ({
    values: (values: any) => ({
      returning: () => Promise.resolve([{ ...values, id: Date.now() }])
    })
  }),
  update: (table: any) => ({
    set: (values: any) => ({
      where: (condition: any) => ({
        returning: () => Promise.resolve([values])
      })
    })
  }),
  delete: (table: any) => ({
    where: (condition: any) => Promise.resolve(null)
  })
};

const router = Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const allProducts = await db.select().from(products);
    res.json({ products: allProducts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await db.select().from(products).where(eq(products.id, parseInt(req.params.id)));
    if (!product.length) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create product
router.post("/", async (req, res) => {
  try {
    const validated = insertProductSchema.parse(req.body);
    const newProduct = await db.insert(products).values(validated).returning();
    res.json(newProduct[0]);
  } catch (error) {
    res.status(400).json({ error: "Invalid product data" });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const validated = insertProductSchema.partial().parse(req.body);
    const updated = await db
      .update(products)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(products.id, parseInt(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(400).json({ error: "Invalid product data" });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    await db.delete(products).where(eq(products.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;

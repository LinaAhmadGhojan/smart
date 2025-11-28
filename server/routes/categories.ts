import { Router, Request, Response } from "express";
import { db } from "../db";
import { categories } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Get all categories
router.get("/", async (req: Request, res: Response) => {
  try {
    const allCategories = await db.select().from(categories);
    res.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Create category
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, nameAr, description } = req.body;

    if (!name || !nameAr) {
      return res.status(400).json({ error: "Name and Arabic name are required" });
    }

    const newCategory = await db
      .insert(categories)
      .values({ name, nameAr, description })
      .returning();

    res.json(newCategory[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(400).json({ error: "Invalid category data" });
  }
});

// Update category
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, nameAr, description } = req.body;

    const updated = await db
      .update(categories)
      .set({ name, nameAr, description })
      .where(eq(categories.id, categoryId))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(400).json({ error: "Invalid category data" });
  }
});

// Delete category
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);

    await db.delete(categories).where(eq(categories.id, categoryId));

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;

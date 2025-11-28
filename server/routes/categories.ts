import { Router } from "express";
import { categories, insertCategorySchema } from "@shared/schema";
import { eq } from "drizzle-orm";

// Mock db for now
let mockCategories: typeof categories.$inferSelect[] = [];

const db = {
  select: () => ({
    from: (table: any) => {
      if (table === categories) {
        return { execute: () => Promise.resolve(mockCategories) };
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

// Get all categories
router.get("/", async (req, res) => {
  try {
    const allCategories = await db.select().from(categories);
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Create category
router.post("/", async (req, res) => {
  try {
    const validated = insertCategorySchema.parse(req.body);
    const newCategory = await db.insert(categories).values(validated).returning();
    res.json(newCategory[0]);
  } catch (error) {
    res.status(400).json({ error: "Invalid category data" });
  }
});

// Update category
router.put("/:id", async (req, res) => {
  try {
    const validated = insertCategorySchema.partial().parse(req.body);
    const updated = await db
      .update(categories)
      .set(validated)
      .where(eq(categories.id, parseInt(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(400).json({ error: "Invalid category data" });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  try {
    await db.delete(categories).where(eq(categories.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;

import { Router, Request, Response } from "express";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = join(fileURLToPath(import.meta.url), "..", "..", "..");

const router = Router();

// Data directory
const dataDir = join(__dirname, "server", "data");
mkdirSync(dataDir, { recursive: true });
const categoriesFile = join(dataDir, "categories.json");

// Helper functions
function loadCategories() {
  try {
    if (existsSync(categoriesFile)) {
      return JSON.parse(readFileSync(categoriesFile, "utf-8"));
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
  return [];
}

function saveCategories(categories: any[]) {
  writeFileSync(categoriesFile, JSON.stringify(categories, null, 2));
}

// Get all categories
router.get("/", (req: Request, res: Response) => {
  try {
    const allCategories = loadCategories();
    res.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Create category
router.post("/", (req: Request, res: Response) => {
  try {
    const { name, nameAr, description } = req.body;

    if (!name || !nameAr) {
      return res.status(400).json({ error: "Name and Arabic name are required" });
    }

    const allCategories = loadCategories();
    const newId = allCategories.length > 0 ? Math.max(...allCategories.map((c: any) => c.id)) + 1 : 1;

    const newCategory = {
      id: newId,
      name,
      nameAr,
      description,
    };

    allCategories.push(newCategory);
    saveCategories(allCategories);

    res.json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(400).json({ error: "Invalid category data" });
  }
});

// Update category
router.put("/:id", (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, nameAr, description } = req.body;

    const allCategories = loadCategories();
    const categoryIndex = allCategories.findIndex((c: any) => c.id === categoryId);

    if (categoryIndex === -1) {
      return res.status(404).json({ error: "Category not found" });
    }

    allCategories[categoryIndex] = {
      id: categoryId,
      name,
      nameAr,
      description,
    };

    saveCategories(allCategories);

    res.json(allCategories[categoryIndex]);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(400).json({ error: "Invalid category data" });
  }
});

// Delete category
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);

    const allCategories = loadCategories();
    const filtered = allCategories.filter((c: any) => c.id !== categoryId);

    if (filtered.length === allCategories.length) {
      return res.status(404).json({ error: "Category not found" });
    }

    saveCategories(filtered);

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;

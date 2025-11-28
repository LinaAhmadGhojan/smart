import { Router } from "express";

const router = Router();

// Mock data for categories
let categories: any[] = [
  { id: 1, name: "Gates", nameAr: "البوابات" },
  { id: 2, name: "Smart Home", nameAr: "المنزل الذكي" },
  { id: 3, name: "Security", nameAr: "الأمان" },
];

// Get all categories
router.get("/", async (req, res) => {
  try {
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Create category
router.post("/", async (req, res) => {
  try {
    const newCategory = {
      id: Math.max(...categories.map(c => c.id || 0), 0) + 1,
      ...req.body,
    };
    categories.push(newCategory);
    res.json(newCategory);
  } catch (error) {
    res.status(400).json({ error: "Invalid category data" });
  }
});

// Update category
router.put("/:id", async (req, res) => {
  try {
    const index = categories.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: "Category not found" });
    }
    categories[index] = { ...categories[index], ...req.body, id: parseInt(req.params.id) };
    res.json(categories[index]);
  } catch (error) {
    res.status(400).json({ error: "Invalid category data" });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  try {
    categories = categories.filter(c => c.id !== parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;

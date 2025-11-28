import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __dirname = join(fileURLToPath(import.meta.url), "..", "..", "..");
const productsFilePath = join(__dirname, "client", "public", "products.json");

const router = Router();

// Setup multer for file uploads
const uploadsDir = join(__dirname, "client", "public", "uploads", "products");
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    const name = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

// Helper to read products from JSON
function getProducts() {
  try {
    const data = readFileSync(productsFilePath, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.products || [];
  } catch {
    return [];
  }
}

// Helper to save products to JSON
function saveProducts(products: any[]) {
  try {
    writeFileSync(productsFilePath, JSON.stringify({ products }, null, 2));
  } catch (error) {
    console.error("Error saving products:", error);
  }
}

// Upload image endpoint
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ image: `/uploads/products/${req.file.filename}` });
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const allProducts = getProducts();
    res.json({ products: allProducts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const allProducts = getProducts();
    const product = allProducts.find((p: any) => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create product
router.post("/", async (req, res) => {
  try {
    const allProducts = getProducts();
    const newProduct = {
      id: Math.max(...allProducts.map((p: any) => p.id || 0), 0) + 1,
      ...req.body,
      features: req.body.features || [],
    };
    allProducts.push(newProduct);
    saveProducts(allProducts);
    res.json(newProduct);
  } catch (error) {
    res.status(400).json({ error: "Invalid product data" });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const allProducts = getProducts();
    const index = allProducts.findIndex((p: any) => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    allProducts[index] = { ...allProducts[index], ...req.body, id: parseInt(req.params.id) };
    saveProducts(allProducts);
    res.json(allProducts[index]);
  } catch (error) {
    res.status(400).json({ error: "Invalid product data" });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    let allProducts = getProducts();
    allProducts = allProducts.filter((p: any) => p.id !== parseInt(req.params.id));
    saveProducts(allProducts);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;

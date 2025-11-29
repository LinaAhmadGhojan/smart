import { Router, Request, Response } from "express";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import multer, { Multer } from "multer";

const __dirname = join(fileURLToPath(import.meta.url), "..", "..", "..");

const router = Router();

// Data directory
const dataDir = join(__dirname, "server", "data");
mkdirSync(dataDir, { recursive: true });
const productsFile = join(dataDir, "products.json");

// Ensure uploads directory exists
const uploadsDir = join(__dirname, "client", "public", "uploads", "products");
mkdirSync(uploadsDir, { recursive: true });

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

// Helper functions
function loadProducts() {
  try {
    if (require("fs").existsSync(productsFile)) {
      return JSON.parse(readFileSync(productsFile, "utf-8"));
    }
  } catch (error) {
    console.error("Error loading products:", error);
  }
  return [];
}

function saveProducts(products: any[]) {
  writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

// Upload image endpoint
router.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  const file = (req as any).file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ image: `/uploads/products/${file.filename}` });
});

// Get all products
router.get("/", (req: Request, res: Response) => {
  try {
    const allProducts = loadProducts();
    res.json({ products: allProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by ID
router.get("/:id", (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const allProducts = loadProducts();
    const product = allProducts.find((p: any) => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create product
router.post("/", (req: Request, res: Response) => {
  try {
    const { name, nameAr, brand, price, image, inStock, categoryId, features, whatsappMessage } = req.body;

    if (!name || !nameAr || !price) {
      return res.status(400).json({ error: "Name, Arabic name, and price are required" });
    }

    const allProducts = loadProducts();
    const newId = allProducts.length > 0 ? Math.max(...allProducts.map((p: any) => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      name,
      nameAr,
      brand,
      price,
      image,
      inStock: inStock ?? true,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      features: features || [],
      whatsappMessage,
    };

    allProducts.push(newProduct);
    saveProducts(allProducts);

    res.json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ error: "Invalid product data" });
  }
});

// Update product
router.put("/:id", (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, nameAr, brand, price, image, inStock, categoryId, features, whatsappMessage } = req.body;

    const allProducts = loadProducts();
    const productIndex = allProducts.findIndex((p: any) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    allProducts[productIndex] = {
      id: productId,
      name,
      nameAr,
      brand,
      price,
      image,
      inStock,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      features,
      whatsappMessage,
    };

    saveProducts(allProducts);

    res.json(allProducts[productIndex]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ error: "Invalid product data" });
  }
});

// Delete product
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);

    const allProducts = loadProducts();
    const filtered = allProducts.filter((p: any) => p.id !== productId);

    if (filtered.length === allProducts.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    saveProducts(filtered);

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;

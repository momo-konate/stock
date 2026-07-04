import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../controllers/product.controller.js";
import { admin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.js";
import { productSchema } from "../schemas/product.schema.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/", getProducts);
router.post("/", validate(productSchema), createProduct);
router.put("/:id", validate(productSchema), updateProduct);
router.delete("/:id", admin, deleteProduct);

export default router;

import express from "express";
import {
  getSales,
  createSale,
  deleteAllSales,
  getDeletedSales,
  getSaleById,
  deleteSale,
} from "../controllers/sale.controller.js";
import { admin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.js";
import { saleSchema } from "../schemas/sale.schema.js";

const router = express.Router();

router.get("/", getSales);
router.get("/deleted", admin, getDeletedSales);
router.get("/:id", getSaleById);
router.post("/", validate(saleSchema), createSale);
router.delete("/:id", admin, deleteSale);
router.delete("/", admin, deleteAllSales);

export default router;

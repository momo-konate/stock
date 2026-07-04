import express from "express";
import {
  getExpenses,
  createExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";
import { admin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getExpenses);
router.post("/", createExpense);
router.delete("/:id", protect, admin, deleteExpense);

export default router;

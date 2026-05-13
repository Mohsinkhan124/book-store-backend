import express from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getSingleBook,
  updateBook,
} from "../controller/bookController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📖 Public routes (sab dekh sakte hain)
router.get("/books", getAllBooks);
router.get("/books/:id", getSingleBook);

// 🔒 Admin only routes (sirf admin create/update/delete kar sakta hai)
router.post("/books", protect, adminOnly, createBook);
router.put("/books/:id", protect, adminOnly, updateBook);
router.delete("/books/:id", protect, adminOnly, deleteBook);

export default router;
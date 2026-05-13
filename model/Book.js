import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    coverImage: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
      min: [0, "Stock cannot be negative"],
    },
    pdfUrl: {
      type: String,
      required: true,  // PDF link mandatory for books
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
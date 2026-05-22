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
      default: 0,  // ✅ Not required anymore
    },
    coverImage: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    description: {
      type: String,
      default: "",  // ✅ Not required anymore
    },
    stock: {
      type: Number,
      default: 1,  // ✅ Not required anymore
    },
    pdfUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
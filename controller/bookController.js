
// @desc    Create a new book

import Book from "../model/Book.js";

// @route   POST /api/books
export const createBook = async (req, res) => {
  try {
    const bookData = {
      title: req.body.title,
      author: req.body.author,
      price: req.body.price || 0,
      coverImage: req.body.coverImage || req.body.imageUrl || "https://via.placeholder.com/150",
      description: req.body.description || "No description available",
      stock: req.body.stock || 1,
      pdfUrl: req.body.pdfUrl,
    };
    
    const book = new Book(bookData);
    await book.save();
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    console.error("Create book error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all books
// @route   GET /api/books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
export const getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Read book online (view PDF in browser)
// @route   GET /api/books/:id/read
export const readBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    
    // Return PDF URL for embedding
    res.status(200).json({ 
      success: true, 
      pdfUrl: book.pdfUrl,
      title: book.title,
      author: book.author
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download book PDF
// @route   GET /api/books/:id/download
export const downloadBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    
    // Redirect to PDF URL or send file info
    res.status(200).json({ 
      success: true, 
      downloadUrl: book.pdfUrl,
      fileName: `${book.title}.pdf`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
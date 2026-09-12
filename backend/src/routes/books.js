// backend/src/routes/books.js
const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const Book = require('../models/Book');
const { logger } = require('../utils/logger');

// ============================================
// PUBLIC ROUTES
// ============================================

// GET all published books
router.get('/', async (req, res) => {
  try {
    const { limit, featured, comingSoon } = req.query;
    
    let books;
    if (comingSoon === 'true') {
      books = await Book.getComingSoon();
    } else if (featured === 'true') {
      books = await Book.getFeatured(limit ? parseInt(limit) : 3);
    } else {
      books = await Book.getPublished(limit ? parseInt(limit) : null);
    }
    
    res.json({ success: true, data: books });
  } catch (error) {
    // logger.error('Error fetching books:', error);
    res.status(500).json({ success: false, message: 'Error fetching books' });
  }
});

// GET single book by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const book = await Book.getBySlug(req.params.slug);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    // logger.error('Error fetching book:', error);
    res.status(500).json({ success: false, message: 'Error fetching book' });
  }
});

// GET single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.getById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    // logger.error('Error fetching book:', error);
    res.status(500).json({ success: false, message: 'Error fetching book' });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// GET all books (admin)
router.get('/admin/all', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let filters = [];
    
    if (status && status !== 'all') {
      filters.push({ field: 'status', operator: '==', value: status });
    }
    
    const books = await Book.getAll(filters);
    res.json({ success: true, data: books });
  } catch (error) {
    // logger.error('Error fetching all books:', error);
    res.status(500).json({ success: false, message: 'Error fetching books' });
  }
});

// GET book stats (admin)
router.get('/admin/stats', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const all = await Book.getAll();
    const published = all.filter(b => b.status === 'published');
    const comingSoon = all.filter(b => b.status === 'coming_soon');
    const draft = all.filter(b => b.status === 'draft');
    
    res.json({
      success: true,
      data: {
        total: all.length,
        published: published.length,
        comingSoon: comingSoon.length,
        draft: draft.length,
      }
    });
  } catch (error) {
    // logger.error('Error fetching book stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

// POST - Create book (admin)
router.post('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { title, subtitle, description, price, pages, format, category, author, image, status, featured, releaseDate, color } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const book = await Book.create({
      title,
      subtitle: subtitle || '',
      description: description || '',
      price: price || 0,
      pages: pages || 0,
      format: format || 'Paperback',
      category: category || 'Christian Living',
      author: author || 'Pastor Andrew Osalor',
      image: image || '',
      status: status || 'published',
      featured: featured || false,
      releaseDate: releaseDate || '',
      color: color || 'from-amber-500 to-orange-500',
    });

    res.status(201).json({ success: true, message: 'Book created', data: book });
  } catch (error) {
    // logger.error('Error creating book:', error);
    res.status(500).json({ success: false, message: 'Error creating book' });
  }
});

// PUT - Update book (admin)
router.put('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Book.update(req.params.id, req.body);
    logger.info(`✏️ Book updated: ${req.params.id}`);
    res.json({ success: true, message: 'Book updated' });
  } catch (error) {
    // logger.error('Error updating book:', error);
    res.status(500).json({ success: false, message: 'Error updating book' });
  }
});

// DELETE - Delete book (admin)
router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Book.delete(req.params.id);
    logger.info(`🗑️ Book deleted: ${req.params.id}`);
    res.json({ success: true, message: 'Book deleted' });
  } catch (error) {
    // logger.error('Error deleting book:', error);
    res.status(500).json({ success: false, message: 'Error deleting book' });
  }
});

// PUT - Toggle featured (admin)
router.put('/:id/featured', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { featured } = req.body;
    await Book.update(req.params.id, { featured });
    res.json({ success: true, message: `Book ${featured ? 'featured' : 'unfeatured'}` });
  } catch (error) {
    // logger.error('Error toggling featured:', error);
    res.status(500).json({ success: false, message: 'Error toggling featured' });
  }
});

module.exports = router;
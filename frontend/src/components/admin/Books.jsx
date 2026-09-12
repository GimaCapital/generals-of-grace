// src/components/admin/Books.jsx
import React, { useState, useEffect } from 'react';
import { bookAPI } from '../../services/api';
import toast from 'react-hot-toast';
import MediaUpload from '../common/MediaUpload';
import {
  Plus, Edit, Trash2, Star, Clock, Search, Filter, Loader,
  X, Save, BookOpen, DollarSign, Tag, User, Image as ImageIcon
} from 'lucide-react';

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ total: 0, published: 0, comingSoon: 0, draft: 0 });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: '',
    pages: '',
    format: 'Paperback',
    category: 'Christian Living',
    author: 'Pastor Andrew Osalor',
    image: '',
    status: 'published',
    featured: false,
    releaseDate: '',
    color: 'from-amber-500 to-orange-500',
  });

  const colorOptions = [
    { value: 'from-amber-500 to-orange-500', label: 'Amber/Orange' },
    { value: 'from-red-500 to-rose-500', label: 'Red/Rose' },
    { value: 'from-purple-500 to-pink-500', label: 'Purple/Pink' },
    { value: 'from-blue-500 to-cyan-500', label: 'Blue/Cyan' },
    { value: 'from-emerald-500 to-green-500', label: 'Emerald/Green' },
    { value: 'from-indigo-500 to-violet-500', label: 'Indigo/Violet' },
  ];

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, [filter]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.adminGetAll({
        status: filter === 'all' ? undefined : filter
      });
      setBooks(response.data.data || []);
    } catch (error) {
    //   console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await bookAPI.adminGetStats();
      setStats(response.data.data);
    } catch (error) {
    //   console.error('Error fetching stats:', error);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      price: '',
      pages: '',
      format: 'Paperback',
      category: 'Christian Living',
      author: 'Pastor Andrew Osalor',
      image: '',
      status: 'published',
      featured: false,
      releaseDate: '',
      color: 'from-amber-500 to-orange-500',
    });
  };

  const openNewForm = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      price: '',
      pages: '',
      format: 'Paperback',
      category: 'Christian Living',
      author: 'Pastor Andrew Osalor',
      image: '',
      status: 'published',
      featured: false,
      releaseDate: '',
      color: 'from-amber-500 to-orange-500',
    });
    setShowForm(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '',
      subtitle: book.subtitle || '',
      description: book.description || '',
      price: book.price || '',
      pages: book.pages || '',
      format: book.format || 'Paperback',
      category: book.category || 'Christian Living',
      author: book.author || 'Pastor Andrew Osalor',
      image: book.image || '',
      status: book.status || 'published',
      featured: book.featured || false,
      releaseDate: book.releaseDate || '',
      color: book.color || 'from-amber-500 to-orange-500',
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.price) {
      toast.error('Price is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        pages: formData.pages ? Number(formData.pages) : 0,
      };

      if (editingBook) {
        await bookAPI.update(editingBook.id, payload);
        toast.success('Book updated successfully!');
      } else {
        await bookAPI.create(payload);
        toast.success('Book created successfully!');
      }
      closeForm();
      fetchBooks();
      fetchStats();
    } catch (error) {
    //   console.error('Error saving book:', error);
      toast.error(error.response?.data?.message || 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookAPI.delete(id);
        toast.success('Book deleted');
        fetchBooks();
        fetchStats();
      } catch (error) {
        toast.error('Failed to delete book');
      }
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await bookAPI.toggleFeatured(id, !currentFeatured);
      toast.success(`Book ${!currentFeatured ? 'featured' : 'unfeatured'}`);
      fetchBooks();
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'coming_soon': return 'bg-amber-100 text-amber-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    switch(status) {
      case 'published': return 'Published';
      case 'coming_soon': return 'Coming Soon';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const filteredBooks = books.filter(b =>
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-12 h-12 text-church-gold animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-church-navy">Manage Books</h1>
          <p className="text-gray-500 text-sm">Add, edit, and manage books</p>
        </div>
        <button
          onClick={openNewForm}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Book
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-church-navy">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-green-500">Published</p>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-amber-500">Coming Soon</p>
          <p className="text-2xl font-bold text-amber-600">{stats.comingSoon}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold appearance-none bg-white"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Book</th>
                <th className="px-6 py-3 font-medium">Author</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Featured</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No books found
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-12 h-16 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-16 rounded-lg bg-church-gold/10 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-church-gold" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-church-navy">{book.title}</p>
                          {book.subtitle && (
                            <p className="text-xs text-gray-400 line-clamp-1">{book.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{book.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-church-gold">
                        ₦{(book.price || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs capitalize bg-gray-100 px-2 py-1 rounded-full">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(book.status)}`}>
                        {formatStatus(book.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(book.id, book.featured)}
                        className={`p-1 rounded-lg transition-colors ${book.featured ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-300 hover:text-gray-400'}`}
                        title={book.featured ? 'Unfeature' : 'Feature'}
                      >
                        <Star className={`w-5 h-5 ${book.featured ? 'fill-yellow-500' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(book)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Book"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Form Modal with Close Button */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10 rounded-t-xl">
              <div>
                <h2 className="text-2xl font-display font-bold text-church-navy">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingBook ? 'Update book details' : 'Fill in the details below'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Maximize Your Time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  required
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="e.g., Redeeming Your Time for Kingdom Impact"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                />
              </div>

              {/* Price & Pages */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="5000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleChange}
                    placeholder="256"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  />
                </div>
              </div>

              {/* Format & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  >
                    <option value="Paperback">Paperback</option>
                    <option value="Hardcover">Hardcover</option>
                    <option value="eBook">eBook</option>
                    <option value="Audiobook">Audiobook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Christian Living"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  />
                </div>
              </div>

              {/* Release Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                <input
                  type="text"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  placeholder="e.g., August 2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the book..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold resize-none"
                />
              </div>

              {/* Cover Image */}
              <div>
                <MediaUpload
                  onUpload={(url) => setFormData({ ...formData, image: url })}
                  currentMedia={formData.image}
                  label="Book Cover Image"
                  type="image"
                  folder="books"
                />
              </div>

              {/* Color & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  >
                    {colorOptions.map((color) => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  >
                    <option value="published">Published</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-5 w-5 text-church-gold focus:ring-church-gold border-gray-300 rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Featured Book
                </label>
                <span className="text-xs text-gray-400">(Show on homepage)</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeForm}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingBook ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBooks;
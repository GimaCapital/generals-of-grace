import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Search, Edit, Trash2, User, Mail, Shield } from 'lucide-react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      console.log('📊 Users response:', response.data);
      
      // ✅ Extract users array from response
      let usersData = [];
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        usersData = response.data.data;
      } else if (response.data?.pagination) {
        usersData = response.data.data || [];
      } else {
        usersData = [];
      }
      
      setUsers(usersData);
    } catch (error) {
      // console.error('Error fetching users:', error);
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await userAPI.updateRole(userId, newRole);
      toast.success('User role updated successfully!');
      fetchUsers();
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      // console.error('Error updating role:', error);
      toast.error('Error updating user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(userId);
        toast.success('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        // console.error('Error deleting user:', error);
        toast.error('Error deleting user');
      }
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.titheNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'pastor': return 'bg-purple-100 text-purple-800';
      case 'member': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display font-bold text-church-navy">Manage Users</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Tithe Number</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid || user.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-church-gold/10 rounded-full flex items-center justify-center text-church-gold font-semibold">
                          {user.displayName?.[0] || user.email?.[0] || 'U'}
                        </div>
                        <span className="font-medium">{user.displayName || 'Unnamed'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm">{user.email}</td>
                    <td className="px-6 py-3 text-sm font-mono">{user.titheNumber || 'N/A'}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                        {user.role || 'member'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.uid || user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Edit Role Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-display font-bold text-church-navy mb-4">
              Update User Role
            </h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">User:</span> {editingUser.displayName || editingUser.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Current Role:</span>{' '}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(editingUser.role)}`}>
                  {editingUser.role || 'member'}
                </span>
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Role
              </label>
              <select
                value={editingUser.role || 'member'}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
              >
                <option value="member">Member</option>
                <option value="pastor">Pastor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleRoleUpdate(editingUser.uid || editingUser.id, editingUser.role)}
                className="btn-primary flex-1"
              >
                Update Role
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
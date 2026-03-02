import React, { useEffect, useState } from 'react';
import { adminAPI } from '../utils/api';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await adminAPI.getAllUsers();
        setUsers(response.data);
      } else if (activeTab === 'analytics') {
        const response = await adminAPI.getAnalytics();
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
        alert('User deleted');
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'analytics' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'users' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Users
          </button>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : activeTab === 'analytics' && analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-semibold">Total Users</h3>
              <p className="text-3xl font-bold text-primary mt-2">{analytics.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-semibold">Conversations</h3>
              <p className="text-3xl font-bold text-primary mt-2">{analytics.totalConversations}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-semibold">Total Messages</h3>
              <p className="text-3xl font-bold text-primary mt-2">{analytics.totalMessages}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-semibold">Intents Tracked</h3>
              <p className="text-3xl font-bold text-primary mt-2">{analytics.topIntents?.length || 0}</p>
            </div>

            {analytics.topIntents && analytics.topIntents.length > 0 && (
              <div className="col-span-full bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Top Intents</h3>
                <div className="space-y-2">
                  {analytics.topIntents.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{item.intent}</span>
                      <span className="text-primary font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'users' ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{user.name}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
};

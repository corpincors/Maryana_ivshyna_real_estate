import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const Home: NextPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users`);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    try {
      const newUser = {
        name: `User ${Date.now()}`,
        email: `user${Date.now()}@example.com`
      };
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users`, newUser);
      fetchUsers();
    } catch (err) {
      setError('Failed to add user');
      console.error('Error adding user:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>Vercel Deploy App</title>
        <meta name="description" content="Full-stack app for Vercel deployment" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Full-Stack Application
          </h1>
          
          <div className="mb-8 text-center">
            <p className="text-gray-600 mb-4">
              This app is ready for Vercel deployment with separate backend
            </p>
            <button
              onClick={addUser}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Add New User
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading users...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Users List</h2>
              {users.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No users found. Add one above!</p>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Created: {new Date(user.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Deployment Info</h2>
          <div className="space-y-2 text-blue-800">
            <p><strong>Frontend:</strong> Ready for Vercel deployment</p>
            <p><strong>Backend:</strong> Can run locally or on Linux server</p>
            <p><strong>Database:</strong> PostgreSQL with Docker support</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

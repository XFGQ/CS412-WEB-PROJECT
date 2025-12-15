'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUserPlus, FiMessageSquare } from 'react-icons/fi';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.ok) {
         alert('Kayıt başarılı! Lütfen giriş yapın.');
        router.push('/login'); 
      } else {
        const data = await response.json();
        setError(data.message || 'Kayıt başarısız oldu.');
      }
    } catch (err) {
      setError('Ağa bağlanılamadı. Sunucuyu kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center mb-8">
        <FiMessageSquare className="w-12 h-12 text-indigo-500 mb-2" />
        <h1 className="text-3xl font-extrabold text-gray-50">Register</h1>
       </div>

      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          {}
          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="Zen35"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50 transition duration-150"
          >
            {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <><FiUserPlus className="mr-2 h-4 w-4" /> Register</>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-400">
            Do you already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition duration-150">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
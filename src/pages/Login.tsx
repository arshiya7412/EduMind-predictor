import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, GraduationCap } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [registerNumber, setRegisterNumber] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registerNumber, dob, role }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.role);
        navigate(`/${data.role}/dashboard`);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-indigo-600">
          <Brain className="w-12 h-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          EduMind Predictor
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Student Performance & Mental Well-being Analytics
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          <div className="flex justify-center mb-8 space-x-4">
            <button
              onClick={() => setRole('student')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                role === 'student'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole('faculty')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                role === 'faculty'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Faculty
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="registerNumber" className="block text-sm font-medium text-slate-700">
                {role === 'student' ? 'Register Number' : 'Faculty ID'}
              </label>
              <div className="mt-1">
                <input
                  id="registerNumber"
                  name="registerNumber"
                  type="text"
                  required
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={role === 'student' ? 'e.g., REG001' : 'e.g., admin'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-slate-700">
                {role === 'student' ? 'Date of Birth' : 'Password'}
              </label>
              <div className="mt-1">
                <input
                  id="dob"
                  name="dob"
                  type={role === 'student' ? 'date' : 'password'}
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6 text-xs text-center text-slate-500">
            <p>Demo Credentials:</p>
            <p>Student: 732423243002 / 2002-05-14</p>
            <p>Faculty: admin / admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

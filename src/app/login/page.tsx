"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { supabase } from '../api/supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up
  const [message, setMessage] = useState('');
  const router = useRouter(); // Initialize useRouter

  const handleAuth = async () => {
    if (!email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      if (isSignUp) {
        // Sign-up logic
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Sign-up successful! Please check your email to confirm your account.');
      } else {
        // Login logic
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('Login successful!');
        // Redirect to the home page after successful login
        router.push('/'); // Use router.push to navigate to the home page
      }
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handlePasswordReset = async () => {
    const email = prompt('Enter your email to reset your password:');
    if (email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) alert(error.message);
      else alert('Password reset email sent!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Login'}</h1>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAuth}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
        <p className="mt-4 text-sm text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:underline"
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
        {/* Password Reset Link */}
        {!isSignUp && (
          <p className="mt-4 text-sm text-gray-600">
            Forgot your password?{' '}
            <button
              onClick={handlePasswordReset}
              className="text-blue-500 hover:underline"
            >
              Reset Password
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
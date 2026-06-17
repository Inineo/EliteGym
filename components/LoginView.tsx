"use client";

import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LoginViewProps {
  setCurrentTab: (tab: string) => void;
}

export default function LoginView({ setCurrentTab }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setCurrentTab('profile');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden animate-fade-in">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-fixed/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary-fixed/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-[#1a1a1a]/85 backdrop-blur-md rounded-2xl border border-[#333333] p-8" id="login-card">
        <div className="text-center mb-8">
          <span className="text-primary-fixed text-xs font-bold tracking-widest uppercase block mb-1">
            Access Portal
          </span>
          <h2 className="font-headline text-2xl font-bold text-white">
            Log In Your Profile
          </h2>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 text-red-300 text-xs rounded-xl text-center font-sans">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5 focus-within:text-primary-fixed transition-colors">
            <label className="text-xs font-semibold text-[#c6c6c7] block uppercase tracking-wider" htmlFor="login-email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#555555]">
                <Mail className="w-4 h-4 shrink-0" />
              </span>
              <input 
                type="email" 
                id="login-email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com" 
                className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed rounded-lg py-3 pl-11 pr-4 text-sm text-white placeholder:text-[#555555] outline-none transition-all font-sans"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 focus-within:text-primary-fixed transition-colors">
            <label className="text-xs font-semibold text-[#c6c6c7] block uppercase tracking-wider" htmlFor="login-password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#555555]">
                <Lock className="w-4 h-4 shrink-0" />
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="login-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed rounded-lg py-3 pl-11 pr-11 text-sm text-white placeholder:text-[#555555] outline-none transition-all font-sans"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#555555] hover:text-[#c6c6c7] transition-colors cursor-pointer select-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary-fixed text-[#161e00] font-sans font-bold py-3.5 rounded-lg active:scale-95 hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer pt-3.5"
          >
            <span>{isSubmitting ? 'Verifying Credentials...' : 'Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[#c6c6c7] font-semibold">
          Don&apos;t have an elite account yet?{' '}
          <button 
            onClick={() => setCurrentTab('register')}
            className="text-primary-fixed font-bold hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

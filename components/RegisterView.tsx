"use client";

import { useState, FormEvent } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RegisterViewProps {
  setCurrentTab: (tab: string) => void;
}

export default function RegisterView({ setCurrentTab }: RegisterViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please populate all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          phone: phone,
          avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQt8ldxv-A5SOv2ERhY7nSjDgvxqe48GmFwWYQi7BTTAWzSuGFjT0F5TdTdTfSE5DWSKlbtxx6kQ3rkBfJ4MbCG4ALf10w2nXXwjDPTgFEQUDGPszvA87QxbYPjQ-XR_Wiw8VLhQE9ti-XevJt3NFkWRF3Sy7W7SvCanvU8p7KkkZUirTioKXILa5s16dKpuTL3ufDKNFmS8QhEsFMX5aKemVEQN0tX8tvmkSaGNiWJc2COh2eEcKjTzLkaTz-5AfMAxDVNKFpIMJf'
        }
      }
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert(`Registration authorized! Welcome to Elite Fitness.`);
      setCurrentTab('profile'); // Instantly redirect
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden animate-fade-in">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-fixed/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary-fixed/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-[#1a1a1a]/85 backdrop-blur-md rounded-2xl border border-[#333333] p-8" id="register-card">
        {/* Card Header */}
        <div className="text-center mb-8">
          <span className="text-primary-fixed text-xs font-bold tracking-widest uppercase block mb-1">
            REGISTRATION
          </span>
          <h2 className="font-headline text-2xl font-bold text-white">
            Create Elite Account
          </h2>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 text-red-300 text-xs rounded-xl text-center font-sans">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div className="space-y-1 focus-within:text-primary-fixed transition-colors">
            <label className="text-xs font-semibold text-[#c6c6c7] block uppercase tracking-wider" htmlFor="reg-name">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#555555]">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                id="reg-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Sarah Miller"
                className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed rounded-lg py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-[#555555] outline-none transition-all font-sans"
                required
              />
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-1 focus-within:text-primary-fixed transition-colors">
            <label className="text-xs font-semibold text-[#c6c6c7] block uppercase tracking-wider" htmlFor="reg-email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#555555]">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                id="reg-email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed rounded-lg py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-[#555555] outline-none transition-all font-sans"
                required
              />
            </div>
          </div>

          {/* Phone field */}
          <div className="space-y-1 focus-within:text-primary-fixed transition-colors">
            <label className="text-xs font-semibold text-[#c6c6c7] block uppercase tracking-wider" htmlFor="reg-phone">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#555555]">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="text"
                id="reg-phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed rounded-lg py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-[#555555] outline-none transition-all font-sans"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1 focus-within:text-primary-fixed transition-colors">
            <label className="text-xs font-semibold text-[#c6c6c7] block uppercase tracking-wider" htmlFor="reg-password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#555555]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="reg-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed rounded-lg py-2.5 pl-11 pr-11 text-sm text-white placeholder:text-[#555555] outline-none transition-all font-sans"
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

          {/* Confirm Password field */}
          <div className="space-y-1 focus-within:text-primary-fixed transition-colors">
            <label className="text-xs font-semibold text-[#c6c6c7] block uppercase tracking-wider" htmlFor="reg-confirm-password">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#555555]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="reg-confirm-password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed rounded-lg py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-[#555555] outline-none transition-all font-sans"
                required
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-fixed text-[#161e00] font-sans font-bold py-3.5 rounded-lg active:scale-95 hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            <span>{isSubmitting ? 'Registering Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[#c6c6c7] font-semibold">
          Already have an elite account?{' '}
          <button
            onClick={() => setCurrentTab('login')}
            className="text-primary-fixed font-bold hover:underline cursor-pointer"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition, ChangeEvent, FormEvent } from 'react';
import { 
  Mail, 
  Phone, 
  Edit3, 
  LogOut, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Award,
  ShieldCheck,
  User,
  Users,
  UserPlus,
  Activity,
  Check,
  X
} from 'lucide-react';
import { UserProfile } from '../types';
import { supabase } from '@/lib/supabase';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updatedFields: Partial<UserProfile>) => void;
  onLogout: () => void;
  setCurrentTab: (tab: string) => void;
}

export default function ProfileView({ user, onUpdateUser, onLogout, setCurrentTab }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: user.bio,
  });

  // Check-In interaction simulation states
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(user.lastCheckInTime === 'Not checked in' ? null : user.lastCheckInTime);

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEditForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: editForm.name,
      phone: editForm.phone,
      bio: editForm.bio,
    });
    setIsEditing(false);
  };

  // Perform interactive Check-In simulation
  const triggerCheckIn = async () => {
    if (isCheckedIn) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in to check in.');
        return;
      }

      // 1. Insert check-in log
      const { error: insError } = await supabase
        .from('check_ins')
        .insert({ user_id: session.user.id });

      if (insError) {
        alert('Failed to log check-in: ' + insError.message);
        return;
      }

      // 2. Increment total visits and update last check-in on profile
      const newVisits = user.totalVisits + 1;
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const { error: updError } = await supabase
        .from('profiles')
        .update({
          total_visits: newVisits,
          last_check_in: now.toISOString()
        })
        .eq('id', session.user.id);

      if (updError) {
        console.error('Failed to update visits statistic:', updError);
      }

      setIsCheckedIn(true);
      setCheckInTime(formattedTime);

      // Update user stats reactively in local state
      const newProgress = Math.min(user.currentProgressDays + 1, user.totalDaysInCycle);
      onUpdateUser({
        totalVisits: newVisits,
        currentProgressDays: newProgress,
        lastCheckInTime: formattedTime
      });

      alert(`Check-in successful with clinical precision at ${formattedTime}! Welcome to the Elite club floor.`);
    } catch (err) {
      console.error('Check-in exception:', err);
      alert('Network error during check-in process.');
    }
  };

  return (
    <div className="animate-fade-in text-white py-12">
      {/* Edit Profile Sidebar Drawer / Overlay modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl w-full max-w-md p-6 relative">
            <button 
              className="absolute top-4 right-4 text-[#c6c6c7] hover:text-white cursor-pointer"
              onClick={() => setIsEditing(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-headline text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary-fixed" />
              <span>Modify Elite Profile Credentials</span>
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#c6c6c7] uppercase block" htmlFor="edit-name">
                  Name
                </label>
                <input 
                  type="text" 
                  id="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed rounded-lg py-2.5 px-3.5 text-sm text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#c6c6c7] uppercase block" htmlFor="edit-email">
                  Email
                </label>
                <input 
                  type="email" 
                  id="email"
                  value={editForm.email}
                  disabled
                  className="w-full bg-[#131313]/50 border border-[#333333]/50 rounded-lg py-2.5 px-3.5 text-sm text-gray-500 cursor-not-allowed"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#c6c6c7] uppercase block" htmlFor="edit-phone">
                  Phone Number
                </label>
                <input 
                  type="text" 
                  id="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed rounded-lg py-2.5 px-3.5 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#c6c6c7] uppercase block" htmlFor="edit-bio">
                  Athletic Bio / Subtitle
                </label>
                <input 
                  type="text" 
                  id="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed rounded-lg py-2.5 px-3.5 text-sm text-white"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-[#333333] hover:bg-white/5 py-3 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary-fixed text-[#161e00] font-sans font-semibold py-3 rounded-xl text-sm font-bold cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Grid elements */}
      <div className="max-w-7xl mx-auto px-4 md:px-16" id="profile-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Section 1: Profile Details Card (Asymmetric Bento Card: 8 Columns) */}
          <section className="md:col-span-8 bento-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8" id="profile-header-card">
            <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 rounded-full overflow-hidden border-2 border-primary-fixed/20 relative select-none">
              <img 
                src={user.avatarUrl} 
                className="w-full h-full object-cover grayscale brightness-110 saturate-125" 
                alt={`${user.name} Profile Photo`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            <div className="flex flex-col text-center md:text-left justify-center h-full">
              <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">
                {user.name}
              </h1>
              <p className="text-[#c6c6c7] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-6">
                {user.bio} | Since {user.joinedYear}
              </p>

              <div className="space-y-3.5">
                <div className="flex items-center justify-center md:justify-start gap-3 text-[#c6c6c7] hover:text-white transition-colors">
                  <Mail className="text-primary-fixed w-4 h-4" />
                  <span className="font-sans text-xs sm:text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-[#c6c6c7] hover:text-white transition-colors">
                  <Phone className="text-primary-fixed w-4 h-4" />
                  <span className="font-sans text-xs sm:text-sm font-medium">{user.phone || '-'}</span>
                </div>
              </div>

              {/* Edit Buttons action row */}
              <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-primary-fixed text-[#161e00] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 active:scale-95 transition-transform hover:opacity-90 select-none cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="border border-[#333333] hover:border-red-500/50 hover:text-red-400 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold active:scale-95 transition-all select-none cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Membership Member Pass (4 Columns) */}
          <section className="md:col-span-4 bento-card rounded-2xl p-6 flex flex-col items-center justify-center text-center" id="member-pass-card">
            <h3 className="font-headline text-lg md:text-xl font-bold text-white mb-4">Member Pass</h3>
            <div className="bg-white p-2.5 rounded-xl mb-4 glow-lime relative select-none">
              <img 
                src={user.avatarUrl.includes('AB6AXuBQt8') ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBd_TKTzOMaTsbT6cBKppxWpj201jaYbTCZzPJ1lbc8q_lQKOfUfUroqF4RJW-S1FOVyPqZxEi2GAIS6Lsgfe-9-x74z54_MnpDkaw1uXHJSOANODGZjydU5NTlc_dsSXEWMT04pjEDDKz8WTh-cCtabn4zBysRdG5JJ_7TVFJk5mJG2LBD-E4KEo9vQwJwvoN5VdLSfi3mqPJm1D7j1tURafmDv2Z6t1afGr2Y7VgKgRuQqLtVk5g1srZN65gPj1OrcAKK9fkSB5wf" : user.avatarUrl} 
                className="w-44 h-44 object-contain brightness-95" 
                alt="Membership Access Code" 
              />
              <div className="absolute inset-0 bg-primary-fixed/5 pointer-events-none rounded-xl"></div>
            </div>
            <p className="font-sans text-[10px] font-bold text-[#c6c6c7] tracking-widest uppercase">
              MEMBER ID: {user.memberId}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-primary-fixed text-xs font-bold uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-primary-fixed fill-current text-opacity-10 shrink-0" />
              <span>Verified Member</span>
            </div>
          </section>

          {/* Section 3: Current active package & progress (6 Columns) */}
          <section className="md:col-span-6 bento-card rounded-2xl p-6 md:p-8 flex flex-col justify-between" id="membership-detail-card">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline text-lg md:text-xl font-bold text-white">Membership</h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.membershipActive ? 'bg-primary-fixed/10 border border-primary-fixed/20 text-primary-fixed' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {user.membershipActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-[#333333] pb-4">
                <div>
                  <p className="text-[#c6c6c7] text-[10px] font-bold uppercase tracking-widest mb-1">
                    Current Package
                  </p>
                  <p className="font-headline text-lg md:text-2xl font-bold text-white leading-tight">
                    {user.packageLevel}
                  </p>
                </div>
                <Award className="text-primary-fixed w-8 h-8 shrink-0" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#c6c6c7] text-[10px] font-bold uppercase tracking-widest mb-1 col-span-1">
                    Renewal Date
                  </p>
                  <p className="font-sans text-xs sm:text-sm font-semibold text-white">
                    {user.renewalDate}
                  </p>
                </div>
                <div>
                  <p className="text-[#c6c6c7] text-[10px] font-bold uppercase tracking-widest mb-1 col-span-1">
                    Payment Method
                  </p>
                  <p className="font-sans text-xs sm:text-sm font-semibold text-white">
                    {user.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Gym Package & Manage Squad Button */}
              <div className="flex items-center justify-between pt-4 border-t border-[#333333]/50">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary-fixed shrink-0" />
                  <span className="font-sans text-xs sm:text-sm font-semibold text-white">Team 4 Membership</span>
                </div>
                <button 
                  onClick={() => setCurrentTab('squad')}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#333333] hover:bg-white/5 text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Manage Squad</span>
                </button>
              </div>

              <div className="pt-4 border-t border-[#333333]/50">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-[#c6c6c7]">Monthly Cycle Progress</span>
                  <span className="text-primary-fixed">{user.currentProgressDays} / {user.totalDaysInCycle} Days</span>
                </div>
                {/* Horizontal progress bar */}
                <div className="h-2.5 bg-[#1f1f1f] rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-primary-fixed rounded-full transition-all duration-500 shadow-[0_0_8px_#c3f400]" 
                    style={{ width: `${user.totalDaysInCycle > 0 ? (user.currentProgressDays / user.totalDaysInCycle) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Performance, Streak, and Live Check-In (6 Columns) */}
          <section className="md:col-span-6 bento-card rounded-2xl p-6 md:p-8" id="performance-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline text-lg md:text-xl font-bold text-white">Performance</h3>
              <Activity className="text-[#c6c6c7] w-5 h-5" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#1f1f1f] rounded-xl p-4 text-center border border-[#333333]/40 flex flex-col justify-center min-h-[120px]">
                <p className="text-[#c6c6c7] text-[10px] uppercase font-bold tracking-widest mb-1">Total Visits</p>
                <p className="font-headline text-4xl font-extrabold text-primary-fixed leading-none my-1">
                  {user.totalVisits}
                </p>
                <p className="text-[10px] text-[#c6c6c7] mt-1">All-time diagnostic logs</p>
              </div>

              <div className="bg-[#1f1f1f] rounded-xl p-4 text-center border border-[#333333]/40 flex flex-col justify-center min-h-[120px] relative overflow-hidden group">
                <p className="text-[#c6c6c7] text-[10px] uppercase font-bold tracking-widest mb-1">Check-in</p>
                <p className="font-headline text-lg font-bold text-white mt-1">
                  {isCheckedIn ? 'Status: Active' : 'Logged Today'}
                </p>
                <p className="text-xs font-bold text-primary-fixed mt-1 tracking-wider uppercase">
                  {checkInTime || 'Not checked in'}
                </p>
                
                {/* Simulated check-in interaction */}
                {!isCheckedIn && (
                  <button 
                    onClick={triggerCheckIn}
                    className="absolute inset-0 bg-primary-fixed text-[#161e00] font-sans font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm cursor-pointer select-none"
                  >
                    Check In Now
                  </button>
                )}
              </div>
            </div>

            {/* Streak information row */}
            <div className="bg-primary-fixed/5 border border-primary-fixed/10 p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-fixed text-[#161e00] rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <h4 className="font-headline text-sm font-semibold text-white">Personal Best Streak</h4>
                <p className="text-xs text-[#c6c6c7] mt-1">
                  {user.bestStreak} consecutive clinical days achieved at UK Campus.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeView from '@/components/HomeView';
import PackagesView from '@/components/PackagesView';
import ProfileView from '@/components/ProfileView';
import LoginView from '@/components/LoginView';
import RegisterView from '@/components/RegisterView';
import SquadView from '@/components/SquadView';
import { UserProfile } from '@/types';
import { supabase } from '@/lib/supabase';

const INITIAL_PROFILE: UserProfile = {
  name: 'Sarah Miller',
  email: 'sarah.miller@example.com',
  phone: '+1 (555) 123-4567',
  joinedYear: 2022,
  bio: 'Dedicated Athlete',
  membershipActive: true,
  packageLevel: 'Elite Monthly',
  renewalDate: 'Oct 12, 2026',
  paymentMethod: '•••• 4412',
  currentProgressDays: 18,
  totalDaysInCycle: 30,
  totalVisits: 42,
  lastCheckInTime: 'Today 06:45 AM',
  bestStreak: 12,
  memberId: '#EF-90210-SM',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQt8ldxv-A5SOv2ERhY7nSjDgvxqe48GmFwWYQi7BTTAWzSuGFjT0F5TdTdTfSE5DWSKlbtxx6kQ3rkBfJ4MbCG4ALf10w2nXXwjDPTgFEQUDGPszvA87QxbYPjQ-XR_Wiw8VLhQE9ti-XevJt3NFkWRF3Sy7W7SvCanvU8p7KkkZUirTioKXILa5s16dKpuTL3ufDKNFmS8QhEsFMX5aKemVEQN0tX8tvmkSaGNiWJc2COh2eEcKjTzLkaTz-5AfMAxDVNKFpIMJf',
};

export default function Page() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fungsi untuk memuat data profil dari database Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      // 1. Ambil data profil dasar
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      // 2. Ambil keanggotaan/membership aktif terbaru
      const { data: membership } = await supabase
        .from('memberships')
        .select(`
          id,
          start_date,
          end_date,
          payment_method,
          package_id,
          membership_packages (
            name
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('start_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      const pkgName = membership && (membership as any).membership_packages
        ? (membership as any).membership_packages.name
        : null;

      // 3. Petakan ke format antarmuka UserProfile React
      const mappedUser: UserProfile = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone || '',
        joinedYear: profile.joined_year,
        bio: profile.bio || 'Dedicated Athlete',
        membershipActive: !!membership,
        packageLevel: pkgName ? `${pkgName} Monthly` : 'No Active Membership',
        renewalDate: membership 
          ? new Date(membership.end_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) 
          : '-',
        paymentMethod: membership ? (membership.payment_method || 'Virtual Account').toUpperCase() : '-',
        currentProgressDays: membership 
          ? Math.max(1, Math.min(30, Math.round((Date.now() - new Date(membership.start_date).getTime()) / (1000 * 60 * 60 * 24)))) 
          : 0,
        totalDaysInCycle: 30,
        totalVisits: profile.total_visits || 0,
        lastCheckInTime: profile.last_check_in 
          ? new Date(profile.last_check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : 'Not checked in',
        bestStreak: profile.best_streak || 0,
        memberId: profile.member_id,
        avatarUrl: profile.avatar_url || INITIAL_PROFILE.avatarUrl,
      };

      setUser(mappedUser);
    } catch (err) {
      console.error('Failed to load user profile details:', err);
    }
  };

  // Dengarkan status autentikasi Supabase secara real-time
  useEffect(() => {
    // Muat session aktif pertama kali
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    }).catch(err => {
      console.error('Error getting Supabase session:', err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsLoggedIn(true);
        fetchUserProfile(session.user.id);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setLoading(false);
    });

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setCurrentTab(tabParam);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update profil lokal & Supabase
  const handleUpdateUserFields = async (updatedFields: Partial<UserProfile>) => {
    if (!user) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Mapping fields kembali ke format kolom snake_case PostgreSQL
    const updatePayload: any = {};
    if (updatedFields.name !== undefined) updatePayload.name = updatedFields.name;
    if (updatedFields.phone !== undefined) updatePayload.phone = updatedFields.phone;
    if (updatedFields.bio !== undefined) updatePayload.bio = updatedFields.bio;

    const { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', session.user.id);

    if (!error) {
      setUser(prev => prev ? { ...prev, ...updatedFields } : null);
    } else {
      console.error('Failed to update profile in database:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setCurrentTab('home');
  };

  const renderContentView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[50vh] text-[#c6c6c7]">
          <div className="w-10 h-10 border-t-2 border-primary-fixed rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (currentTab) {
      case 'home':
        return <HomeView setCurrentTab={setCurrentTab} isLoggedIn={isLoggedIn} />;
      case 'packages':
        return (
          <PackagesView 
            setCurrentTab={setCurrentTab} 
            isLoggedIn={isLoggedIn} 
            user={user} 
            onUpdatePackage={async (newPackage) => {
              // Redirect to checkout page
              window.location.href = `/checkout?plan=${encodeURIComponent(newPackage)}`;
            }}
          />
        );
      case 'profile':
        if (isLoggedIn && user) {
          return (
            <ProfileView 
              user={user} 
              onUpdateUser={handleUpdateUserFields} 
              onLogout={handleLogout} 
              setCurrentTab={setCurrentTab}
            />
          );
        }
        return <LoginView setCurrentTab={setCurrentTab} />;
      case 'squad':
        if (isLoggedIn && user) {
          return <SquadView user={user} setCurrentTab={setCurrentTab} />;
        }
        return <LoginView setCurrentTab={setCurrentTab} />;
      case 'login':
        return <LoginView setCurrentTab={setCurrentTab} />;
      case 'register':
        return <RegisterView setCurrentTab={setCurrentTab} />;
      default:
        return <HomeView setCurrentTab={setCurrentTab} isLoggedIn={isLoggedIn} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark font-sans" id="applet-root">
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isLoggedIn={isLoggedIn} 
        user={user} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-4 md:px-0">
        {renderContentView()}
      </main>

      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}


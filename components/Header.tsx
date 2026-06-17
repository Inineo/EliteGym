"use client";

import { Dumbbell, User, LogOut, Award } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isLoggedIn: boolean;
  user: UserProfile | null;
  onLogout: () => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  isLoggedIn,
  user,
  onLogout,
}: HeaderProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#131313]/90 backdrop-blur-md border-b border-[#333333]/40">
      <div className="flex justify-between items-center px-4 md:px-16 py-4 w-full max-w-7xl mx-auto">
        {/* Brand Name */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="font-headline text-xl md:text-2xl font-bold text-primary-fixed tracking-tighter uppercase cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-2"
          id="nav-logo"
        >
          <Dumbbell className="w-6 h-6 text-primary-fixed" />
          <span>ELITE FITNESS</span>
        </div>

        {/* Center navigation */}
        <div className="hidden md:flex items-center space-x-12 font-sans text-sm font-medium">
          <button
            id="nav-home"
            onClick={() => setCurrentTab('home')}
            className={`transition-colors duration-200 cursor-pointer ${
              currentTab === 'home'
                ? 'text-primary-fixed border-b-2 border-primary-fixed pb-1'
                : 'text-[#c6c6c7] hover:text-primary-fixed'
            }`}
          >
            Home
          </button>
          <button
            id="nav-packages"
            onClick={() => setCurrentTab('packages')}
            className={`transition-colors duration-200 cursor-pointer ${
              currentTab === 'packages'
                ? 'text-primary-fixed border-b-2 border-primary-fixed pb-1'
                : 'text-[#c6c6c7] hover:text-primary-fixed'
            }`}
          >
            Packages
          </button>
          <button
            id="nav-profile"
            onClick={() => {
              if (isLoggedIn) {
                setCurrentTab('profile');
              } else {
                setCurrentTab('login');
              }
            }}
            className={`transition-colors duration-200 cursor-pointer ${
              currentTab === 'profile'
                ? 'text-primary-fixed border-b-2 border-primary-fixed pb-1'
                : 'text-[#c6c6c7] hover:text-primary-fixed'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-2">
              <div 
                onClick={() => setCurrentTab('profile')}
                className="hidden sm:flex flex-col text-right cursor-pointer group"
              >
                <span className="text-xs font-semibold text-white group-hover:text-primary-fixed transition-colors">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#c6c6c7] uppercase tracking-wider">
                  {user.packageLevel}
                </span>
              </div>
              <img
                src={user.avatarUrl}
                alt={user.name}
                id="header-user-avatar"
                className="w-8 h-8 rounded-full border border-primary-fixed/30 object-cover cursor-pointer hover:border-primary-fixed transition-colors"
                onClick={() => setCurrentTab('profile')}
              />
              <button
                id="header-logout-btn"
                onClick={onLogout}
                title="Log out"
                className="p-1.5 rounded-lg border border-[#333333] hover:border-red-500/50 hover:text-red-400 text-[#c6c6c7] transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                onClick={() => setCurrentTab('login')}
                className="text-white hover:text-primary-fixed text-sm font-medium px-3 py-1.5 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                id="header-join-btn"
                onClick={() => setCurrentTab('register')}
                className="bg-primary-fixed text-[#161e00] font-sans font-semibold text-xs md:text-sm px-4 py-2 rounded-lg hover:opacity-85 transition-all cursor-pointer font-bold select-none active:scale-95"
              >
                Join Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden flex justify-around items-center border-t border-[#333333]/30 bg-[#0e0e0e]/95 py-2 font-sans text-xs">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-0.5 ${currentTab === 'home' ? 'text-primary-fixed font-semibold' : 'text-[#c6c6c7]'}`}
        >
          <span>Home</span>
        </button>
        <button
          onClick={() => setCurrentTab('packages')}
          className={`flex flex-col items-center gap-0.5 ${currentTab === 'packages' ? 'text-primary-fixed font-semibold' : 'text-[#c6c6c7]'}`}
        >
          <span>Packages</span>
        </button>
        <button
          onClick={() => {
            if (isLoggedIn) {
              setCurrentTab('profile');
            } else {
              setCurrentTab('login');
            }
          }}
          className={`flex flex-col items-center gap-0.5 ${currentTab === 'profile' ? 'text-primary-fixed font-semibold' : 'text-[#c6c6c7]'}`}
        >
          <span>Profile</span>
        </button>
      </div>
    </nav>
  );
}

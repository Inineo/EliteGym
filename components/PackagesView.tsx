"use client";

import { useState } from 'react';
import { 
  User, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  Sparkles,
  Award,
  ShieldCheck,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';

interface PackagesViewProps {
  setCurrentTab: (tab: string) => void;
  isLoggedIn: boolean;
  user: UserProfile | null;
  onUpdatePackage: (newPackageLevel: string) => void;
}
export default function PackagesView({ 
  setCurrentTab, 
  isLoggedIn, 
  user, 
  onUpdatePackage 
}: PackagesViewProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePurchase = (planName: string) => {
    if (!isLoggedIn) {
      alert(`Please sign in or register to join the ${planName} plan!`);
      setCurrentTab('login');
      return;
    }
    window.location.href = `/checkout?plan=${encodeURIComponent(planName)}`;
  };

  return (
    <div className="animate-fade-in text-white py-12">
      {/* Success Modal Toast */}
      {successMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#161e00] border border-primary-fixed rounded-2xl p-6 shadow-[0_0_35px_rgba(195,244,0,0.4)] max-w-md w-[90%] text-center animate-bounce">
          <Sparkles className="w-12 h-12 text-primary-fixed mx-auto mb-3" />
          <h4 className="font-headline text-lg font-bold text-white mb-2">ACCESS GRANTED</h4>
          <p className="text-xs text-[#c6c6c7] leading-relaxed mb-1">{successMsg}</p>
        </div>
      )}

      {/* Confirmation modal removed - handled in checkout page */}

      {/* Membership Packages Section */}
      <section className="px-6 md:px-16 max-w-7xl mx-auto mb-20">
        <div className="mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-white mb-3">Uncompromising Performance</h1>
          <p className="font-sans text-sm sm:text-base text-[#c6c6c7] max-w-2xl leading-relaxed">
            Clinical precision in every rep. Choose the membership tier that aligns perfectly with your elite fitness trajectory.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          
          {/* Individual Card */}
          <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#333333] rounded-2xl p-6 flex flex-col justify-between hover:border-primary-fixed/50 transition-all group lg:p-8">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="text-primary-fixed text-xs tracking-widest uppercase font-semibold">Individual</span>
                <User className="text-[#c6c6c7] w-5 h-5 shrink-0" />
              </div>
              <h3 className="font-headline text-2xl font-bold text-white mb-2">Single</h3>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-extrabold text-primary-fixed">$120</span>
                <span className="text-[#c6c6c7] text-xs font-semibold">/ MONTH</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-[#e2e2e2]">
                  <Check className="text-primary-fixed w-4 h-4 shrink-0" />
                  <span>24/7 Elite Digital Access</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#e2e2e2]">
                  <Check className="text-primary-fixed w-4 h-4 shrink-0" />
                  <span>Biometric Precision Assessment</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#e2e2e2]">
                  <Check className="text-primary-fixed w-4 h-4 shrink-0" />
                  <span>Standard Recovery Zone Access</span>
                </li>
              </ul>
            </div>
            <button 
              id="plan-buy-single"
              onClick={() => handlePurchase('Single')}
              className="w-full bg-primary-fixed hover:-translate-y-0.5 active:scale-95 text-[#161e00] text-sm font-bold py-3.5 uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_15px_rgba(195,244,0,0.15)] group-hover:shadow-[0_4px_25px_rgba(195,244,0,0.3)] cursor-pointer"
            >
              Purchase
            </button>
          </div>

          {/* Couple Card (Featured Highlight) */}
          <div 
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
              });
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-[#1f1f1f] border-2 border-primary-fixed rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 lg:p-8 hover:shadow-[0_0_35px_rgba(195,244,0,0.25)] hover:border-primary-fixed"
          >
            {/* Interactive Glow Background */}
            <div 
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
              style={{
                background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(195, 244, 0, 0.18), transparent 80%)`
              }}
            />
            
            {/* Interactive Border Light Effect */}
            <div 
              className="pointer-events-none absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
              style={{
                background: `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, rgba(195, 244, 0, 0.4), transparent 60%)`,
                padding: '2px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              }}
            />

            <div className="absolute top-4 right-[-32px] bg-primary-fixed text-[#161e00] px-10 py-1 rotate-45 text-[10px] font-bold uppercase tracking-widest leading-none z-20">
              Popular
            </div>
            <div className="relative z-20">
              <div className="flex justify-between items-start mb-6">
                <span className="text-primary-fixed text-xs tracking-widest uppercase font-semibold">Partnership</span>
                <Users className="text-primary-fixed w-5 h-5 shrink-0" />
              </div>
              <h3 className="font-headline text-2xl font-bold text-white mb-2">Couple</h3>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-extrabold text-primary-fixed">$200</span>
                <span className="text-[#c6c6c7] text-xs font-semibold">/ MONTH</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-[#e2e2e2]">
                  <Check className="text-primary-fixed w-4 h-4 shrink-0" />
                  <span className="font-semibold text-white">Full Clinic Access for Two</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#e2e2e2]">
                  <Check className="text-primary-fixed w-4 h-4 shrink-0" />
                  <span>Shared Nutrition Consult Desk</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#e2e2e2]">
                  <Check className="text-primary-fixed w-4 h-4 shrink-0" />
                  <span>Priority Booking Allocation</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#e2e2e2]">
                  <Check className="text-primary-fixed w-4 h-4 shrink-0" />
                  <span>Monthly Hyperbaric Session Entry</span>
                </li>
              </ul>
            </div>
            <div className="relative z-20">
              <button 
                id="plan-buy-couple"
                onClick={() => handlePurchase('Couple')}
                className="w-full bg-primary-fixed hover:-translate-y-0.5 active:scale-95 text-[#161e00] text-sm font-bold py-3.5 uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_25px_rgba(195,244,0,0.3)] cursor-pointer"
              >
                Purchase
              </button>
            </div>
          </div>

          {/* Team Room Card */}
          <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#333333] rounded-2xl p-6 flex flex-col justify-between hover:border-primary-fixed/50 transition-all group lg:p-8">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="text-primary-fixed text-xs tracking-widest uppercase font-semibold">Squad</span>
                <Users className="text-[#c6c6c7] w-5 h-5 shrink-0" />
              </div>
              <h3 className="font-headline text-2xl font-bold text-white mb-2">Team 4</h3>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-extrabold text-primary-fixed">$350</span>
                <span className="text-[#c6c6c7] text-xs font-semibold">/ MONTH</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-[#e2e2e2]">
                  <Check className="text-primary-fixed w-4 h-4 shrink-0" />
                  <span>Corporate Tier Access Perks</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#e2e2e2]">
                  <Check className="text-primary-fixed w-4 h-4 shrink-0" />
                  <span>Group Performance Lab entry</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#e2e2e2]">
                  <Check className="text-primary-fixed w-4 h-4 shrink-0" />
                  <span>Dedicated Private Locker Row</span>
                </li>
              </ul>
            </div>
            <button 
              id="plan-buy-team"
              onClick={() => handlePurchase('Team 4')}
              className="w-full bg-primary-fixed hover:-translate-y-0.5 active:scale-95 text-[#161e00] text-sm font-bold py-3.5 uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_15px_rgba(195,244,0,0.15)] group-hover:shadow-[0_4px_25px_rgba(195,244,0,0.3)] cursor-pointer"
            >
              Purchase
            </button>
          </div>
        </div>

        {/* Separator Line */}
        <div className="h-px bg-[#333333]/40 w-full mb-16"></div>

        {/* Personal Trainer Packages Module */}
        <div className="mb-8">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-white mb-3">
            Personal Trainer Packages
          </h2>
          <p className="font-sans text-xs md:text-sm text-[#c6c6c7] leading-relaxed">
            Direct, elite-level guidance from industry-leading kinesiologists and diagnostic coaches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Trainer Tier 1 */}
          <div className="bg-[#1b1b1b] border border-[#333333]/50 hover:bg-[#1f1f1f] rounded-2xl p-6 flex flex-col justify-between group transition-all">
            <div className="mb-6">
              <div className="w-11 h-11 rounded-full bg-primary-fixed/10 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-primary-fixed" />
              </div>
              <h4 className="font-headline text-xl font-bold text-white mb-2">Single PT</h4>
              <p className="text-primary-fixed font-headline text-2xl font-extrabold mb-4">
                $85 <span className="text-[#c6c6c7] text-xs font-semibold">/ SESSION</span>
              </p>
              <div className="space-y-2 mt-4">
                <p className="text-xs text-[#c6c6c7] font-semibold">• 1-on-1 Precision Focus</p>
                <p className="text-xs text-[#c6c6c7] font-semibold">• Custom Diagnostics Blueprint</p>
                <p className="text-xs text-[#c6c6c7] font-semibold">• Bi-Weekly Posture Telemetry Check</p>
              </div>
            </div>
            <button 
              onClick={() => handlePurchase('Single PT (Session)')}
              className="w-full bg-primary-fixed hover:opacity-85 text-[#161e00] text-xs font-bold py-2.5 uppercase tracking-wider rounded-lg transition-all cursor-pointer"
            >
              Purchase
            </button>
          </div>

          {/* Trainer Tier 2 */}
          <div className="bg-[#1b1b1b] border border-[#333333]/50 hover:bg-[#1f1f1f] rounded-2xl p-6 flex flex-col justify-between group transition-all">
            <div className="mb-6">
              <div className="w-11 h-11 rounded-full bg-primary-fixed/10 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-primary-fixed" />
              </div>
              <h4 className="font-headline text-xl font-bold text-white mb-2">Couple PT</h4>
              <p className="text-primary-fixed font-headline text-2xl font-extrabold mb-4">
                $140 <span className="text-[#c6c6c7] text-xs font-semibold">/ SESSION</span>
              </p>
              <div className="space-y-2 mt-4">
                <p className="text-xs text-[#c6c6c7] font-semibold">• Dual Coach Performance Sync</p>
                <p className="text-xs text-[#c6c6c7] font-semibold">• Competitive Diagnostic Tracking</p>
                <p className="text-xs text-[#c6c6c7] font-semibold">• Shared Kinesiology Milestones</p>
              </div>
            </div>
            <button 
              onClick={() => handlePurchase('Couple PT (Session)')}
              className="w-full bg-primary-fixed hover:opacity-85 text-[#161e00] text-xs font-bold py-2.5 uppercase tracking-wider rounded-lg transition-all cursor-pointer"
            >
              Purchase
            </button>
          </div>

          {/* Trainer Tier 3 */}
          <div className="bg-[#1b1b1b] border border-[#333333]/50 hover:bg-[#1f1f1f] rounded-2xl p-6 flex flex-col justify-between group transition-all">
            <div className="mb-6">
              <div className="w-11 h-11 rounded-full bg-primary-fixed/10 flex items-center justify-center mb-4">
                <Award className="w-5 h-5 text-primary-fixed" />
              </div>
              <h4 className="font-headline text-xl font-bold text-white mb-2">Team PT</h4>
              <p className="text-primary-fixed font-headline text-2xl font-extrabold mb-4">
                $240 <span className="text-[#c6c6c7] text-xs font-semibold">/ SESSION</span>
              </p>
              <div className="space-y-2 mt-4">
                <p className="text-xs text-[#c6c6c7] font-semibold">• Up to 4 Active Participants</p>
                <p className="text-xs text-[#c6c6c7] font-semibold">• High-Intensity Circuit Lab</p>
                <p className="text-xs text-[#c6c6c7] font-semibold">• Shared Accountability Tracking</p>
              </div>
            </div>
            <button 
              onClick={() => handlePurchase('Team PT (Session)')}
              className="w-full bg-primary-fixed hover:opacity-85 text-[#161e00] text-xs font-bold py-2.5 uppercase tracking-wider rounded-lg transition-all cursor-pointer"
            >
              Purchase
            </button>
          </div>
        </div>
      </section>

      {/* Asymmetric Visual Section: Why Elite Fitness? */}
      <section className="px-6 md:px-16 overflow-hidden max-w-7xl mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Grayscale styled image */}
          <div className="w-full md:w-1/2 relative h-[380px] rounded-2xl overflow-hidden border border-[#333333]">
            <img 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 saturate-120" 
              alt="Cinematic high contrast gym interior with neon lines" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-qx1lnZfWrux-c3OBF4eQhYOroGZeJuX9FgQ85Q8C9DfpIwX7lFFdwIC78gIfPJQeont-eh2XM_dnRusikksKeY-RD-Ac9phdjJj1CX-UIJdluRm4hJBbFm-xcBigPVu5seFtiIB6y30_iTRD-Alj8sPFXcvB2aPD4GC8YfMyeTlc_f_HmuWgnV2-5GCKek05zYaNQLhO83LvTtXAraiPCp97cio0x4NjNEg8AMuOn6wwIFL8OLD6aOX91BgiqScRZOqz-UDDtO0P"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
              <span className="font-headline text-lg sm:text-xl font-bold text-white">Why Choose Elite Fitness?</span>
            </div>
          </div>

          {/* Column structure metrics */}
          <div className="w-full md:w-1/2 text-left">
            <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary-fixed mb-8">
              Why Elite Fitness?
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="font-headline text-xl font-bold text-[#8e9379]">01</span>
                <div>
                  <h4 className="font-sans text-sm font-semibold text-white tracking-widest uppercase">CLINICAL DATA</h4>
                  <p className="font-sans text-xs sm:text-sm text-[#c6c6c7] mt-1.5 leading-relaxed">
                    Every performance movement is logged via premium integrated sensor telemetry to optimize muscle recruitment patterns while reducing diagnostic injury risk.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="font-headline text-xl font-bold text-[#8e9379]">02</span>
                <div>
                  <h4 className="font-sans text-sm font-semibold text-white tracking-widest uppercase">EXPERT COACHING</h4>
                  <p className="font-sans text-xs sm:text-sm text-[#c6c6c7] mt-1.5 leading-relaxed">
                    Our team of trainers hold academic degrees in Kinesiology, physiology, or Exercise Science, moving far beyond standard industrial certifications.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="font-headline text-xl font-bold text-[#8e9379]">03</span>
                <div>
                  <h4 className="font-sans text-sm font-semibold text-white tracking-widest uppercase font-bold">ULTRA-PREMIUM RECOVERY</h4>
                  <p className="font-sans text-xs sm:text-sm text-[#c6c6c7] mt-1.5 leading-relaxed">
                    Full access premium cryotherapy, far-infrared dry saunas, and targeted compression recovery cells is completely included across our principal membership tiers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

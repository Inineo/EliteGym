"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Flame,
  Code,
  FileCode
} from 'lucide-react';
import Script from 'next/script';

import { PaymentMethod, PaymentState, OrderSummary, UserProfile, BankType } from '@/types';
import CheckoutScreen from '@/components/checkout/CheckoutScreen';
import VirtualAccountPay from '@/components/checkout/VirtualAccountPay';
import QrisPay from '@/components/checkout/QrisPay';
import BankTransferPay from '@/components/checkout/BankTransferPay';
import SuccessScreen from '@/components/checkout/SuccessScreen';
import { supabase } from '@/lib/supabase';

const PLAN_DETAILS: Record<string, { name: string; description: string; price: number }> = {
  'Single': {
    name: 'Single Package',
    description: '24/7 Elite Digital Access + Biometric Precision Assessment',
    price: 1200000,
  },
  'Couple': {
    name: 'Couple Package',
    description: 'Full Clinic Access for Two + Shared Nutrition Consult Desk',
    price: 2000000,
  },
  'Team 4': {
    name: 'Team 4 Package',
    description: 'Corporate Tier Access Perks + Group Performance Lab entry',
    price: 3500000,
  },
  'Single PT (Session)': {
    name: 'Single PT Package',
    description: '1-on-1 Precision Focus + Custom Diagnostics Blueprint',
    price: 850000,
  },
  'Couple PT (Session)': {
    name: 'Couple PT Package',
    description: 'Dual Coach Performance Sync + Competitive Diagnostic Tracking',
    price: 1400000,
  },
  'Team PT (Session)': {
    name: 'Team PT Package',
    description: 'Up to 4 Active Participants + High-Intensity Circuit Lab',
    price: 2400000,
  }
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') || 'Single';
  
  // Find selected plan details
  const selectedPlan = PLAN_DETAILS[planParam] || PLAN_DETAILS['Single'];

  // Main checkout state
  const [paymentState, setPaymentState] = useState<PaymentState>('checkout');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bank_transfer');
  const [selectedBank, setSelectedBank] = useState<BankType>('bca');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Package order calculations
  const [summary, setSummary] = useState<OrderSummary>({
    packageName: selectedPlan.name,
    description: selectedPlan.description,
    monthlyRate: selectedPlan.price,
    registrationFee: 0,
    taxPercentage: 10,
    totalDue: Math.round(selectedPlan.price * 1.1), // Price + 10% tax
  });

  const [showGuide, setShowGuide] = useState(true);

  // Load user session
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  // Sync summary if URL params change
  useEffect(() => {
    setSummary({
      packageName: selectedPlan.name,
      description: selectedPlan.description,
      monthlyRate: selectedPlan.price,
      registrationFee: 0,
      taxPercentage: 10,
      totalDue: Math.round(selectedPlan.price * 1.1),
    });
  }, [planParam, selectedPlan]);

  // Apply Coupon code
  const handleApplyPromo = (code: string) => {
    const discount = 200000; // Rp 200.000 discount
    const subtotal = summary.monthlyRate;
    const tax = (subtotal * summary.taxPercentage) / 100;
    const newTotal = (subtotal + tax + summary.registrationFee) - discount;

    setSummary(prev => ({
      ...prev,
      totalDue: newTotal,
      appliedPromo: {
        code,
        discountValue: discount
      }
    }));
  };

  // Panggil endpoint backend /api/checkout untuk trigger SNAP Midtrans
  const handleConfirmPayment = async () => {
    if (!currentUser) {
      alert('Please log in or register to complete the purchase.');
      router.push('/?tab=login');
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: planParam,
          userId: currentUser.id,
          userEmail: currentUser.email,
          userName: currentUser.user_metadata?.name,
          userPhone: currentUser.user_metadata?.phone,
          promoCode: summary.appliedPromo?.code
        })
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      // @ts-ignore
      if (window.snap) {
        // @ts-ignore
        window.snap.pay(data.snapToken, {
          onSuccess: function (result: any) {
            handlePaymentSuccess();
          },
          onPending: function (result: any) {
            alert("Payment is pending. Please complete the payment.");
            router.push('/?tab=profile');
          },
          onError: function (result: any) {
            alert("Payment failed.");
          },
          onClose: function () {
            alert("Payment window closed.");
          }
        });
      } else {
        // Fallback simulator jika keys belum lengkap dimasukkan
        console.warn('Midtrans Snap not loaded. Redirecting to manual simulation...');
        if (selectedMethod === 'bank_transfer') {
          setPaymentState('processing_bank');
        } else if (selectedMethod === 'virtual_account') {
          setPaymentState('processing_va');
        } else {
          setPaymentState('processing_qris');
        }
      }
    } catch (error) {
      console.error('Failed to process payment:', error);
      alert('Internal checkout error occurred.');
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentState('success');
  };

  const handleResetCheckout = () => {
    setPaymentState('checkout');
    setSummary({
      packageName: selectedPlan.name,
      description: selectedPlan.description,
      monthlyRate: selectedPlan.price,
      registrationFee: 0,
      taxPercentage: 10,
      totalDue: Math.round(selectedPlan.price * 1.1),
    });
  };

  const handleFinishCheckout = () => {
    router.push('/?tab=profile');
  };

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] flex flex-col font-sans transition-colors duration-300">
      {/* Script SNAP Midtrans */}
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />

      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-primary-fixed/10 border-b border-primary-fixed/20 z-50 sticky top-0"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-4xl text-left">
                <div className="flex items-center gap-2">
                  <span className="inline-flex bg-primary-fixed font-bold text-black text-[10px] px-2 py-0.5 rounded tracking-wider uppercase font-heading">
                    Next.js Active Route
                  </span>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-primary-fixed" /> Halaman Pembayaran Terintegrasi
                  </h4>
                </div>
                <p className="text-xs text-slate-350 leading-relaxed">
                  Halaman ini terintegrasi dengan backend Midtrans SNAP dan mencatat transaksi ke database Supabase secara aman.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-slate-300">
                    <FileCode className="w-3.5 h-3.5 text-primary-fixed" /> Paket Aktif: {selectedPlan.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button 
                  onClick={() => setShowGuide(false)}
                  className="text-xs text-slate-500 hover:text-white transition-colors p-2 font-bold"
                >
                  Sembunyikan
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-surface-dark border-b border-white/5 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            onClick={() => router.push('/')} 
            className="flex items-center gap-2 hover:opacity-90 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-black shadow-lg shadow-primary-fixed/15">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-heading text-lg font-extrabold tracking-tighter text-primary-fixed uppercase">
              Elite Fitness
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400 tracking-wide uppercase">
            <span onClick={() => router.push('/?tab=home')} className="hover:text-white transition-colors cursor-pointer">Home</span>
            <span onClick={() => router.push('/?tab=packages')} className="text-primary-fixed border-b-2 border-primary-fixed pb-1 tracking-wider cursor-pointer">Packages</span>
            <span onClick={() => router.push('/?tab=profile')} className="hover:text-white transition-colors cursor-pointer">Profile</span>
          </nav>

          <button 
            onClick={() => router.push('/')}
            className="bg-primary-fixed text-black px-5 py-2 rounded-full font-heading text-xs font-black tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-sm shadow-primary-fixed/10 cursor-pointer"
          >
            Kembali
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        {paymentState !== 'success' && (
          <div className="mb-10 max-w-xl text-left space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary-fixed/10 text-primary-fixed p-2 rounded-xl text-xs font-bold flex items-center gap-1">
                <Flame className="w-4 h-4 animate-bounce" /> PEMBAYARAN PREMIUM
              </span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider font-mono">
                Langkah 2 dari 2 • Checkout Terproteksi
              </span>
            </div>

            {paymentState === 'checkout' ? (
              <div className="space-y-1">
                <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
                  Selesaikan Pembayaran
                </h1>
                <p className="text-sm md:text-base text-slate-400 leading-normal max-w-md">
                  Pilih opsi pembayaran terbaik Anda untuk mengaktifkan kode keanggotaan Elite secara lunas.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-none flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-ping" />
                  Menunggu Transfer Masuk
                </h1>
                <p className="text-sm text-slate-400 leading-normal max-w-md">
                  Selesaikan instruksi agar akses pintu digital fingerprint dan kelas personal coach otomatis terbuka lunas.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="transition-all duration-300">
          {paymentState === 'checkout' && (
            <CheckoutScreen 
              orderSummary={summary}
              selectedMethod={selectedMethod}
              onChangeMethod={(method) => setSelectedMethod(method)}
              selectedBank={selectedBank}
              onChangeBank={(bank) => setSelectedBank(bank as BankType)}
              onApplyPromo={handleApplyPromo}
              onConfirmPayment={handleConfirmPayment}
            />
          )}

          {paymentState === 'processing_va' && (
            <VirtualAccountPay 
              totalAmount={summary.totalDue}
              selectedBank={selectedBank}
              onBack={handleResetCheckout}
              onSuccess={handlePaymentSuccess}
            />
          )}

          {paymentState === 'processing_qris' && (
            <QrisPay 
              totalAmount={summary.totalDue}
              onBack={handleResetCheckout}
              onSuccess={handlePaymentSuccess}
            />
          )}

          {paymentState === 'processing_bank' && (
            <BankTransferPay 
              totalAmount={summary.totalDue}
              selectedBank={selectedBank}
              onBack={handleResetCheckout}
              onSuccess={handlePaymentSuccess}
            />
          )}

          {paymentState === 'success' && (
            <SuccessScreen 
              packageName={summary.packageName}
              totalPaid={summary.totalDue}
              onReset={handleFinishCheckout}
            />
          )}
        </div>
      </main>

      <footer className="bg-surface-dark border-t border-white/5 py-10 mt-12 text-xs text-slate-500 shadow-inner">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1.5">
            <span className="font-heading text-base font-extrabold text-white tracking-tighter uppercase block">
              Elite Fitness Global
            </span>
            <p className="text-[11px] text-slate-600 font-mono">
              © {new Date().getFullYear()} ELITE FITNESS. CLINICAL PRECISION HIGH-PERFORMANCE WORKSPACE.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <a href="#" className="hover:text-primary-fixed transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-fixed transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-fixed transition-colors">Contact Us</a>
            <a href="#" className="hover:text-primary-fixed transition-colors">Support Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-[#e2e2e2] flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-t-2 border-primary-fixed border-solid animate-spin mx-auto"></div>
          <p className="text-sm font-semibold tracking-wider text-slate-400">LOADING CHECKOUT...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

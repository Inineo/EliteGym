import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, ArrowRight, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';

interface QrisPayProps {
  totalAmount: number;
  onBack: () => void;
  onSuccess: () => void;
}

export default function QrisPay({
  totalAmount,
  onBack,
  onSuccess
}: QrisPayProps) {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [verifying, setVerifying] = useState(false);

  // 15-minute Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tombol Back */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-brand-neon transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Pilihan Checkout
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Kolom Kiri: QR Code & Animations */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            {/* Soft Ambient Neon Background Glow */}
            <div className="absolute -inset-4 bg-brand-neon/10 rounded-2xl blur-3xl group-hover:bg-brand-neon/15 transition-all duration-500" />
            
            {/* QR Framework Frame */}
            <div className="relative bg-surface-lvl4 border border-white/10 p-5 rounded-2xl shadow-[0_0_40px_rgba(195,244,0,0.1)] overflow-hidden">
              {/* Outer Scanning Laser Line */}
              <div className="absolute inset-x-0 h-[2.5px] bg-brand-neon shadow-[0_0_12px_#c3f400] z-20 animate-scan pointer-events-none" />
              
              {/* Actual QR Mockup Graphic */}
              <div className="w-64 h-64 md:w-80 md:h-80 bg-white p-4 rounded-xl relative">
                {/* QR Code Matrix Vector Simulation */}
                <div className="w-full h-full border-4 border-slate-900 bg-slate-900 rounded flex flex-col justify-between p-2 relative overflow-hidden">
                  {/* QR Core Grid Layout */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:8px_8px] opacity-100" />
                  
                  {/* QR Position Anchors at 3 Corners */}
                  {/* Top-Left */}
                  <div className="w-14 h-14 border-4 border-white bg-slate-900 rounded-lg absolute top-3 left-3 z-10 p-1">
                    <div className="w-full h-full bg-white rounded-sm" />
                  </div>
                  {/* Top-Right */}
                  <div className="w-14 h-14 border-4 border-white bg-slate-900 rounded-lg absolute top-3 right-3 z-10 p-1">
                    <div className="w-full h-full bg-white rounded-sm" />
                  </div>
                  {/* Bottom-Left */}
                  <div className="w-14 h-14 border-4 border-white bg-slate-900 rounded-lg absolute bottom-3 left-3 z-10 p-1">
                    <div className="w-full h-full bg-white rounded-sm" />
                  </div>
                  {/* Custom Center Logo Shield for Brand Legitimacy */}
                  <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900 border border-white/20 rounded-xl flex items-center justify-center z-25 text-[7px] text-brand-neon font-bold font-heading text-center leading-none px-1 tracking-tighter shadow-xl">
                    ELITE<br/>GYM
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">Pindai QR ini melalui aplikasi pembayaran pilihan Anda</p>
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-500 font-heading tracking-widest pt-2">
              <span className="hover:text-brand-neon transition-colors">GOPAY</span>
              <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
              <span className="hover:text-brand-neon transition-colors">OVO</span>
              <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
              <span className="hover:text-brand-neon transition-colors">SHOPEEPAY</span>
              <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
              <span className="hover:text-brand-neon transition-colors">DANA</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Paket & Timer */}
        <div className="flex flex-col space-y-6 text-center md:text-left">
          <div className="space-y-3">
            <span className="inline-flex bg-brand-neon/10 text-brand-neon px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wider">
              Pembayaran Tertunda
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-white leading-tight">
              Elite Membership Keanggotaan
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto md:mx-0">
              Kunci akses pusat kebugaran dengan teknologi tercanggih dan program bimbingan klinis luhur. Mulai kebugaran Anda sekarang.
            </p>
          </div>

          <div className="bg-surface-lvl3 rounded-2xl p-6 border border-white/5 space-y-4">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-xs font-bold text-slate-400 block tracking-widest uppercase">
                TOTAL PEMBAYARAN
              </span>
              <span className="font-heading text-2xl font-bold text-white">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex items-center gap-4 text-left">
              <div className="bg-surface-lvl2 p-3 rounded-xl border border-white/5">
                <Clock className="w-6 h-6 text-brand-neon" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  SESI QR KANVAS EXPIRED
                </span>
                <span className="h-6 font-heading text-xl font-bold text-slate-200 block font-mono">
                  {formatCountdown(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleVerify}
              disabled={verifying}
              className="w-full bg-brand-neon text-dark-bg font-extrabold py-4 rounded-xl text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-neon/20 cursor-pointer disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> VERIFIKASI TRANSAKSI...
                </>
              ) : (
                <>
                  Saya Sudah Membayar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button 
              onClick={onBack}
              className="w-full bg-transparent text-slate-400 border border-white/5 hover:border-white/10 hover:bg-slate-900 py-4 rounded-xl text-sm font-semibold transition-all"
            >
              Batalkan Transaksi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

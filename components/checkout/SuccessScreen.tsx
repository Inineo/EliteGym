import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Download, ArrowRight, Sparkles } from 'lucide-react';

interface SuccessScreenProps {
  packageName: string;
  totalPaid: number;
  onReset: () => void;
}

export default function SuccessScreen({
  packageName,
  totalPaid,
  onReset
}: SuccessScreenProps) {
  const [memberId, setMemberId] = useState('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState('');

  useEffect(() => {
    // Generate simulated Member ID: EF-2026-XXXX to align with current year 2026!
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    setMemberId(`EF-2026-${randomDigits}`);

    // Format current date: e.g. Oct 24, 2024, but with 2026 standard
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    const today = new Date();
    setCurrentDateFormatted(today.toLocaleDateString('id-ID', options));
  }, []);

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-10 relative">
      {/* Soft Ambient Neon Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-brand-neon/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full text-center z-10 space-y-8">
        {/* Animated Checkmark Group */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-4 inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-neon/15 border-2 border-brand-neon shadow-[0_0_35px_rgba(195,244,0,0.3)]"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CheckCircle2 className="w-14 h-14 text-brand-neon stroke-[1.5]" />
          </motion.div>
        </motion.div>

        {/* Hero Title */}
        <div className="space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-3xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Selamat Datang di Elite!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base text-slate-400 max-w-md mx-auto leading-relaxed"
          >
            Pembayaran Anda berhasil diproses sepenuhnya. Perjalanan transformasi fisik Anda dimulai hari ini.
          </motion.p>
        </div>

        {/* Bento Plan Information summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-lvl3 border border-white/5 rounded-2xl p-6 md:p-8 text-left grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              PAKET AKTIF
            </span>
            <span className="font-heading text-xl md:text-2xl font-extrabold text-white mt-1">
              {packageName}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              ID ANGGOTA (MEMBER CODE)
            </span>
            <span className="font-heading text-xl md:text-2xl font-extrabold text-brand-neon tracking-tight mt-1">
              {memberId}
            </span>
          </div>

          <div className="md:col-span-2 pt-6 mt-2 border-t border-white/5 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Tanggal Transaksi</span>
              <span className="text-slate-200 font-mono font-medium">{currentDateFormatted}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-450">Total Nominal Terbayar</span>
              <span className="text-brand-neon font-bold font-mono text-sm">
                Rp {totalPaid.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTA Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
        >
          <button 
            onClick={onReset}
            className="w-full sm:w-auto bg-brand-neon text-dark-bg font-semibold text-sm px-8 py-3.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-brand-neon/20 cursor-pointer"
          >
            Kembali ke Simulasi
          </button>
          
          <button 
            onClick={() => {
              alert('Kuitansi digital PDF sedang diunduh ke perangkat Anda. Silakan periksa folder unduhan.');
            }}
            className="w-full sm:w-auto border border-white/5 text-white bg-transparent hover:bg-slate-900 active:scale-95 transition-all py-3.5 px-8 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-brand-neon" />
            Unduh Kuitansi PDF
          </button>
        </motion.div>
      </div>

      {/* Decorative Asymmetric Image Card */}
      <div className="hidden lg:block absolute right-[-80px] top-[15%] opacity-15 pointer-events-none transform rotate-6 z-0">
        <div className="w-80 h-96 rounded-2xl overflow-hidden grayscale border border-white/10 [filter:contrast(1.2)]">
          {/* Aesthetic moody gym layout svg or representation */}
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 p-6 flex flex-col justify-end space-y-4">
            <Sparkles className="w-10 h-10 text-brand-neon animate-pulse" />
            <div>
              <p className="font-heading text-lg font-bold text-white tracking-tight">PRECISION COACHING</p>
              <p className="text-xs text-slate-500">Elite Fitness, Jakarta Indonesia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

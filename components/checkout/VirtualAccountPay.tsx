import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Copy, 
  Check, 
  Wallet, 
  ChevronRight, 
  Info, 
  Smartphone, 
  Laptop, 
  CreditCard,
  ArrowLeft,
  Loader2
} from 'lucide-react';

import { BankType } from '@/types';

interface VirtualAccountPayProps {
  totalAmount: number;
  selectedBank: BankType;
  onBack: () => void;
  onSuccess: () => void;
}

export default function VirtualAccountPay({
  totalAmount,
  selectedBank,
  onBack,
  onSuccess
}: VirtualAccountPayProps) {
  const [copied, setCopied] = useState(false);
  const [timerLeft, setTimerLeft] = useState(24 * 3600 - 15); // Almost 24 hours
  const [checking, setChecking] = useState(false);
  const checkTimerRef = useRef<number | null>(null);

  const VA_NUMBERS: Record<BankType, string> = {
    bca: '9012 3344 5566 7788',
    mandiri: '8901 2233 4455 6677',
    bni: '8801 1122 3344 5566',
    bri: '7701 0011 2233 4455'
  };

  const BANK_NAMES: Record<BankType, string> = {
    bca: 'BCA Virtual Account',
    mandiri: 'Mandiri Virtual Account',
    bni: 'BNI Virtual Account',
    bri: 'BRI Virtual Account'
  };

  const vaNumber = VA_NUMBERS[selectedBank] || VA_NUMBERS.bca;
  const bankName = BANK_NAMES[selectedBank] || BANK_NAMES.bca;

  // Timer Countdown loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format seconds to hh:mm:ss
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCopy = () => {
    // Strip empty spaces to copy clean numeric value
    const cleanNum = vaNumber.replace(/\s+/g, '');
    navigator.clipboard.writeText(cleanNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckStatus = () => {
    setChecking(true);
    // Simulate API delay check with premium spinner
    checkTimerRef.current = window.setTimeout(() => {
      setChecking(false);
      onSuccess();
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (checkTimerRef.current) {
        clearTimeout(checkTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Tombol Back */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-brand-neon transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Pilihan Checkout
      </button>

      {/* Header Infomasi */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
            Informasi Pembayaran
          </h1>
          <p className="text-sm text-slate-400">
            Selesaikan transaksi keanggotaan Anda menggunakan akun virtual di bawah ini.
          </p>
        </div>

        {/* countdown timer */}
        <div className="bg-surface-lvl3 px-4 py-3 rounded-xl border border-white/5 flex items-center gap-3">
          <Clock className="w-5 h-5 text-brand-neon" />
          <div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Kedaluwarsa Dalam
            </div>
            <div className="text-lg font-bold text-brand-neon tracking-wider font-mono mt-1">
              {formatTime(timerLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* VA Main Card - OLED Clean Glass Look */}
      <div className="bg-surface-lvl3 border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Abstract Background Wallet Glow */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-brand-neon">
          <Wallet className="w-32 h-32" />
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <span className="text-xs font-bold text-slate-400 block tracking-widest uppercase mb-1">
              NOMOR VIRTUAL ACCOUNT ({bankName.toUpperCase()})
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-brand-neon tracking-widest break-all">
                {vaNumber}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-4 border-t border-white/5">
            <div>
              <span className="text-xs font-bold text-slate-400 block tracking-widest uppercase mb-1">
                JUMLAH TRANSFER
              </span>
              <div className="font-heading text-2xl md:text-3xl font-extrabold text-white">
                Rp {totalAmount.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="flex justify-start md:justify-end">
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 w-full md:w-auto justify-center ${
                  copied 
                  ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.3)]' 
                  : 'bg-brand-neon text-dark-bg hover:scale-105 active:scale-95 shadow-lg shadow-brand-neon/15 cursor-pointer'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" /> SALINAN BERHASIL
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> SALIN KODE VA
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion / Tab Guide Bento Instructions */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-white tracking-wide">
          Panduan Instruksi Pembayaran
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ATM */}
          <div className="bg-surface-lvl3 border border-white/5 p-5 rounded-2xl hover:border-brand-neon/30 transition-all group">
            <div className="w-10 h-10 bg-surface-lvl2 rounded-xl flex items-center justify-center mb-4 text-brand-neon group-hover:bg-brand-neon group-hover:text-dark-bg transition-all">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm mb-3">ATM Banking</h4>
            <ol className="text-xs font-medium text-slate-400 space-y-2 list-decimal list-inside leading-relaxed opacity-90">
              <li>Masukkan kartu &amp; pin Anda</li>
              <li>Pilih menu <strong className="text-white">Transaksi Lainnya</strong></li>
              <li>Pilih menu <strong className="text-white">Transfer</strong></li>
              <li>Pilih <strong className="text-white">Ke Rekening Virtual Account</strong></li>
              <li>Masukkan nomor VA di atas</li>
              <li>Periksa detail tagihan, lalu bayar</li>
            </ol>
          </div>

          {/* Smartphone */}
          <div className="bg-surface-lvl3 border border-white/5 p-5 rounded-2xl hover:border-brand-neon/30 transition-all group">
            <div className="w-10 h-10 bg-surface-lvl2 rounded-xl flex items-center justify-center mb-4 text-brand-neon group-hover:bg-brand-neon group-hover:text-dark-bg transition-all">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm mb-3">Mobile Banking</h4>
            <ol className="text-xs font-medium text-slate-400 space-y-2 list-decimal list-inside leading-relaxed opacity-90">
              <li>Masuk ke aplikasi bank Anda</li>
              <li>Pilih menu <strong className="text-white">Transfer</strong></li>
              <li>Pilih <strong className="text-white">Virtual Account</strong></li>
              <li>Kirim ke nomor VA di atas</li>
              <li>Isi nominal persis Rp {totalAmount.toLocaleString('id-ID')}</li>
              <li>Masukkan PIN m-banking &amp; bayar</li>
            </ol>
          </div>

          {/* Laptop */}
          <div className="bg-surface-lvl3 border border-white/5 p-5 rounded-2xl hover:border-brand-neon/30 transition-all group">
            <div className="w-10 h-10 bg-surface-lvl2 rounded-xl flex items-center justify-center mb-4 text-brand-neon group-hover:bg-brand-neon group-hover:text-dark-bg transition-all">
              <Laptop className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm mb-3">Internet Banking</h4>
            <ol className="text-xs font-medium text-slate-400 space-y-2 list-decimal list-inside leading-relaxed opacity-90">
              <li>Login ke portal internet banking</li>
              <li>Pilih <strong className="text-white">Pemberitahuan/Transfer</strong></li>
              <li>Tulis tujuan <strong className="text-white">Kode VA</strong></li>
              <li>Masukkan nomor VA di atas</li>
              <li>Autorisasi transaksi pembayaran</li>
              <li>Simpan bukti bayar digital</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Simulated Validation Confirmation Footer */}
      <div className="bg-surface-lvl1 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 pt-6">
        <div className="flex items-start gap-2.5 max-w-lg">
          <Info className="w-5 h-5 text-brand-neon shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-normal">
            Sudah melakukan transfer? Server kami akan melakukan pencocokan status instan. Klik tombol di kanan untuk memverifikasi lunas secara langsung.
          </p>
        </div>
        <button 
          onClick={handleCheckStatus}
          disabled={checking}
          className="w-full md:w-auto min-w-[200px] border border-brand-neon text-brand-neon bg-transparent hover:bg-brand-neon/5 active:scale-95 py-3.5 px-6 rounded-full font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          {checking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> VERIFIKASI PEMBAYARAN...
            </>
          ) : (
            'CEK STATUS PEMBAYARAN'
          )}
        </button>
      </div>
    </div>
  );
}

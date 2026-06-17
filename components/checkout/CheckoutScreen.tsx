import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react'; import {
  Building2,
  Smartphone,
  QrCode,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  Percent
} from 'lucide-react';
import { PaymentMethod, OrderSummary, BankType } from '../../types';

interface CheckoutScreenProps {
  orderSummary: OrderSummary;
  selectedMethod: PaymentMethod;
  onChangeMethod: (method: PaymentMethod) => void;
  selectedBank: string;
  onChangeBank: (bank: string) => void;
  onApplyPromo: (code: string) => void;
  onConfirmPayment: () => void;
}

export default function CheckoutScreen({
  orderSummary,
  selectedMethod,
  onChangeMethod,
  selectedBank,
  onChangeBank,
  onApplyPromo,
  onConfirmPayment
}: CheckoutScreenProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const renderBankSelector = () => {
    const banks: { id: BankType; label: string; desc: string }[] = [
      { id: 'bca', label: 'BCA', desc: 'Transfer BCA' },
      { id: 'mandiri', label: 'Mandiri', desc: 'Transfer Mandiri' },
      { id: 'bni', label: 'BNI', desc: 'Transfer BNI' },
      { id: 'bri', label: 'BRI', desc: 'Transfer BRI' }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-3 p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 relative z-20"
      >
        <p className="text-xs font-semibold text-slate-450">Pilih Bank Transfer:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {banks.map((bank) => {
            const isSelected = selectedBank === bank.id;
            return (
              <button
                key={bank.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onChangeBank(bank.id);
                }}
                className={`py-3 px-2 rounded-lg text-center transition-all cursor-pointer font-heading text-xs font-bold border flex flex-col items-center justify-center gap-1 ${isSelected
                    ? 'border-brand-neon bg-brand-neon/5 text-brand-neon shadow-[0_0_15px_rgba(195,244,0,0.15)]'
                    : 'border-white/5 bg-surface-lvl4 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
              >
                <span>{bank.label}</span>
                <span className="text-[9px] font-normal opacity-60">{bank.id.toUpperCase()} Direct</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      setPromoError('Silakan masukkan kode promo.');
      setPromoSuccess('');
      return;
    }

    // Simulate promo code validation
    const code = promoInput.trim().toUpperCase();
    if (code === 'ELITE2024' || code === 'ELITEFIT') {
      onApplyPromo(code);
      setPromoSuccess(`Promo ${code} berhasil dipasang!`);
      setPromoError('');
    } else {
      setPromoError('Kode promo tidak valid atau sudah kedaluwarsa.');
      setPromoSuccess('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Kolom Kiri: Pembayaran & Sekuritas */}
      <div className="lg:col-span-8 space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-lvl3 rounded-2xl p-6 border border-white/5 outline-none"
        >
          <h2 className="font-heading text-xl font-bold mb-6 text-white tracking-tight">
            Metode Pembayaran
          </h2>

          <div className="space-y-4">
            {/* Bank Transfer */}
            <div className="space-y-2">
              <label className="relative block cursor-pointer">
                <input
                  type="radio"
                  name="payment_method"
                  className="sr-only peer"
                  checked={selectedMethod === 'bank_transfer'}
                  onChange={() => onChangeMethod('bank_transfer')}
                />
                <motion.div
                  animate={{
                    borderColor: selectedMethod === 'bank_transfer' ? '#c3f400' : 'rgba(255, 255, 255, 0.05)',
                    backgroundColor: selectedMethod === 'bank_transfer' ? 'rgba(195, 244, 0, 0.02)' : 'rgba(30, 30, 30, 0.4)',
                    boxShadow: selectedMethod === 'bank_transfer'
                      ? '0 0 25px rgba(195, 244, 0, 0.25), inset 0 0 15px rgba(195, 244, 0, 0.05)'
                      : '0 0 0px rgba(195, 244, 0, 0)'
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-5 border rounded-xl transition-all duration-300 hover:border-brand-neon/30 relative overflow-hidden"
                >
                  {/* Shimmer Light Sweep on Selection */}
                  {selectedMethod === 'bank_transfer' && (
                    <motion.div
                      initial={{ x: '-150%' }}
                      animate={{ x: '150%' }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none skew-x-12"
                    />
                  )}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 flex items-center justify-center bg-surface-lvl4 rounded-xl text-brand-neon">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-heading text-base font-bold text-white">Bank Transfer</p>
                      <p className="text-xs text-slate-400">Verifikasi manual oleh tim Elite (Maksimal 2 jam)</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors relative z-10"
                    style={{
                      borderColor: selectedMethod === 'bank_transfer' ? '#c3f400' : '#475569'
                    }}
                  >
                    {selectedMethod === 'bank_transfer' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-neon" />
                    )}
                  </div>
                </motion.div>
              </label>
              <AnimatePresence>
                {selectedMethod === 'bank_transfer' && renderBankSelector()}
              </AnimatePresence>
            </div>

            {/* Virtual Account */}
            <div className="space-y-2">
              <label className="relative block cursor-pointer">
                <input
                  type="radio"
                  name="payment_method"
                  className="sr-only peer"
                  checked={selectedMethod === 'virtual_account'}
                  onChange={() => onChangeMethod('virtual_account')}
                />
                <motion.div
                  animate={{
                    borderColor: selectedMethod === 'virtual_account' ? '#c3f400' : 'rgba(255, 255, 255, 0.05)',
                    backgroundColor: selectedMethod === 'virtual_account' ? 'rgba(195, 244, 0, 0.02)' : 'rgba(30, 30, 30, 0.4)',
                    boxShadow: selectedMethod === 'virtual_account'
                      ? '0 0 25px rgba(195, 244, 0, 0.25), inset 0 0 15px rgba(195, 244, 0, 0.05)'
                      : '0 0 0px rgba(195, 244, 0, 0)'
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-5 border rounded-xl transition-all duration-300 hover:border-brand-neon/30 relative overflow-hidden"
                >
                  {/* Shimmer Light Sweep on Selection */}
                  {selectedMethod === 'virtual_account' && (
                    <motion.div
                      initial={{ x: '-150%' }}
                      animate={{ x: '150%' }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none skew-x-12"
                    />
                  )}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 flex items-center justify-center bg-surface-lvl4 rounded-xl text-brand-neon">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-heading text-base font-bold text-white">Virtual Account (VA)</p>
                      <p className="text-xs text-slate-400">Verifikasi otomatis instan via Multi-Bank</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors relative z-10"
                    style={{
                      borderColor: selectedMethod === 'virtual_account' ? '#c3f400' : '#475569'
                    }}
                  >
                    {selectedMethod === 'virtual_account' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-neon" />
                    )}
                  </div>
                </motion.div>
              </label>
              <AnimatePresence>
                {selectedMethod === 'virtual_account' && renderBankSelector()}
              </AnimatePresence>
            </div>

            {/* QRIS */}
            <label className="relative block cursor-pointer">
              <input
                type="radio"
                name="payment_method"
                className="sr-only peer"
                checked={selectedMethod === 'qris'}
                onChange={() => onChangeMethod('qris')}
              />
              <motion.div
                animate={{
                  borderColor: selectedMethod === 'qris' ? '#c3f400' : 'rgba(255, 255, 255, 0.05)',
                  backgroundColor: selectedMethod === 'qris' ? 'rgba(195, 244, 0, 0.02)' : 'rgba(30, 30, 30, 0.4)',
                  boxShadow: selectedMethod === 'qris'
                    ? '0 0 25px rgba(195, 244, 0, 0.25), inset 0 0 15px rgba(195, 244, 0, 0.05)'
                    : '0 0 0px rgba(195, 244, 0, 0)'
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-5 border rounded-xl transition-all duration-300 hover:border-brand-neon/30 relative overflow-hidden"
              >
                {/* Shimmer Light Sweep on Selection */}
                {selectedMethod === 'qris' && (
                  <motion.div
                    initial={{ x: '-150%' }}
                    animate={{ x: '150%' }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none skew-x-12"
                  />
                )}
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 flex items-center justify-center bg-surface-lvl4 rounded-xl text-brand-neon">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-heading text-base font-bold text-white">QRIS</p>
                    <p className="text-xs text-slate-400">Scan QR Code instan e-wallet (GoPay, OVO, ShopeePay)</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors relative z-10"
                  style={{
                    borderColor: selectedMethod === 'qris' ? '#c3f400' : '#475569'
                  }}
                >
                  {selectedMethod === 'qris' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-neon" />
                  )}
                </div>
              </motion.div>
            </label>          </div>

          {/* Supported Banks Container */}
          <div className="mt-6 p-4 bg-[#0e0e0e] rounded-xl border border-white/[0.03]">
            <p className="text-xs font-semibold text-brand-neon mb-3 tracking-wider uppercase">
              Supported Payment Systems &amp; Banks
            </p>
            <div className="flex flex-wrap gap-3 items-center opacity-70">
              <span className="px-3 py-1 bg-white/5 border border-white/5 rounded text-xs font-bold text-slate-350 tracking-widest font-mono">BCA</span>
              <span className="px-3 py-1 bg-white/5 border border-white/5 rounded text-xs font-bold text-slate-350 tracking-widest font-mono">MANDIRI</span>
              <span className="px-3 py-1 bg-white/5 border border-white/5 rounded text-xs font-bold text-slate-350 tracking-widest font-mono">BNI</span>
              <span className="px-3 py-1 bg-white/5 border border-white/5 rounded text-xs font-bold text-slate-350 tracking-widest font-mono">GOPAY</span>
              <span className="px-3 py-1 bg-white/5 border border-white/5 rounded text-xs font-bold text-slate-350 tracking-widest font-mono">OVO</span>
            </div>
          </div>
        </motion.section>

        {/* Secure Message */}
        <div className="flex items-center gap-2 px-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-brand-neon" />
          <span className="text-xs font-medium">Pembayaran Terenkripsi Aman 256-bit SSL</span>
        </div>
      </div>

      {/* Kolom Kanan: Summary & Action */}
      <div className="lg:col-span-4 space-y-4">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface-lvl3 rounded-2xl p-6 border border-white/5 relative overflow-hidden"
        >
          {/* Subtle Ambient Radial Light */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-brand-neon/10 rounded-full blur-3xl pointer-events-none" />

          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
            Ringkasan Pesanan
          </span>
          <div className="flex flex-col gap-1 mb-6">
            <h3 className="font-heading text-2xl font-bold text-white leading-tight">
              {orderSummary.packageName}
            </h3>
            <p className="text-sm text-slate-400">{orderSummary.description}</p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/5 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Tarif Bulanan</span>
              <span className="text-white font-medium">Rp {orderSummary.monthlyRate.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Biaya Registrasi</span>
              <span className="text-brand-neon font-medium uppercase font-heading text-xs">
                {orderSummary.registrationFee === 0 ? 'GRATIS' : `Rp ${orderSummary.registrationFee.toLocaleString('id-ID')}`}
              </span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Pajak (10%)</span>
              <span className="text-white font-medium">
                Rp {((orderSummary.monthlyRate * orderSummary.taxPercentage) / 100).toLocaleString('id-ID')}
              </span>
            </div>

            {orderSummary.appliedPromo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex justify-between text-brand-neon bg-brand-neon/5 p-2 rounded-lg border border-brand-neon/20 items-center text-xs"
              >
                <span className="flex items-center gap-1 font-semibold">
                  <Percent className="w-3.5 h-3.5" /> Promo ({orderSummary.appliedPromo.code})
                </span>
                <span className="font-bold flex items-center">
                  - Rp {orderSummary.appliedPromo.discountValue.toLocaleString('id-ID')}
                </span>
              </motion.div>
            )}

            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <span className="font-semibold text-slate-300">Total Pembayaran</span>
              <span className="font-heading text-2xl font-bold text-brand-neon tracking-tight">
                Rp {orderSummary.totalDue.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Promo Code Card */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-lvl3 rounded-2xl p-5 border border-white/5 space-y-3"
        >
          <label className="text-xs font-semibold text-slate-400 block tracking-wider uppercase">
            Kode Promo
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="bg-surface-lvl2 border border-white/10 rounded-xl px-4 py-3 w-full text-white text-sm outline-none focus:border-brand-neon transition-colors uppercase placeholder:text-slate-600 font-medium"
              placeholder="Contoh: ELITE2024"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
            />
            <button
              onClick={handleApplyPromo}
              className="bg-surface-lvl4 border border-white/5 px-4 text-sm font-semibold rounded-xl text-white hover:bg-slate-800 hover:text-brand-neon transition-colors"
            >
              Pasang
            </button>
          </div>

          {promoError && (
            <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-medium bg-red-500/10 p-2 rounded-lg border border-red-500/20">
              {promoError}
            </p>
          )}

          {promoSuccess && (
            <p className="text-xs text-brand-neon flex items-center gap-1 mt-1 font-semibold bg-brand-neon/5 p-2 rounded-lg border border-brand-neon/20">
              <TrendingDown className="w-4 h-4 shrink-0" /> {promoSuccess}
            </p>
          )}

          <p className="text-[10px] text-slate-500 leading-relaxed">
            *Dapatkan diskon khusus pendaftaran member baru menggunakan kode <strong>ELITE2024</strong>.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.button
          onClick={onConfirmPayment}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-primary-fixed text-[#131313] font-heading text-base py-4 rounded-2xl font-extrabold shadow-[0_0_35px_rgba(195,244,0,0.15)] hover:shadow-[0_0_50px_rgba(195,244,0,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          Konfirmasi Pembayaran
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </motion.button>

        <p className="text-center text-[10px] text-slate-500 px-4 leading-normal">
          Dengan mengeklik &ldquo;Konfirmasi Pembayaran&rdquo;, Anda menyetujui seluruh{' '}
          <a href="#" className="underline hover:text-brand-neon transition-colors">Syarat Ketentuan</a> serta{' '}
          <a href="#" className="underline hover:text-brand-neon transition-colors">Kebijakan Privasi</a> ELITE FITNESS.
        </p>
      </div>
    </div>
  );
}

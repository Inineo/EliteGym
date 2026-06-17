import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Clock, 
  Copy, 
  Check, 
  Building2, 
  FileText, 
  UploadCloud, 
  Info, 
  HelpCircle, 
  Lock,
  ArrowRight,
  ShieldAlert,
  Plus
} from 'lucide-react';
import { BankType } from '@/types';

interface BankTransferPayProps {
  totalAmount: number;
  selectedBank: BankType;
  onBack: () => void;
  onSuccess: () => void;
}

export default function BankTransferPay({
  totalAmount,
  selectedBank,
  onBack,
  onSuccess
}: BankTransferPayProps) {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const BANK_INFOS: Record<BankType, { name: string; accountNumber: string; holder: string }> = {
    bca: {
      name: 'Bank Central Asia (BCA)',
      accountNumber: '8829-0012-9938',
      holder: 'ELITE FITNESS GLOBAL'
    },
    mandiri: {
      name: 'Bank Mandiri',
      accountNumber: '132-00-129938-4',
      holder: 'ELITE FITNESS GLOBAL'
    },
    bni: {
      name: 'Bank Negara Indonesia (BNI)',
      accountNumber: '0882-9012-99',
      holder: 'ELITE FITNESS GLOBAL'
    },
    bri: {
      name: 'Bank Rakyat Indonesia (BRI)',
      accountNumber: '0012-01-9938-50-3',
      holder: 'ELITE FITNESS GLOBAL'
    }
  };

  const bankDetails = BANK_INFOS[selectedBank] || BANK_INFOS.bca;

  const handleCopy = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

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
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
          Transfer Bank Manual
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Selesaikan langganan Anda dengan mentransfer ke rekening resmi kami di bawah ini. Harap transfer dengan jumlah nominal presisi untuk verifikasi instan otomatis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Detil Rekening & Alur Protokol (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Total Amount Card */}
          <div className="bg-surface-lvl3 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                TOTAL NOMINAL HARUS TRANSFER
              </span>
              <div className="font-heading text-2xl md:text-3xl font-extrabold text-brand-neon tracking-tight">
                Rp {totalAmount.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="bg-surface-lvl2 border border-white/5 px-4 py-3 rounded-xl flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-neon" />
              <span className="text-xs font-bold text-slate-350 font-mono tracking-wider">
                Expired: 23 jam 59 menit
              </span>
            </div>
          </div>

          {/* Account Detail Block */}
          <div className="bg-surface-lvl3 border border-white/5 p-6 rounded-2xl">
            <h2 className="font-heading text-base font-bold text-white mb-5 flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-brand-neon" />
              Informasi Rekening Tujuan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-white/5">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  NAMA BANK
                </span>
                <p className="font-heading text-base font-bold text-white">{bankDetails.name}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  NOMOR REKENING
                </span>
                <div className="flex items-center gap-2">
                  <p className="font-heading text-lg font-bold text-brand-neon tracking-widest">
                    {bankDetails.accountNumber}
                  </p>
                  <button 
                    onClick={handleCopy}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                    title="Salin nomor rekening"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500 stroke-[3]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  NAMA REKENING
                </span>
                <p className="font-heading text-base font-bold text-white uppercase tracking-tight">{bankDetails.holder}</p>
              </div>
            </div>
          </div>

          {/* Action Protocol Checklist */}
          <div className="bg-surface-lvl3 border border-white/5 p-6 rounded-2xl relative overflow-hidden">
            <h2 className="font-heading text-base font-bold text-white mb-6">
              Protokol Transaksi Pembayaran
            </h2>
            
            <div className="space-y-6 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-white/5">
              {/* Step 1 */}
              <div className="flex gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-brand-neon text-dark-bg flex items-center justify-center font-extrabold font-heading text-sm shrink-0 z-10 shadow-lg shadow-brand-neon/10">
                  1
                </div>
                <div className="pt-1.5">
                  <h4 className="text-sm font-bold text-white">Transfer Sesuai Nominal</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Gunakan m-Banking atau ATM untuk mentransfer senilai <strong className="text-brand-neon">Rp {totalAmount.toLocaleString('id-ID')}</strong> ke rekening {bankDetails.name} di atas.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-brand-neon text-dark-bg flex items-center justify-center font-extrabold font-heading text-sm shrink-0 z-10 shadow-lg shadow-brand-neon/10">
                  2
                </div>
                <div className="pt-1.5">
                  <h4 className="text-sm font-bold text-slate-200">Ambil Tangkapan Layar (Screenshot) / Bukti Resi</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Simpan salinan konfirmasi transfer lunas berformat Gambar (PNG, JPG) atau dokumen PDF berukuran maksimal 5MB.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-brand-neon text-dark-bg flex items-center justify-center font-extrabold font-heading text-sm shrink-0 z-10 shadow-lg shadow-brand-neon/10">
                  3
                </div>
                <div className="pt-1.5">
                  <h4 className="text-sm font-bold text-slate-200">Unggah Ke Panel Verifikasi Dan Konfirmasi</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Masukkan bukti di panel sebelah kanan, dan klik konfirmasi transfer. Tim klinis admin kami akan menyetujui langsung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Uploader & Submit Verification (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface-lvl3 border border-white/5 rounded-2xl p-6 flex flex-col">
            <h3 className="font-heading text-base font-bold text-white mb-2">Verifikasi Pembayaran</h3>
            <p className="text-xs text-slate-400 leading-normal mb-5">
              Kirim softcopy resi transfer bank digital Anda untuk dipindai oleh algoritma audit kami.
            </p>

            {/* Drag & Drop Area */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex-grow border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all duration-300 minimum-h-[180px] group ${
                isDragOver 
                  ? 'border-brand-neon bg-brand-neon/5 scale-[1.02]' 
                  : selectedFile 
                    ? 'border-green-500 bg-green-500/5' 
                    : 'border-white/10 hover:border-brand-neon/30 bg-surface-lvl2'
              }`}
            >
              <UploadCloud className={`w-10 h-10 mb-3 transition-colors ${
                selectedFile ? 'text-green-500' : 'text-slate-500 group-hover:text-brand-neon'
              }`} />
              
              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-green-400 truncate max-w-[210px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Berhasil terpilih
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Seret berkas ke sini atau <span className="text-brand-neon underline cursor-pointer">telusuri</span>
                  </p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">
                    Format berekstensi PDF, JPG, PNG (Maks 5MB)
                  </p>
                </div>
              )}
              
              <input 
                type="file" 
                id="file-receipt-uploader" 
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden" 
              />
            </div>

            <div className="mt-5 space-y-2">
              <button 
                onClick={() => document.getElementById('file-receipt-uploader')?.click()}
                className="w-full bg-surface-lvl4 border border-white/5 py-3 rounded-xl text-xs font-semibold text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Pilih Berkas Manual
              </button>
              
              <button 
                onClick={() => {
                  if (!selectedFile) {
                    alert('Harap unggah atau pilih bukti pembayaran terlebih dahulu!');
                    return;
                  }
                  onSuccess();
                }}
                className={`w-full font-heading text-sm py-3.5 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  selectedFile 
                    ? 'bg-brand-neon text-dark-bg shadow-lg shadow-brand-neon/20 hover:brightness-110 active:scale-95' 
                    : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                }`}
              >
                Konfirmasi Transfer
                <Check className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Support Desk */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">
                  Ada masalah? <a href="#" className="text-brand-neon hover:underline font-semibold">Hubungi Elite Support</a>
                </span>
              </div>
            </div>
          </div>

          {/* Secure SSL disclaimer Card */}
          <div className="bg-surface-lvl2 border border-white/5 p-4 rounded-xl flex items-start gap-2">
            <Lock className="w-5 h-5 text-brand-neon shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-normal">
              Transaksi dilindungi sistem enkripsi mutakhir dan diawasi ketat oleh departemen keuangan Elite Fitness Global.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

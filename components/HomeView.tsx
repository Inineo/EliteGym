"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { 
  Dumbbell, 
  Award, 
  Clock, 
  CreditCard, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  Share2, 
  Users, 
  Star, 
  Check, 
  Send 
} from 'lucide-react';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  isLoggedIn: boolean;
}

export default function HomeView({ setCurrentTab, isLoggedIn }: HomeViewProps) {
  // Contact form submission state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successCounter, setSuccessCounter] = useState(15420); // interactive stats booster

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitted(false);
      alert("Message sent with clinical precision! Our team will reach out to you shortly.");
    }, 1200);
  };

  // Fun helper to boost trainer success count
  const boostCounter = () => {
    setSuccessCounter(prev => prev + 1);
  };

  return (
    <div className="animate-fade-in text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden">
        {/* Darkened background image flow with gradient overlay */}
        <div className="absolute inset-0 z-0 select-none">
          <div className="absolute inset-0 bg-black/55 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-black/30 z-20"></div>
          <img 
            alt="Elite Fitness Main Gym Floor" 
            className="w-full h-full object-cover grayscale brightness-40 saturate-125" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoLt8_pB2Fhj_Stb-ljYBS7gy0qfSXBcpoPmCXfUJdDPBN-w0azES_edkPjqfzSA7rJLN06M4hDp4FZ8zwdV09e5wHlwXYC_dgHSXFQlFCDMRhYyld3wkRwRaW0QR7ELWJIjwgb2Y8_-6-m9RYkPRWTe_JyaGoZrusI0gx1L_jZXEBh5XJyHM1RtqQS-VSZ7u8SkPMPmKkk_71DO85lJZU6_5bUiftB5JTHGvAJFTFhi_7RpE1BbRfW0w9RukMctjgJ1zSkuJZRxm6"
          />
        </div>

        {/* Hero content */}
        <div className="relative z-30 px-6 md:px-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-primary-fixed text-xs font-semibold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping"></span>
            <span>CLINICAL SPECIFICATION EST. 2018</span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight select-none">
            Transform Your Body,<br/>
            <span className="text-primary-fixed">Transform Your Life</span>
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#c6c6c7] mb-10 max-w-2xl mx-auto leading-relaxed">
            Achieve peak performance with clinical precision. Our elite-level facilities and expert methodology are designed for those who demand excellence in every single rep.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              id="hero-join-now"
              onClick={() => setCurrentTab(isLoggedIn ? 'packages' : 'register')}
              className="bg-primary-fixed text-[#161e00] text-sm md:text-base font-bold py-4 px-10 rounded-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto shadow-[0_4px_25px_rgba(195,244,0,0.3)] cursor-pointer"
            >
              Join Now
            </button>
            <button 
              id="hero-explore"
              onClick={() => setCurrentTab('packages')}
              className="border border-[#333333] bg-black/40 hover:bg-white/10 text-white text-sm md:text-base font-bold py-4 px-10 rounded-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
            >
              Explore Membership
            </button>
          </div>
        </div>

        {/* Scroll indicator banner */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 opacity-60">
          <span className="text-[10px] tracking-widest uppercase font-semibold text-[#c6c6c7]">Scroll To Explore</span>
          <ArrowRight className="w-4 h-4 text-primary-fixed rotate-90 animate-bounce" />
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto" id="features">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-white mb-3">The Elite Standard</h2>
          <div className="w-20 h-1 bg-primary-fixed mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large Feature Block (60%) */}
          <div className="md:col-span-7 bg-[#1a1a1a] rounded-2xl p-8 flex flex-col justify-between border border-[#333333]/60 hover:border-primary-fixed/50 transition-all group overflow-hidden">
            <div>
              <Dumbbell className="text-primary-fixed w-12 h-12 mb-6" style={{ filter: 'drop-shadow(0 0 10px rgba(195,244,0,0.15))' }} />
              <h3 className="font-headline text-2xl font-bold text-white mb-4">Modern Equipment</h3>
              <p className="text-[#c6c6c7] font-sans text-sm md:text-base leading-relaxed">
                Experience world-class technology with our biomechanically optimized training systems. From pneumatic resistance to AI-driven cardio, we provide the tools for surgical precision in your workouts.
              </p>
            </div>
            <div className="mt-8 relative overflow-hidden rounded-xl">
              <img 
                className="w-full h-48 object-cover opacity-75 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                alt="Chrome adjustable dumbbells neatly arranged" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh2Kp_43NxEXlZ9s9fpLyhuC-iRvOEwxdt5RuJI_0Ybiz2QHksHnNmo_2FvUYhjGXrG_bTNT4mCPWACRhVz5vZZqexdOG62WnpOy0TG-KaB5wfO1iZ7nFJG7D7ZDqUm2YLXQ-An-IrPqJd_mBu6MYX5SHtIv7o2zYi-yAzfdZzM1XitX6fUeFuPs9dHFAWvKqCQpGTHvoXbERmhiaFE97mMwstIFowG4dmF3xBcxt97fDo8RlEcZuvCBLCkOTfHr6888wm3rjOKhbG"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-4">
                <span className="text-xs uppercase tracking-widest text-[#c6c6c7]">Bio-Optimized Load Control</span>
              </div>
            </div>
          </div>

          {/* Vertical Feature Block (40%) */}
          <div className="md:col-span-5 bg-[#1a1a1a] rounded-2xl p-8 border border-[#333333]/60 hover:border-primary-fixed/50 transition-all flex flex-col justify-between">
            <div>
              <Award className="text-primary-fixed w-12 h-12 mb-6 animate-pulse" />
              <h3 className="font-headline text-2xl font-bold text-white mb-4">Certified Trainers</h3>
              <p className="text-[#c6c6c7] font-sans text-sm md:text-base leading-relaxed mb-6">
                Our coaches are performance scientists. Every single trainer holds elite kinesiology certifications, specializing in metabolic optimization and functional hyper-performance.
              </p>
            </div>
            <div className="bg-[#131313] p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-fixed/15 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary-fixed" />
                </div>
                <span className="text-xs font-semibold text-white">Clinical Assessment Included</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-fixed/15 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary-fixed" />
                </div>
                <span className="text-xs font-semibold text-white">DNA-Based Nutrition Blueprints</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-fixed/15 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary-fixed" />
                </div>
                <span className="text-xs font-semibold text-white">24/7 Counselor Hotlines</span>
              </div>
            </div>
          </div>

          {/* Small Feature 1 */}
          <div className="md:col-span-4 bg-[#1a1a1a] rounded-2xl p-8 border border-[#333333]/60 hover:border-primary-fixed/50 transition-all">
            <Clock className="text-primary-fixed w-10 h-10 mb-6" />
            <h3 className="font-headline text-xl font-bold text-white mb-2">Flexible Schedule</h3>
            <p className="text-[#c6c6c7] font-sans text-sm leading-relaxed">
              24/7 biometric and digital QR lock-pass ensures the gym is ready whenever your peak cognitive and raw efficiency hits.
            </p>
          </div>

          {/* Small Feature 2 with Interactive Tier selection */}
          <div className="md:col-span-8 bg-[#1a1a1a] rounded-2xl p-8 border border-[#333333]/60 hover:border-primary-fixed/50 transition-all flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1">
              <CreditCard className="text-primary-fixed w-10 h-10 mb-6" />
              <h3 className="font-headline text-xl font-bold text-white mb-2">Affordable Membership</h3>
              <p className="text-[#c6c6c7] font-sans text-sm leading-relaxed">
                Premium performance shouldn&apos;t be an unreachable luxury. Tiered access plans precisely calibrated for every stage of your physical trajectory.
              </p>
            </div>
            <div className="flex gap-4 p-2 bg-[#131313] rounded-2xl border border-white/5">
              <div 
                onClick={() => setCurrentTab('packages')}
                className="w-14 h-14 rounded-xl border border-primary-fixed/20 hover:border-primary-fixed flex items-center justify-center hover:bg-primary-fixed/10 transition-all cursor-pointer group"
              >
                <span className="text-primary-fixed font-bold text-sm tracking-tighter group-hover:scale-110 transition-transform">$</span>
              </div>
              <div 
                onClick={() => setCurrentTab('packages')}
                className="w-14 h-14 rounded-xl border border-primary-fixed/20 hover:border-primary-fixed flex items-center justify-center hover:bg-primary-fixed/10 transition-all cursor-pointer group"
              >
                <span className="text-primary-fixed font-bold text-sm tracking-tighter group-hover:scale-110 transition-transform">$$</span>
              </div>
              <div 
                onClick={() => setCurrentTab('packages')}
                className="w-14 h-14 rounded-xl border border-primary-fixed/20 hover:border-primary-fixed flex items-center justify-center hover:bg-primary-fixed/10 transition-all cursor-pointer group"
              >
                <span className="text-primary-fixed font-bold text-sm tracking-tighter group-hover:scale-110 transition-transform">$$$</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redefining Physical Limits (About section) */}
      <section className="bg-[#0e0e0e] py-24 select-none">
        <div className="px-6 md:px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <span className="text-primary-fixed font-sans text-xs md:text-sm font-semibold tracking-widest uppercase mb-2 block">
              ESTABLISHED 2018
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Redefining Physical Limits
            </h2>
            <p className="text-[#c6c6c7] font-sans text-base md:text-lg mb-6 leading-relaxed">
              At Elite Fitness, we believe that the human body is the ultimate piece of technology. Our mission is to provide the clinical environment, data-driven methodology, and high-intensity atmosphere required to unlock its absolute capability.
            </p>
            <p className="text-[#c6c6c7] font-sans text-sm md:text-base mb-8 leading-relaxed">
              Founded by leading athletic clinicians and kinesiology performance specialists, we have completely stripped away the redundant noise of traditional commercial gyms. No clutter. No unnecessary visual elements. Pure, focused drive.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div 
                onClick={boostCounter}
                className="cursor-pointer group select-none bg-[#1a1a1a]/40 hover:bg-[#1a1a1a] p-4 rounded-xl border border-[#333333]/30 transition-all"
              >
                <div className="font-headline text-3xl font-extrabold text-primary-fixed group-hover:scale-105 transition-transform">
                  {(successCounter / 1000).toFixed(1)}k+
                </div>
                <div className="text-xs text-[#c6c6c7]/80 uppercase font-semibold tracking-wider mt-1">
                  SUCCESS STORIES (Click to root)
                </div>
              </div>
              <div className="bg-[#1a1a1a]/40 p-4 rounded-xl border border-[#333333]/30">
                <div className="font-headline text-3xl font-extrabold text-primary-fixed">
                  12
                </div>
                <div className="text-xs text-[#c6c6c7]/80 uppercase font-semibold tracking-wider mt-1">
                  SPECIALIST CLINIC LABS
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <div className="absolute -inset-2 bg-primary-fixed/10 blur-xl opacity-40 rounded-2xl"></div>
            <div className="relative rounded-2xl overflow-hidden border border-[#333333]/50">
              <img 
                className="w-full h-[400px] md:h-[480px] object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700" 
                alt="Determined female athlete on high-performance dark gym setup" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBngXoTyu3D7oeKU8bleQK5A3izi-TruMgdG7oe_W_pGhbSNDbofTENY3tQzRsdj86wfrwwok_au-w7eX42T8ow2WNzwiSo2d3SXGQ0d1nIjO2joeL5UmJx2_EvbF-zdRrGs98Fa12KcTch9S9kYcBwj3BGdtMKvIeYR_JxwU2HRmiPnrfYJioQIkJRe-DBRXvqibvQUgm5tY1xt1jWnEKXNv93mmgPJ0B1kByU8yDPfWZOu0gZZYqmbTP_q9ODixVDkDaMvMXfoTUn animate-fade-in"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/5 rounded-xl p-4">
                <span className="font-headline text-sm font-semibold block text-white">Biometric telemetry analysis</span>
                <span className="text-xs text-[#c6c6c7] mt-0.5 block">Every movement monitored with clinical precision sensors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Contact & Campus Map Section */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto" id="contact">
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col md:flex-row border border-[#333333]/80">
          {/* Contact form (Left) */}
          <div className="flex-1 p-8 md:p-12">
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-white mb-8">Get In Touch</h2>
            
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#c6c6c7] block uppercase tracking-wider" htmlFor="name">
                  Full Name
                </label>
                <input 
                  type="text" 
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe" 
                  className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed/50 rounded-lg py-3 px-4 text-sm text-white placeholder:text-[#555555] outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#c6c6c7] block uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@elitefitness.com" 
                  className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed/50 rounded-lg py-3 px-4 text-sm text-white placeholder:text-[#555555] outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#c6c6c7] block uppercase tracking-wider" htmlFor="message">
                  How can we help?
                </label>
                <textarea 
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="I am interested in the Couple Membership plan..." 
                  className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed/50 rounded-lg py-3 px-4 text-sm text-white placeholder:text-[#555555] outline-none transition-all"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className={`w-full bg-primary-fixed text-[#161e00] font-sans font-semibold py-3.5 rounded-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${isSubmitted ? 'opacity-70' : ''}`}
                disabled={isSubmitted}
              >
                <span>{isSubmitted ? 'Transmitting...' : 'Send Message'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-[#333333]/40">
              <p className="text-xs font-semibold text-[#c6c6c7] uppercase tracking-widest mb-4">Follow the Progress</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-[#333333] flex items-center justify-center hover:bg-primary-fixed hover:text-black hover:border-primary-fixed transition-all">
                  <Share2 className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-[#333333] flex items-center justify-center hover:bg-primary-fixed hover:text-black hover:border-primary-fixed transition-all">
                  <Users className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-[#333333] flex items-center justify-center hover:bg-primary-fixed hover:text-black hover:border-primary-fixed transition-all">
                  <Star className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Interactive simulated vector map (Right) */}
          <div className="flex-1 min-h-[350px] relative bg-[#131111]/80 overflow-hidden flex flex-col justify-between p-8 md:p-12 text-left border-t md:border-t-0 md:border-l border-[#333333]/80">
            <div>
              <span className="text-primary-fixed font-sans text-xs font-bold tracking-widest uppercase block mb-1">
                OUR CAMPUS
              </span>
              <h3 className="font-headline text-white text-xl font-bold mb-4">Location Headquarters</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary-fixed w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-sm font-semibold text-white">Main Headquarters</span>
                    <span className="block text-xs text-[#c6c6c7] mt-0.5">1212 Performance Plaza, Carbon District, London, UK</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-primary-fixed w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-sm font-semibold text-white">Direct Line</span>
                    <span className="block text-xs text-[#c6c6c7] mt-0.5">+44 20 7946 0123</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-primary-fixed w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-sm font-semibold text-white">Email Desk</span>
                    <span className="block text-xs text-[#c6c6c7] mt-0.5">hq@elitefitness.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Futuristic vector map layout */}
            <div className="h-44 w-full bg-neutral-950/80 border border-white/5 rounded-xl mt-6 relative overflow-hidden flex items-center justify-center">
              {/* Animated Radar Pulse */}
              <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 relative">
                <span className="absolute flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-primary-fixed/40"></span>
                </span>
                <span className="absolute top-1.5 left-1.5 w-3 h-3 rounded-full bg-primary-fixed border border-black shadow-md"></span>
              </div>

              {/* Grid outline lines for abstract map */}
              <div className="absolute inset-0 opacity-15 pointer-events-none select-none">
                <div className="absolute left-1/10 top-0 bottom-0 w-px bg-white"></div>
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white"></div>
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white"></div>
                <div className="absolute top-1/4 left-0 right-0 h-px bg-white"></div>
                <div className="absolute top-12 left-0 right-0 h-px bg-white"></div>
                <div className="absolute top-3/4 left-0 right-0 h-px bg-white"></div>
                {/* Diagonal paths */}
                <div className="absolute w-[140%] h-px bg-primary-fixed top-12 -left-1/4 rotate-12"></div>
                <div className="absolute w-[140%] h-px bg-white top-24 -left-1/4 -rotate-[22deg]"></div>
              </div>

              <div className="absolute bottom-3 right-3 bg-black/80 border border-white/5 rounded px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest text-[#c6c6c7]">
                UK Campus (LIVE)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

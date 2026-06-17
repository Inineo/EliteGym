interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  return (
    <footer className="bg-[#0e0e0e] border-t border-[#333333]/40 mt-20" id="app-footer">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-8 w-full max-w-7xl mx-auto gap-6 text-center md:text-left">
        {/* Left text */}
        <div>
          <div
            onClick={() => setCurrentTab('home')}
            className="font-headline text-lg md:text-xl font-bold text-primary-fixed mb-1 cursor-pointer uppercase tracking-tighter"
          >
            ELITE FITNESS
          </div>
          <p className="font-sans text-xs md:text-sm text-[#c6c6c7]">
            © 2026 ELITE FITNESS. CLINICAL PRECISION.
          </p>
        </div>

        {/* Right navigation links */}
        <div className="flex flex-wrap justify-center gap-6 font-sans text-xs md:text-sm">
          <a href="#" className="text-[#c6c6c7] hover:text-primary-fixed transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-[#c6c6c7] hover:text-primary-fixed transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-[#c6c6c7] hover:text-primary-fixed transition-colors">
            Contact Us
          </a>
          <a href="#" className="text-[#c6c6c7] hover:text-primary-fixed transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Mail, MapPin, Phone, User, BookOpen, 
  LogIn, Calendar, Gift, Music, ShieldCheck, Zap, Award, MessageCircle 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-white mt-12 sm:mt-16 overflow-visible">
      
      {/* Top transition wave divider separating page content from footer */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-[99%] pointer-events-none">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[40px] sm:h-[60px] text-white fill-current"
        >
          <path d="M0,60 C150,118 450,2 600,60 C750,118 1050,2 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* 1. Main Footer Links Area (Pure White Background) */}
      <div className="bg-white text-[#665558] py-8 md:py-10 border-b border-rosePrimary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            
            {/* Brand Logo & Description */}
            <div className="md:col-span-4 space-y-4">
              <Link to="/" className="flex items-center space-x-2 group">
                <span className="font-heading font-black text-4xl tracking-tight text-[#4A0512] group-hover:text-rosePrimary transition-colors">
                  AnKa
                </span>
                <Heart className="w-7.5 h-7.5 text-rosePrimary fill-rosePrimary animate-pulse mt-0.5" />
              </Link>
              <p className="text-base sm:text-lg text-[#7A696C] font-light leading-relaxed max-w-sm">
                We design unforgettable moments and private digital scrapbooks for the people you love.
              </p>
              <div className="pt-2">
                <span className="font-serif italic text-rosePrimary text-2xl tracking-wide block">
                  Pyaar ke pal, hamesha ke liye <span className="inline-block font-sans not-italic text-sm ml-0.5">♡</span>
                </span>
              </div>
            </div>

            {/* Occasions Column */}
            <div className="md:col-span-3 space-y-2">
              <h3 className="text-[#4A0512] font-heading font-bold text-base sm:text-lg uppercase tracking-wider">
                Occasions
              </h3>
              <div className="flex items-center space-x-2 mt-0.5 mb-3 text-rosePrimary/60">
                <Heart className="w-4 h-4 fill-rosePrimary/20 text-rosePrimary" />
                <div className="h-[1px] w-6 bg-rosePrimary/20"></div>
              </div>
              <ul className="space-y-3 text-base sm:text-lg text-[#665558] font-light">
                <li>
                  <Link to="/surprises/valentines" className="hover:text-rosePrimary transition-colors flex items-center space-x-2.5">
                    <Heart className="w-4.5 h-4.5 text-rosePrimary/70" />
                    <span>Valentine's Specials</span>
                  </Link>
                </li>
                <li>
                  <Link to="/surprises/birthday" className="hover:text-rosePrimary transition-colors flex items-center space-x-2.5">
                    <Gift className="w-4.5 h-4.5 text-rosePrimary/70" />
                    <span>Birthday Surprise</span>
                  </Link>
                </li>
                <li>
                  <Link to="/surprises/wedding-invitation" className="hover:text-rosePrimary transition-colors flex items-center space-x-2.5">
                    <Award className="w-4.5 h-4.5 text-rosePrimary/70" />
                    <span>Wedding Invitation</span>
                  </Link>
                </li>
                <li className="pt-1">
                  <Link to="/surprises" className="hover:text-rosePrimary transition-all flex items-center space-x-1 font-bold text-rosePrimary text-sm sm:text-base uppercase tracking-wider">
                    <span>Browse All Occasions</span>
                    <span>&rarr;</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company & Support Column */}
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-[#4A0512] font-heading font-bold text-base sm:text-lg uppercase tracking-wider">
                Company
              </h3>
              <div className="flex items-center space-x-2 mt-0.5 mb-3 text-rosePrimary/60">
                <Heart className="w-4 h-4 fill-rosePrimary/20 text-rosePrimary" />
                <div className="h-[1px] w-6 bg-rosePrimary/20"></div>
              </div>
              <ul className="space-y-3 text-base sm:text-lg text-[#665558] font-light">
                <li>
                  <Link to="/about" className="hover:text-rosePrimary transition-colors flex items-center space-x-2.5">
                    <User className="w-4.5 h-4.5 text-rosePrimary/70" />
                    <span>About Us</span>
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-rosePrimary transition-colors flex items-center space-x-2.5">
                    <BookOpen className="w-4.5 h-4.5 text-rosePrimary/70" />
                    <span>Our Story</span>
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-rosePrimary transition-colors flex items-center space-x-2.5">
                    <LogIn className="w-4.5 h-4.5 text-rosePrimary/70" />
                    <span>Client Login</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect Column */}
            <div className="md:col-span-3 space-y-3">
              <h3 className="text-[#4A0512] font-heading font-bold text-base sm:text-lg uppercase tracking-wider">
                Connect
              </h3>
              <div className="flex items-center space-x-2 mt-0.5 mb-3 text-rosePrimary/60">
                <Heart className="w-4 h-4 fill-rosePrimary/20 text-rosePrimary" />
                <div className="h-[1px] w-6 bg-rosePrimary/20"></div>
              </div>
              <div className="space-y-3.5 text-base sm:text-lg text-[#665558] font-light">
                <p className="flex items-center space-x-2.5">
                  <Mail className="w-4.5 h-4.5 text-rosePrimary/70 shrink-0" />
                  <a href="mailto:akashroy73826@gmail.com" className="hover:text-rosePrimary text-[#4A0512] font-medium transition-colors break-all">akashroy73826@gmail.com</a>
                </p>
                <p className="flex items-center space-x-2.5">
                  <MapPin className="w-4.5 h-4.5 text-rosePrimary/70 shrink-0" />
                  <span className="text-[#4A0512] font-medium">Guwahati, Assam, India</span>
                </p>
              </div>

              {/* Social Round Badges */}
              <div className="flex space-x-2.5 pt-2">
                <a 
                  href="https://www.instagram.com/_akash__roy_143/" 
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 bg-rosePrimary/10 hover:bg-rosePrimary text-rosePrimary hover:text-white rounded-full transition-all flex items-center justify-center cursor-pointer hover:scale-105 border border-rosePrimary/5" 
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-11 h-11 bg-rosePrimary/10 hover:bg-rosePrimary text-rosePrimary hover:text-white rounded-full transition-all flex items-center justify-center cursor-pointer hover:scale-105 border border-rosePrimary/5" 
                  aria-label="Youtube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-11 h-11 bg-rosePrimary/10 hover:bg-rosePrimary text-rosePrimary hover:text-white rounded-full transition-all flex items-center justify-center cursor-pointer hover:scale-105 border border-rosePrimary/5" 
                  aria-label="Pinterest"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.993-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.794 23.778 10.879 24 12 24c6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="mailto:akashroy73826@gmail.com" 
                  className="w-11 h-11 bg-rosePrimary/10 hover:bg-rosePrimary text-rosePrimary hover:text-white rounded-full transition-all flex items-center justify-center cursor-pointer hover:scale-105 border border-rosePrimary/5" 
                  aria-label="Mail"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>

              {/* WhatsApp Floating Banner Card */}
              <div className="bg-[#FFFDFD] border border-rose-100 rounded-2xl p-4.5 flex items-start space-x-3.5 mt-4 shadow-sm">
                <div className="w-11 h-11 rounded-full bg-rose-50 text-rosePrimary flex items-center justify-center shrink-0 border border-rose-100">
                  <MessageCircle className="w-5.5 h-5.5 fill-rosePrimary/10 text-rosePrimary" />
                </div>
                <div className="text-left space-y-1 flex-grow">
                  <h4 className="font-heading font-bold text-sm text-[#4A0512] leading-tight">Need help planning?</h4>
                  <a
                    href="https://wa.me/916206466429?text=Hi! I have a question about setting up a surprise website on AnKa."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-rosePrimary hover:text-[#4A0512] transition-colors"
                  >
                    <span>WhatsApp Us</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Trust Badges Row (Pure White Background) */}
      <div className="bg-white border-t border-rosePrimary/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Secure & Private */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-rosePrimary/10 text-rosePrimary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-[#4A0512]">Secure & Private</h4>
                <p className="text-sm text-[#7A696C] mt-0.5">Your data is 100% safe</p>
              </div>
            </div>

            {/* Instant Delivery */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-rosePrimary/10 text-rosePrimary flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-[#4A0512]">Instant Delivery</h4>
                <p className="text-sm text-[#7A696C] mt-0.5">Get it in just few minutes</p>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-rosePrimary/10 text-rosePrimary flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-[#4A0512]">24/7 Support</h4>
                <p className="text-sm text-[#7A696C] mt-0.5">We're always here for you</p>
              </div>
            </div>

            {/* 100% Satisfaction */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-rosePrimary/10 text-rosePrimary flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-[#4A0512]">100% Satisfaction</h4>
                <p className="text-sm text-[#7A696C] mt-0.5">Loved by hundreds of couples</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Transition Wave Divider separating trust badges from bottom wine footer */}
      <div className="w-full overflow-hidden leading-[0] bg-white">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[40px] sm:h-[60px] text-[#4A0512] fill-current"
        >
          <path d="M0,60 C150,118 450,2 600,60 C750,118 1050,2 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* 4. Bottom Footer (Dark Wine Background) */}
      <div className="bg-[#4A0512] text-rose-100/70 pb-6 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-4 left-1/4 animate-bounce text-white text-lg">❤️</div>
          <div className="absolute bottom-6 right-1/4 animate-pulse text-white text-sm">❤️</div>
          <div className="absolute top-1/2 right-10 animate-bounce text-white text-xs">❤️</div>
          <div className="absolute bottom-2 left-10 animate-pulse text-white text-sm">❤️</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center text-white font-accent text-3xl sm:text-4xl text-rose-100 tracking-wide">
            <span>Made with</span>
            <Heart className="w-7 h-7 mx-2 text-rosePrimary fill-rosePrimary animate-pulse shrink-0" />
            <span>for unforgettable moments.</span>
          </div>

          {/* Elegant Horizontal Flourish */}
          <div className="flex items-center justify-center my-3 opacity-60">
            <svg className="w-64 h-6 text-rosePrimary fill-none stroke-current" viewBox="0 0 200 24" strokeWidth="1">
              <path d="M10,12 C40,12 60,6 80,12 C90,15 95,9 100,12 C105,9 110,15 120,12 C140,6 160,12 190,12" />
              <path d="M98,12 A2,2 0 1,1 102,12 A2,2 0 1,1 98,12" fill="currentColor" />
            </svg>
          </div>

          <p className="text-base text-rose-200/40 font-light">&copy; {new Date().getFullYear()} AnKa Surprise Websites. All rights reserved.</p>
        </div>
      </div>

    </footer>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.service';
import { Heart, Sparkles, MessageCircle, Send, Star, ChevronLeft, ChevronRight, Check, Play, AlertCircle } from 'lucide-react';
import FloatingParticles from '../components/animations/FloatingParticles';
import AutoSlideImage from '../components/AutoSlideImage';
import { updateSEO } from '../utils/seo';

export default function Home() {
  const [occasions, setOccasions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);

  const placeholderOccasions = [
    {
      name: "Birthday Surprise",
      slug: "birthday",
      desc: "Apne birthday girl/boy ko dijiye ek stunning digital surprise page full of memories.",
      funnyTag: "Pure Dhoom Dhadaka Vibe 🎂",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Virtual Date Surprise",
      slug: "virtual-date",
      desc: "Express your love with interactive photos, count up timelines, and letter vibes.",
      funnyTag: "For your 24/7 Overthinker 💘",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Wedding Invitation",
      slug: "wedding-invitation",
      desc: "Interactive RSVP, wedding details, maps, and beautiful background soundtrack.",
      funnyTag: "Shubh Mangal Saavdhan 💍",
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600"
    }
  ];
  const stepsToCreate = [
    { step: '01', title: 'Select Surprise', icon: '🎁', desc: 'Browse through our interactive themes (Birthday, Virtual Date, Valentine\'s Week) and pick the perfect occasion.' },
    { step: '02', title: 'Choose Package', icon: '📦', desc: 'Select between our Basic or Premium tiers based on the features you want to unlock.' },
    { step: '03', title: 'Complete Payment', icon: '💳', desc: 'Finish the checkout process securely to instantly activate your digital surprise workspace.' },
    { step: '04', title: 'Get Credentials', icon: '🔑', desc: 'Receive your secure Settings Editor passcode and Client Live Control Room credentials instantly.' },
    { step: '05', title: 'Login into Customizer Panel', icon: '🖥️', desc: 'Log in to your private editor dashboard using your secure passcode.' },
    { step: '06', title: 'Upload Image & Text', icon: '📸', desc: 'Fill the Polaroid galleries with your photos, add your favorite romantic song loops, and write greetings.' },
    { step: '07', title: 'Generate Live Link', icon: '🚀', desc: 'Compile your customizations to activate your live envelope greeting URL instantly.' },
    { step: '08', title: 'Share It or Download PDF & Courier!', icon: '💌', desc: 'Share the link directly online OR download the premium card PDF containing a QR code, print it, and courier it to your GF! 🌸' }
  ]
  useEffect(() => {
    // Professional SEO Optimization
    updateSEO({
      title: "AnKa Surprises — Interactive Virtual Date, Valentine & Proposal Websites",
      description: "Create beautiful personalized interactive surprise websites (Birthday timeline, custom Valentine week countdown, virtual dates, wedding invitations) or get bespoke web development services.",
      keywords: "surprise website, virtual date website, valentine surprise site, proposal website, wedding invitation website, on-demand web design, shop websites, school web portals, AnKa surprises, Pyaar Ke Pal"
    });

    const fetchCategories = async () => {
      if (!navigator.onLine) {
        setCategoriesError("No Internet Connection 🌐 Please check your connection and try again.");
        setLoadingCategories(false);
        return;
      }
      try {
        const data = await api.getCategories();
        if (data.success && data.categories.length > 0) {
          const funnyTagsMap = {
            'virtual-date': 'For your 24/7 Overthinker 💘',
            'birthday': 'Pure Dhoom Dhadaka Vibe 🎂',
            'wedding-invitation': 'Shubh Mangal Saavdhan 💍',
            'wedding-surprise': 'Dost Ki Shadi Ka Tohfa 🍻',
            'new-year': 'Naye Saal Ki Nayi Ummeed ✨',
            'best-friend': 'Inside Jokes Ka Pitara 🤫',
            'random-day': 'Bina Kisi Wajah... Bas Pyaar Hai 🌸'
          };
          const mapped = data.categories
            .filter(cat => cat.slug !== 'friendship-day')
            .map(cat => {
            let imagesArray = [];
            if (cat.images && cat.images.length > 0) {
              imagesArray = cat.images;
            } else if (cat.imageUrl) {
              imagesArray = [cat.imageUrl];
            } else if (cat.demos && cat.demos.length > 0) {
              imagesArray = cat.demos.map(d => d.imageUrl);
            } else {
              imagesArray = ["https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600"];
            }

            return {
              name: cat.name,
              slug: cat.slug,
              desc: cat.description || '',
              funnyTag: funnyTagsMap[cat.slug] || 'Pyaar Ka Tohfa 🌸',
              images: imagesArray,
              hasDemos: cat.demos && cat.demos.length > 0,
              themeCount: cat.demos ? cat.demos.length : 0,
              startingPrice: cat.tiers && cat.tiers.length > 0 ? cat.tiers[0].price : 999,
              demosList: cat.demos || [],
              isActive: cat.isActive !== false
            };
          });
          setOccasions(mapped);
          setCategoriesError('');
        } else {
          setCategoriesError("Something went wrong on our end. Our Cupid team is looking into it! 💖 Please try again later.");
        }
      } catch (err) {
        console.error('Error loading homepage categories:', err);
        if (!navigator.onLine) {
          setCategoriesError("No Internet Connection 🌐 Please check your connection and try again.");
        } else {
          setCategoriesError("Something went wrong on our end. Our Cupid team is looking into it! 💖 Please try again later.");
        }
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchFAQs = async () => {
      try {
        const data = await api.getFAQs();
        if (data.success && data.faqs) {
          setFaqs(data.faqs);
        }
      } catch (e) {
        console.warn("Failed to load FAQs", e);
      }
    };

    fetchCategories();
    fetchFAQs();
  }, []);

  const getBentoColSpan = (index) => {
    switch (index % 8) {
      case 0:
        return 'md:col-span-8 md:row-span-1 rounded-tl-[50px] rounded-br-[50px]';
      case 1:
        return 'md:col-span-4 md:row-span-1 rounded-tr-[50px] rounded-bl-[50px]';
      case 2:
        return 'md:col-span-4 md:row-span-1 rounded-bl-[50px] rounded-tr-[50px]';
      case 3:
        return 'md:col-span-4 md:row-span-1 rounded-br-[50px] rounded-tl-[50px]';
      case 4:
        return 'md:col-span-4 md:row-span-1 rounded-tl-[50px] rounded-br-[50px]';
      case 5:
        return 'md:col-span-6 md:row-span-1 rounded-tr-[50px] rounded-bl-[50px]';
      case 6:
        return 'md:col-span-6 md:row-span-1 rounded-bl-[50px] rounded-tr-[50px]';
      case 7:
      default:
        return 'md:col-span-12 md:row-span-1 rounded-br-[50px] rounded-tl-[50px]';
    }
  };

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [playVideo, setPlayVideo] = useState(false);

  const testimonials = [
    {
      name: 'Rohan Sharma',
      role: 'Virtual Date Surprise',
      content: 'Maine apni fiancée ko custom timeline surprise gift kiya. Wo hamari photos aur romantic song loop dekhkar ro padi. Bohot pyaara tohfa tha!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
    },
    {
      name: 'Ananya Sen',
      role: 'Birthday Surprise',
      content: 'Best friend ke birthday par wish wall banaya tha. Doston ke messages aur virtual card open clicker ne kamaal kar diya!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative min-h-screen bg-creamBase/20 pt-16 overflow-hidden">

      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-rosePrimary/5 filter blur-3xl -z-10 animate-float-slow"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-blushAccent/10 filter blur-3xl -z-10 animate-float-reverse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-100/30 filter blur-3xl -z-10 animate-float-slow"></div>

      <FloatingParticles />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center space-y-8 relative">
        <div className="flex justify-center animate-fade-in-up">
          <span className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-rosePrimary/10 border border-rosePrimary/20 text-rosePrimary text-xs font-black uppercase tracking-widest">
            <Heart className="w-3.5 h-3.5 fill-rosePrimary text-rosePrimary animate-pulse" />
            <span>Pyaar Ka Yaadgar Tohfa 🎁</span>
          </span>
        </div>

        <h1 className="font-heading font-black text-4xl sm:text-6xl tracking-tight text-wineDeep max-w-5xl mx-auto leading-none animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          Apne Khaas Doston Ke Liye <br />
          <span className="bg-gradient-to-r from-rosePrimary via-wineDeep to-rosePrimary bg-clip-text text-transparent">Surprise Banao</span>
        </h1>

        <p className="font-accent text-2xl text-rosePrimary animate-fade-in-up mt-2" style={{ animationDelay: '0.1s' }}>
          "Kyunki boring gifts dena ek crime hai! 🤫"
        </p>

        <p className="text-base sm:text-lg text-slate-700 max-w-4xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          Kisi bhi normal din ko banao extraordinary! Bhabhi ko manana ho ya bestie ki shadi me roast karna ho, humare premium, interactive surprises unke dil ko seedhe touch karenge. ❤️
        </p>

        <div className="flex justify-center pt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Link
            to="/surprises"
            className="px-12 py-5.5 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-lg font-black uppercase tracking-wider rounded-full shadow-xl shadow-rosePrimary/35 transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl cursor-pointer"
          >
            <span>Surprise Your Partner 🚀</span>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-rosePrimary/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-wineDeep tracking-tight">
            Active Surprise Catalogue 🎀
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-light leading-relaxed">
            Apne loved ones ke liye ek unique digital experience chunein. Sub categories live hain aur directly customizable hain!
          </p>
        </div>

        {loadingCategories ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-rosePrimary/20 border-t-rosePrimary rounded-full animate-spin"></div>
            <p className="text-slate-500 font-light text-sm">Catalogue load ho rahi hai...</p>
          </div>
        ) : categoriesError ? (
          <div className="max-w-xl mx-auto p-6 rounded-3xl bg-rosePrimary/5 border border-rosePrimary/10 text-center space-y-3 animate-fade-in-up">
            <div className="w-12 h-12 bg-rosePrimary/10 text-rosePrimary rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-heading font-black text-wineDeep text-lg">Catalogue Vibe Check</h4>
            <p className="text-xs text-slate-500 font-light leading-relaxed max-w-sm mx-auto">
              {categoriesError}
            </p>
          </div>
        ) : occasions.filter(o => o.isActive !== false).length === 0 ? (
          <div className="text-center py-20 text-slate-500 italic">
            Koi surprise category abhi active nahi hai. Admin panel se toggles active karein!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {occasions.filter(o => o.isActive !== false).map((occ) => (
              <Link
                key={occ.slug}
                to={`/surprises/${occ.slug}`}
                className="group relative bg-white/80 backdrop-blur-md border border-rosePrimary/10 rounded-[32px] overflow-hidden shadow-glass-rose hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Slideshow/Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden w-full shrink-0">
                  <AutoSlideImage images={occ.images} alt={occ.name} />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-sm text-rosePrimary text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-rosePrimary/5 shadow-sm">
                      {occ.funnyTag}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2 text-left">
                    <h3 className="font-heading font-black text-xl text-wineDeep group-hover:text-rosePrimary transition-colors leading-tight">
                      {occ.name}
                    </h3>
                    <p className="text-xs text-slate-650 font-light leading-relaxed line-clamp-3">
                      {occ.desc}
                    </p>
                  </div>

                  {/* Stats / Details */}
                  <div className="flex justify-between items-center pt-4 border-t border-rosePrimary/5 text-xs">
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Starting At</span>
                      <span className="text-sm font-black text-wineDeep">₹{occ.startingPrice}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Available Themes</span>
                      <span className="text-xs font-bold text-rosePrimary">{occ.themeCount} Live Demos</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <div className="w-full py-3 bg-rosePrimary/5 group-hover:bg-rosePrimary group-hover:text-white border border-rosePrimary/10 text-rosePrimary text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center space-x-2">
                      <span>View Details & Demos</span>
                      <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center max-w-3xl mb-12 space-y-4">
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white">
              Watch a Surprise Demo
            </h2>
            <p className="text-slate-400 font-light text-sm sm:text-base">
              Dekhiye kaise hum unki photos, letters, count-down clocks aur audio player se ek khoobsurat surprise taiyar karte hain.
            </p>
          </div>

          <div className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 relative flex items-center justify-center group">
            {playVideo ? (
              <video
                src="https://res.cloudinary.com/db7iiwwg3/video/upload/v1783067139/Screenrecording_20260703_134249_zwsfis.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <img
                  src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200"
                  alt="Video Mockup"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-slate-900/50 group-hover:bg-slate-900/40 transition-colors" />
                <button
                  onClick={() => setPlayVideo(true)}
                  className="z-10 p-6 bg-rosePrimary text-white rounded-full shadow-lg transition-transform duration-300 hover:scale-110 flex items-center justify-center focus:outline-none cursor-pointer"
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </button>
                <div className="absolute bottom-4 left-6 z-10 text-xs text-slate-400 font-mono bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700">
                  Demo Preview - Click to Play
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Active Surprise Demos Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-rosePrimary/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-rosePrimary/10 text-rosePrimary text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-rosePrimary animate-pulse" />
            <span>Interactive surprise Demos</span>
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-wineDeep">Active Surprise Catalog</h2>
          <p className="text-sm text-slate-500 font-light leading-relaxed">
            Choose an interactive surprise package, customize its design vibe, and watch your partner's reaction!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {occasions.map((occ) => (
            <div key={occ.slug} className="bg-white/80 backdrop-blur-md rounded-[32px] border border-rosePrimary/10 shadow-lg overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group hover:shadow-xl text-left">
              <div className="relative aspect-[16/10] overflow-hidden shrink-0 bg-slate-100">
                <img
                  src={occ.images[0]}
                  alt={occ.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-rosePrimary text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  {occ.themeCount} Design Theme{occ.themeCount !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading font-black text-lg text-wineDeep">{occ.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light line-clamp-3">
                    {occ.desc}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Starting at</span>
                    <span className="font-heading font-black text-lg text-rosePrimary">₹{occ.startingPrice}</span>
                  </div>
                  <Link
                    to={`/surprises/${occ.slug}`}
                    className="px-5 py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer text-center"
                  >
                    View surprise Demos
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-rosePrimary/10 text-center space-y-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-rosePrimary/10 text-rosePrimary text-[10px] font-black uppercase tracking-widest">
            <Heart className="w-3 h-3 fill-rosePrimary" />
            <span>Yaadein Banane Ka Process</span>
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-wineDeep">How it Works</h2>
          <p className="text-sm text-slate-500 font-light leading-relaxed">
            Follow this simple step-by-step guide to build and deliver the perfect virtual surprise for your partner.
          </p>
        </div>

        {/* Step Guide Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 max-w-7xl mx-auto">
          {stepsToCreate.map((item, i) => (
            <div key={i} className="relative flex flex-col justify-between">
              <div className="bg-white border-2 border-rosePrimary/15 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-rosePrimary/5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left group relative overflow-hidden h-full min-h-[220px]">
                <div className="absolute top-0 right-0 w-10 h-10 bg-rosePrimary text-white rounded-bl-xl flex items-center justify-center font-heading font-black text-xs shadow-sm transition-all group-hover:scale-110">
                  {item.step}
                </div>

                <div className="space-y-3 pr-4">
                  <span className="text-3xl block transition-transform duration-300 group-hover:scale-105">{item.icon}</span>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rosePrimary uppercase tracking-widest block">Step {item.step}</span>
                    <h4 className="font-heading font-bold text-sm sm:text-base text-wineDeep leading-tight">{item.title}</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-light font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Desktop Horizontal Connectors */}
              {i < 7 && (i + 1) % 4 !== 0 && (
                <div className="hidden lg:block absolute top-1/2 -right-7 -translate-y-1/2 z-20 text-rosePrimary/40 font-bold text-base">
                  ➔
                </div>
              )}
              {/* Desktop Vertical Row Connector */}
              {i === 3 && (
                <div className="hidden lg:block absolute -bottom-9 left-1/2 -translate-x-1/2 z-20 text-rosePrimary/40 font-bold text-base rotate-90">
                  ➔
                </div>
              )}
              {/* Mobile/Tablet Vertical Connectors */}
              {i < 7 && (
                <div className="block lg:hidden absolute -bottom-9 left-1/2 -translate-x-1/2 z-20 text-rosePrimary/40 font-bold text-base rotate-90">
                  ➔
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-rosePrimary/10 text-left space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-rosePrimary/10 text-rosePrimary text-[10px] font-black uppercase tracking-widest">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-wineDeep">Got Questions?</h2>
          <p className="text-sm text-slate-500 font-light">
            Everything you need to know about setting up your interactive surprise page.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden bg-white/70 backdrop-blur-sm transition-all duration-300">
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-wineDeep font-heading font-bold text-sm sm:text-base hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span className={`text-rosePrimary transition-transform duration-300 text-lg ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-350 ease-in-out ${isOpen ? 'max-h-60 opacity-100 p-6 pt-0 border-t border-slate-50/50' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-wineDeep">
            Mithi Yaadein
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 font-light">
            Humare pyare customers ka anubhav.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-3xl mx-auto relative px-12">
          <div className="glass-card border border-rosePrimary/10 rounded-3xl p-8 md:p-10 shadow-glass-rose relative text-center flex flex-col items-center bg-white/60">

            {/* Star ratings */}
            <div className="flex space-x-1 text-amber-400 mb-6">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-slate-750 italic text-sm sm:text-base leading-relaxed font-light mb-8">
              "{testimonials[currentTestimonial].content}"
            </p>

            <div className="flex items-center space-x-4">
              <img
                src={testimonials[currentTestimonial].avatar}
                alt={testimonials[currentTestimonial].name}
                loading="lazy"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="text-left">
                <h4 className="font-heading font-bold text-sm sm:text-base text-wineDeep">
                  {testimonials[currentTestimonial].name}
                </h4>
                <p className="text-xs text-slate-500">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>
            </div>

          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-rosePrimary/20 bg-white hover:bg-slate-50 text-rosePrimary shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-rosePrimary/20 bg-white hover:bg-slate-50 text-rosePrimary shadow-sm cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>
      </section>

    </div>
  );
}

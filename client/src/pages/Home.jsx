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

  const placeholderOccasions = [
    {
      name: "Birthday Surprise",
      slug: "birthday",
      desc: "Apne birthday girl/boy ko dijiye ek stunning digital surprise page full of memories.",
      funnyTag: "Pure Dhoom Dhadaka Vibe 🎂",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Valentine Surprise",
      slug: "valentines",
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

  useEffect(() => {
    // Professional SEO Optimization
    updateSEO({
      title: "AnKa — Surprise Websites & Custom Web Design Services",
      description: "Apne loved ones ko custom virtual surprise websites (birthday surprise, valentine timeline, wedding invitation, best friend jokes) gift karein. Hum businesses, schools aur coaching classes ke liye custom site-development services bhi provide karte hain!",
      keywords: "surprise website, birthdaysurprise, birthday surprise website, custom surprise website, valentine surprise, wedding countdown website, digital invitation cards, shop website, coaching center website, school custom portal, AnKa surprises, Pyaar Ke Pal"
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
            'valentines': 'For your 24/7 Overthinker 💘',
            'birthday': 'Pure Dhoom Dhadaka Vibe 🎂',
            'wedding-invitation': 'Shubh Mangal Saavdhan 💍',
            'wedding-surprise': 'Dost Ki Shadi Ka Tohfa 🍻',
            'new-year': 'Naye Saal Ki Nayi Ummeed ✨',
            'best-friend': 'Inside Jokes Ka Pitara 🤫',
            'friendship-day': 'Kaminey Doston Ke Naam 🤟',
            'random-day': 'Bina Kisi Wajah... Bas Pyaar Hai 🌸'
          };
          const mapped = data.categories.map(cat => {
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
              desc: cat.description,
              funnyTag: funnyTagsMap[cat.slug] || 'Pyaar Ka Tohfa 🌸',
              images: imagesArray,
              hasDemos: cat.demos && cat.demos.length > 0
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
    fetchCategories();
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

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState('');

  const testimonials = [
    {
      name: 'Rohan Sharma',
      role: 'Valentine\'s Surprise',
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

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!leadName || !leadPhone || !leadMessage) return;
    setSubmittingLead(true);
    setLeadError('');
    setLeadSuccess(false);

    try {
      const data = await api.submitLead({
        name: leadName,
        phone: leadPhone,
        message: leadMessage
      });
      if (data.success) {
        setLeadSuccess(true);
        setLeadName('');
        setLeadPhone('');
        setLeadMessage('');
      } else {
        setLeadError(data.message || 'Error submitting idea.');
      }
    } catch (err) {
      console.error(err);
      setLeadError('Network error. Is the server running?');
    } finally {
      setSubmittingLead(false);
    }
  };

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
            <span>Surprise Banao Shuru! 🚀</span>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-rosePrimary/10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-wineDeep">
            Pyaar Ke Pal 💖
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-light leading-relaxed">
            Apne rishte ke hisab se ek unique surprise category chunein aur dhoom machayein!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {loadingCategories ? (
            <div className="col-span-12 flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-rosePrimary/20 border-t-rosePrimary rounded-full animate-spin"></div>
              <p className="text-slate-500 font-light text-sm">Occasions load ho rahe hain...</p>
            </div>
          ) : categoriesError ? (
            <div className="col-span-12 space-y-12">
              <div className="max-w-xl mx-auto p-6 rounded-3xl bg-rosePrimary/5 border border-rosePrimary/10 text-center space-y-3 animate-fade-in-up">
                <div className="w-12 h-12 bg-rosePrimary/10 text-rosePrimary rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="font-heading font-black text-wineDeep text-lg">Connection Vibe Check</h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed max-w-sm mx-auto">
                  {categoriesError}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {placeholderOccasions.map((occ, idx) => {
                  const bentoClass = getBentoColSpan(idx);
                  const isHeroCard = (idx % 8) === 0 || (idx % 8) === 7;
                  const isReversed = (idx % 8) === 7;
                  
                  if (isHeroCard) {
                    return (
                      <a
                        key={occ.slug}
                        href="#on-demand"
                        className={`group relative overflow-hidden shadow-glass-rose transition-all duration-500 flex flex-col md:flex-row ${isReversed ? 'md:flex-row-reverse' : ''} bg-white/70 backdrop-blur-md border border-rosePrimary/15 opacity-90 ${bentoClass}`}
                      >
                        <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden shrink-0 min-h-[200px] grayscale-[40%] opacity-85">
                          <img src={occ.image} alt={occ.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-5 md:p-6 flex flex-col justify-between flex-grow space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="bg-slate-100 text-slate-500 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-slate-200">
                                {occ.funnyTag}
                              </span>
                            </div>
                            <h3 className="font-heading font-black text-lg sm:text-xl text-slate-400 leading-tight">
                              {occ.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                              {occ.desc}
                            </p>
                            
                            <div className="p-3.5 rounded-2xl bg-rosePrimary/5 border border-rosePrimary/10 text-left space-y-1 mt-3 animate-pulse">
                              <span className="text-[10px] font-black text-rosePrimary uppercase tracking-wider block">Coming Soon 🌸</span>
                              <p className="text-[10px] text-slate-500 font-light leading-snug">
                                We will upload this content soon! If you need this occasion immediately, please use our <span className="font-bold underline text-rosePrimary">On-Demand Custom Surprise services</span> below.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-rosePrimary font-black text-xs uppercase tracking-wider pt-2 border-t border-rosePrimary/5">
                            <span>Request Custom Surprise</span>
                            <Sparkles className="w-4 h-4 text-rosePrimary" />
                          </div>
                        </div>
                      </a>
                    );
                  }
                  return (
                    <a
                      key={occ.slug}
                      href="#on-demand"
                      className={`group relative overflow-hidden shadow-glass-rose transition-all duration-500 bg-white/70 backdrop-blur-md border border-rosePrimary/15 opacity-90 ${bentoClass}`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden shrink-0 grayscale-[40%] opacity-85">
                        <img src={occ.image} alt={occ.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 flex flex-col flex-grow justify-between space-y-2.5">
                        <div className="space-y-1.5">
                          <div className="flex items-center">
                            <span className="bg-slate-100 text-slate-500 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-slate-200">
                              {occ.funnyTag}
                            </span>
                          </div>
                          <h3 className="font-heading font-black text-base text-slate-400 leading-tight">
                            {occ.name}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-slate-400 font-light leading-relaxed line-clamp-2">
                            {occ.desc}
                          </p>

                          <div className="p-3 rounded-2xl bg-rosePrimary/5 border border-rosePrimary/10 text-left space-y-1 mt-2 animate-pulse">
                            <span className="text-[10px] font-black text-rosePrimary uppercase tracking-wider block">Coming Soon 🌸</span>
                            <p className="text-[10px] text-slate-500 font-light leading-snug">
                              We will upload this content soon! If you need this, please go to <span className="font-bold underline text-rosePrimary">On-Demand services</span> below.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5 text-rosePrimary font-black text-xs uppercase tracking-wider pt-3 border-t border-rosePrimary/5">
                          <span>Request Custom Surprise</span>
                          <Sparkles className="w-3.5 h-3.5 text-rosePrimary" />
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : occasions.length === 0 ? (
            <div className="col-span-12 text-center py-20 text-slate-500 italic">
              Koi surprise category abhi available nahi hai. Admin panel se create karein!
            </div>
          ) : (
            occasions.map((occ, idx) => {
              const bentoClass = getBentoColSpan(idx);
              const isHeroCard = (idx % 8) === 0 || (idx % 8) === 7;
              const isReversed = (idx % 8) === 7;
              
              if (!occ.hasDemos) {
                if (isHeroCard) {
                  return (
                    <a
                      key={occ.slug}
                      href="#on-demand"
                      className={`group relative overflow-hidden shadow-glass-rose transition-all duration-500 flex flex-col md:flex-row ${isReversed ? 'md:flex-row-reverse' : ''} bg-white/70 backdrop-blur-md border border-rosePrimary/15 opacity-90 hover:border-rosePrimary/40 ${bentoClass}`}
                    >
                      <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden shrink-0 min-h-[200px] grayscale-[40%] opacity-80">
                        <AutoSlideImage images={occ.images} alt={occ.name} />
                      </div>
                      <div className="p-5 md:p-6 flex flex-col justify-between flex-grow space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="bg-slate-100 text-slate-500 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-slate-200">
                              {occ.funnyTag}
                            </span>
                          </div>
                          <h3 className="font-heading font-black text-lg sm:text-xl text-slate-400 leading-tight">
                            {occ.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                            {occ.desc}
                          </p>
                          
                          <div className="p-3.5 rounded-2xl bg-rosePrimary/5 border border-rosePrimary/10 text-left space-y-1 mt-3 animate-pulse">
                            <span className="text-[10px] font-black text-rosePrimary uppercase tracking-wider block">Coming Soon 🌸</span>
                            <p className="text-[10px] text-slate-500 font-light leading-snug">
                              We will upload this content soon! If you need this occasion immediately, please use our <span className="font-bold underline text-rosePrimary">On-Demand Custom Surprise services</span> below.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-rosePrimary font-black text-xs uppercase tracking-wider pt-2 border-t border-rosePrimary/5">
                          <span>Request Custom Surprise</span>
                          <Sparkles className="w-4 h-4 text-rosePrimary" />
                        </div>
                      </div>
                    </a>
                  );
                }
                return (
                  <a
                    key={occ.slug}
                    href="#on-demand"
                    className={`group relative overflow-hidden shadow-glass-rose transition-all duration-500 bg-white/70 backdrop-blur-md border border-rosePrimary/15 opacity-90 hover:border-rosePrimary/40 ${bentoClass}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden shrink-0 grayscale-[40%] opacity-80">
                      <AutoSlideImage images={occ.images} alt={occ.name} />
                    </div>
                    <div className="p-4 flex flex-col flex-grow justify-between space-y-2.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center">
                          <span className="bg-slate-100 text-slate-500 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-slate-200">
                            {occ.funnyTag}
                          </span>
                        </div>
                        <h3 className="font-heading font-black text-base text-slate-400 leading-tight">
                          {occ.name}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 font-light leading-relaxed line-clamp-2">
                          {occ.desc}
                        </p>

                        <div className="p-3 rounded-2xl bg-rosePrimary/5 border border-rosePrimary/10 text-left space-y-1 mt-2 animate-pulse">
                          <span className="text-[10px] font-black text-rosePrimary uppercase tracking-wider block">Coming Soon 🌸</span>
                          <p className="text-[10px] text-slate-500 font-light leading-snug">
                            We will upload this content soon! If you need this, please go to <span className="font-bold underline text-rosePrimary">On-Demand services</span> below.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 text-rosePrimary font-black text-xs uppercase tracking-wider pt-3 border-t border-rosePrimary/5">
                        <span>Request Custom Surprise</span>
                        <Sparkles className="w-3.5 h-3.5 text-rosePrimary" />
                      </div>
                    </div>
                  </a>
                );
              }

              if (isHeroCard) {
                return (
                  <Link
                    key={occ.slug}
                    to={`/surprises/${occ.slug}`}
                    className={`group relative overflow-hidden shadow-glass-rose hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col md:flex-row ${isReversed ? 'md:flex-row-reverse' : ''} bg-white/90 backdrop-blur-md border border-rosePrimary/15 ${bentoClass}`}
                  >
                    <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden shrink-0 min-h-[200px]">
                      <AutoSlideImage images={occ.images} alt={occ.name} />
                    </div>
                    <div className="p-5 md:p-6 flex flex-col justify-between flex-grow space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="bg-rosePrimary/10 text-rosePrimary text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-rosePrimary/15">
                            {occ.funnyTag}
                          </span>
                        </div>
                        <h3 className="font-heading font-black text-lg sm:text-xl text-wineDeep group-hover:text-rosePrimary transition-colors leading-tight">
                          {occ.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-700 font-light leading-relaxed">
                          {occ.desc}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-rosePrimary font-black text-xs uppercase tracking-wider pt-2 border-t border-rosePrimary/5">
                        <span>View Demos & Plans</span>
                        <Heart className="w-4 h-4 fill-rosePrimary animate-pulse" />
                      </div>
                    </div>
                  </Link>
                );
              }
              return (
                <Link
                  key={occ.slug}
                  to={`/surprises/${occ.slug}`}
                  className={`group relative overflow-hidden shadow-glass-rose hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between bg-white/90 backdrop-blur-md border border-rosePrimary/15 ${bentoClass}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                    <AutoSlideImage images={occ.images} alt={occ.name} />
                  </div>
                  <div className="p-4 flex flex-col flex-grow justify-between space-y-2.5">
                    <div className="space-y-1.5">
                      <div className="flex items-center">
                        <span className="bg-rosePrimary/10 text-rosePrimary text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-rosePrimary/15">
                          {occ.funnyTag}
                        </span>
                      </div>
                      <h3 className="font-heading font-black text-base text-wineDeep group-hover:text-rosePrimary transition-colors leading-tight">
                        {occ.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-700 font-light leading-relaxed line-clamp-2">
                        {occ.desc}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5 text-rosePrimary font-black text-xs uppercase tracking-wider pt-3 border-t border-rosePrimary/5">
                      <span>View Demos</span>
                      <Heart className="w-3.5 h-3.5 fill-rosePrimary" />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
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

      {/* On-Demand Surprise form Section: Kuch Aur Chahiye? */}
      <section id="on-demand" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-rosePrimary/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-center">
          
          <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
            <span className="inline-flex items-center space-x-1.5 px-4.5 py-2 rounded-full bg-rosePrimary/10 border border-rosePrimary/20 text-rosePrimary text-xs font-black uppercase tracking-widest">
              ✨ Custom Request
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-wineDeep leading-none tracking-tight">
              Kuch Aur Chahiye?
            </h2>
            <p className="font-accent text-xl text-rosePrimary font-black">"Bataiye Apna Idea..."</p>
            <p className="text-sm sm:text-base text-slate-700 font-light leading-relaxed">
              Kya aapke paas koi alag surprise idea hai? Humein bataiye! Humari team aapko call ya WhatsApp par directly contact karke custom surprise design karegi.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-12 border border-rosePrimary/20 shadow-xl shadow-rosePrimary/5">
              {leadSuccess ? (
                <div className="text-center py-16 flex flex-col items-center space-y-5">
                  <div className="p-5 bg-green-50 border border-green-200 text-green-600 rounded-full animate-bounce">
                    <Check className="w-12 h-12 text-rosePrimary" />
                  </div>
                  <h3 className="font-heading font-black text-3xl text-wineDeep">Aapka Idea Mil Gaya!</h3>
                  <p className="text-lg text-slate-600 font-light leading-relaxed">
                    Dhanyawaad! Hum jald hi aapse WhatsApp ya call par connect karenge. Tab tak ke liye khush rahiye!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-6">
                  {leadError && (
                    <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 text-sm font-medium flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5" />
                      <span>{leadError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-black text-wineDeep uppercase tracking-wider block mb-2">Aapka Naam</label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-5 py-4 text-base border border-rosePrimary/20 bg-creamBase/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rosePrimary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-wineDeep uppercase tracking-wider block mb-2">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="+91 99999 99999"
                        className="w-full px-5 py-4 text-base border border-rosePrimary/20 bg-creamBase/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rosePrimary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-wineDeep uppercase tracking-wider block mb-2">Apna Surprise Idea Likhien</label>
                    <textarea
                      rows="4"
                      required
                      value={leadMessage}
                      onChange={(e) => setLeadMessage(e.target.value)}
                      placeholder="E.g. Mujhe shadi ke 10 saal poore hone par ek unique slideshow surprise banana hai..."
                      className="w-full px-5 py-4 text-base border border-rosePrimary/20 bg-creamBase/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rosePrimary focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="w-full py-5 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-sm font-black uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4 fill-white" />
                    <span>Humein Idea Bhejein 🚀</span>
                  </button>
                </form>
              )}
            </div>
          </div>

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

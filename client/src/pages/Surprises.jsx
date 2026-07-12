import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.service';
import { Heart, Sparkles } from 'lucide-react';
import FloatingParticles from '../components/animations/FloatingParticles';
import AutoSlideImage from '../components/AutoSlideImage';
import { updateSEO } from '../utils/seo';

export default function Surprises() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const fetchCategories = async () => {
    if (!navigator.onLine) {
      setErrorMsg("No Internet Connection 🌐 Please check your connection and try again.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await api.getCategories();
      if (data.success) {
        setCategories(data.categories || []);
      } else {
        setErrorMsg("Something went wrong on our end. Our Cupid team is looking into it! 💖 Please try again later.");
      }
    } catch (err) {
      console.warn('API error fetching categories.', err);
      if (!navigator.onLine) {
        setErrorMsg("No Internet Connection 🌐 Please check your connection and try again.");
      } else {
        setErrorMsg("Something went wrong on our end. Our Cupid team is looking into it! 💖 Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Professional SEO
    updateSEO({
      title: "Surprise Occasions Marketplace | Pyaar Ke Pal",
      description: "Apne partner ya best friend ke liye customizable interactive surprise setups (Birthday surprises, custom Valentine timelines, digital invitations) discover karein.",
      keywords: "surprise ideas, online surprises, customized birthday surprise website, wedding invitations online, friend surprise setup, surprises marketplace, Pyaar Ke Pal"
    });

    fetchCategories();
  }, []);

  const funnyTagsMap = {
    'virtual-date': 'For your 24/7 Overthinker 💘',
    'birthday': 'Pure Dhoom Dhadaka Vibe 🎂',
    'wedding-invitation': 'Shubh Mangal Saavdhan 💍',
    'wedding-surprise': 'Dost Ki Shadi Ka Tohfa 🍻',
    'new-year': 'Naye Saal Ki Nayi Ummeed ✨',
    'best-friend': 'Inside Jokes Ka Pitara 🤫',
    'friendship-day': 'Kaminey Doston Ke Naam 🤟',
    'random-day': 'Bina Kisi Wajah... Bas Pyaar Hai 🌸'
  };

  const getCategoryTags = (slug) => {
    const romanticSlugs = ['virtual-date', 'valentine', 'anniversary', 'proposal', 'random-day'];
    const birthdaySlugs = ['birthday'];
    const weddingSlugs = ['wedding-invitation', 'wedding-surprise'];
    const friendshipSlugs = ['best-friend', 'friendship-day'];

    const tags = [];
    if (romanticSlugs.includes(slug)) tags.push('Romantic');
    if (birthdaySlugs.includes(slug)) tags.push('Birthday');
    if (weddingSlugs.includes(slug)) tags.push('Wedding');
    if (friendshipSlugs.includes(slug)) tags.push('Friendship');
    return tags;
  };

  const filteredCategories = categories.filter(cat => {
    if (selectedFilter === 'All') return true;
    const tags = getCategoryTags(cat.slug);
    return tags.includes(selectedFilter);
  });

  return (
    <div className="min-h-screen bg-creamBase/25 pt-24 pb-16 relative overflow-hidden">
      
      {/* Background Animated Blobs for Dynamic Modern Look */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-rosePrimary/5 filter blur-3xl -z-10 animate-float-slow"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-blushAccent/10 filter blur-3xl -z-10 animate-float-reverse"></div>

      {/* Background drifting particles */}
      <FloatingParticles />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center">
            <span className="inline-flex items-center space-x-1.5 px-4.5 py-2 rounded-full bg-rosePrimary/10 border border-rosePrimary/15 text-rosePrimary text-xs font-black uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5 fill-rosePrimary text-rosePrimary animate-pulse" />
              <span>Surprise Marketplace 🎁</span>
            </span>
          </div>
          <h1 className="font-heading font-black text-5xl sm:text-7xl text-wineDeep tracking-tight">
            Pyaar Ke Pal 💖
          </h1>
          <p className="text-xl sm:text-2xl text-slate-700 font-light leading-relaxed">
            Apne khaas doston aur rishton ke liye ek unique Surprise chunein aur dhoom machayein!
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto border-b pb-8 border-rosePrimary/10">
          {['All', 'Romantic', 'Birthday', 'Wedding', 'Friendship'].map(filterName => {
            const isActive = selectedFilter === filterName;
            return (
              <button
                key={filterName}
                type="button"
                onClick={() => setSelectedFilter(filterName)}
                className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-full transition-all duration-300 shadow-sm cursor-pointer ${isActive ? 'bg-rosePrimary text-white shadow-rosePrimary/20 hover:scale-[1.03]' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-100 hover:text-rosePrimary'}`}
              >
                {filterName}
              </button>
            );
          })}
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-rosePrimary/20 border-t-rosePrimary rounded-full animate-spin"></div>
            <p className="text-slate-500 font-light text-sm">Loading occasions...</p>
          </div>
        ) : errorMsg ? (
          <div className="max-w-md mx-auto p-8 rounded-[32px] bg-white/80 border border-rosePrimary/15 shadow-glass-rose text-center space-y-6 animate-fade-in-up">
            <div className="w-16 h-16 bg-rosePrimary/10 text-rosePrimary rounded-2xl flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 fill-rosePrimary/20 text-rosePrimary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-black text-2xl text-wineDeep">Occasion Vibe Check</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                {errorMsg}
              </p>
            </div>
            <button
              onClick={fetchCategories}
              className="w-full py-4 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-md transition-all cursor-pointer hover:scale-[1.01]"
            >
              Retry Connection 🔄
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-[32px] bg-white/85 border border-rosePrimary/10 shadow-glass-rose text-center space-y-4 py-12 animate-fade-in-up">
            <div className="w-14 h-14 bg-rose-50 text-rosePrimary rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-black text-wineDeep text-lg">No surprises Found</h3>
              <p className="text-xs text-slate-500 font-light mt-1 max-w-xs mx-auto leading-relaxed">
                Humein is category ke liye koi active template nahi mila. Aap dynamic content seedhe customer support se request kar sakte hain!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, idx) => {
              let cardImages = [];
              if (category.images && category.images.length > 0) {
                cardImages = category.images;
              } else if (category.imageUrl) {
                cardImages = [category.imageUrl];
              } else if (category.demos && category.demos.length > 0) {
                cardImages = category.demos.map(d => d.imageUrl);
              } else {
                cardImages = ["https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600"];
              }

              const hasDemos = category.demos && category.demos.length > 0;

              // Organic alternating corner shapes
              const shapeClass = idx % 2 === 0 
                ? 'rounded-tl-[36px] rounded-br-[36px]' 
                : 'rounded-tr-[36px] rounded-bl-[36px]';

              if (!hasDemos) {
                return (
                  <div 
                    key={category.slug}
                    className={`group relative overflow-hidden shadow-glass-rose transition-all duration-500 bg-white/70 border border-rosePrimary/15 opacity-95 ${shapeClass}`}
                  >
                    <div className="relative aspect-4/3 overflow-hidden shrink-0 grayscale-[40%] opacity-80">
                      <AutoSlideImage images={cardImages} alt={category.name} />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow space-y-3.5 justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="bg-slate-100 text-slate-500 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-slate-200">
                            {funnyTagsMap[category.slug] || 'Pyaar Ka Tohfa 🌸'}
                          </span>
                        </div>
                        <h3 className="font-heading font-black text-lg sm:text-xl text-slate-400 leading-tight">
                          {category.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed line-clamp-2">
                          {category.description}
                        </p>
                        
                        <div className="p-3.5 rounded-2xl bg-rosePrimary/5 border border-rosePrimary/10 text-left space-y-1 mt-2.5 animate-pulse">
                          <span className="text-[10px] font-black text-rosePrimary uppercase tracking-wider block">Coming Soon 🌸</span>
                          <p className="text-[10px] text-slate-500 font-light leading-snug">
                            We will upload this content soon! If you need this, please check out our <span className="font-bold underline text-rosePrimary">On-Demand services</span> page.
                          </p>
                        </div>
                      </div>

                      <a
                        href="/on-demand"
                        className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-500 text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer text-center"
                      >
                        <span>Request Custom Surprise</span>
                      </a>
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={category.slug}
                  className={`group relative overflow-hidden shadow-glass-rose hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col h-full bg-white/80 border border-rosePrimary/15 ${shapeClass}`}
                >
                  <div className="relative aspect-4/3 overflow-hidden shrink-0">
                    <AutoSlideImage images={cardImages} alt={category.name} />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow space-y-3.5 justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="bg-rosePrimary/10 text-rosePrimary text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-rosePrimary/15">
                          {funnyTagsMap[category.slug] || 'Pyaar Ka Tohfa 🌸'}
                        </span>
                      </div>
                      <h3 className="font-heading font-black text-lg sm:text-xl text-wineDeep group-hover:text-rosePrimary transition-colors leading-tight">
                        {category.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-655 font-light leading-relaxed line-clamp-2">
                        {category.description}
                      </p>
                    </div>
 
                    <Link
                      to={`/surprises/${category.slug}`}
                      className="w-full py-3.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01]"
                    >
                      <span>Designs Aur Demos Dekhein</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

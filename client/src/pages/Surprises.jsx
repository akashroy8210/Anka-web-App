import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.service';
import { Heart, Sparkles } from 'lucide-react';
import FloatingParticles from '../components/animations/FloatingParticles';
import AutoSlideImage from '../components/AutoSlideImage';

export default function Surprises() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.warn('API error fetching categories.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

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

        {/* Categories Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-rosePrimary/20 border-t-rosePrimary rounded-full animate-spin"></div>
            <p className="text-slate-500 font-light text-sm">Loading occasions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => {
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

              // Organic alternating corner shapes
              const shapeClass = idx % 2 === 0 
                ? 'rounded-tl-[36px] rounded-br-[36px]' 
                : 'rounded-tr-[36px] rounded-bl-[36px]';

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

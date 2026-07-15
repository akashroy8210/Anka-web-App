import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.service';
import { Heart, Check, Sparkles, Play, CreditCard, Tag, AlertCircle, ShoppingBag, X, ExternalLink, ArrowLeft, Star, Package, FileText, Image, Music, Calendar, Smartphone, Link as LucideLink, CheckCircle, Crown, Gift, Mic, Flower2, Lock, GalleryHorizontal, Stars, PartyPopper, Zap, Edit3, MessageCircle } from 'lucide-react';
import FloatingParticles from '../components/animations/FloatingParticles';
import AutoSlideImage from '../components/AutoSlideImage';
import { updateSEO } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewDemoId, setNewReviewDemoId] = useState('');
  const [newReviewScore, setNewReviewScore] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitMsg, setReviewSubmitMsg] = useState('');
  const [reviewSubmitError, setReviewSubmitError] = useState(false);
  
  // Checkout flow state
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedTier, setSelectedTier] = useState(null); // 'Basic' or 'Premium'

  // Video Preview States
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState(false);

  // Payment states
  const [checkingOut, setCheckingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCategoryAndDemos = async () => {
      if (!navigator.onLine) {
        setErrorMessage("No Internet Connection 🌐 Please check your connection and try again.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setErrorMessage('');
        const data = await api.getCategory(slug);
        if (data.success && data.category) {
          setCategory(data.category);
          setDemos(data.demos || []);
          
          // Apply dynamic occasion category SEO tags
          const occasionName = data.category.name || 'Custom Surprise';
          const demosList = (data.demos || []).map(d => d.name).join(', ') || 'Premium Surprise Themes';
          updateSEO({
            title: `${occasionName} Surprise Website Designs`,
            description: `Choose from our premium custom designs (${demosList}) to build an interactive ${occasionName} surprise website. Handcrafted romantic themes, countdown timers, music playlists, and memory galleries.`,
            keywords: `${occasionName} surprise, custom ${occasionName} website, birthdaysurprise, birthday surprise website, anniversary surprise, interactive gift cards, digital love letters, AnKa`
          });
        } else {
          setCategory(null);
          setDemos([]);
          setErrorMessage("We couldn't find this surprise occasion. Our Cupid team is looking into it! 🌸");
        }
      } catch (err) {
        console.warn('API error fetching category details.', err);
        setCategory(null);
        setDemos([]);
        if (!navigator.onLine) {
          setErrorMessage("No Internet Connection 🌐 Please check your connection and try again.");
        } else {
          setErrorMessage("Something went wrong on our end. Our Cupid team is looking into it! 💖 Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryAndDemos();
  }, [slug]);

  const fetchReviews = async (catId) => {
    if (!catId) return;
    try {
      setReviewsLoading(true);
      const res = await api.getRatings({ categoryId: catId });
      if (res.success) {
        // Sort reviews: highest score first, then newest first
        const sorted = (res.ratings || []).sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setReviews(sorted);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (category?._id) {
      fetchReviews(category._id);
    }
  }, [category?._id]);

  useEffect(() => {
    if (selectedDemo?._id) {
      setNewReviewDemoId(selectedDemo._id);
    } else if (demos.length > 0) {
      setNewReviewDemoId(demos[0]._id);
    }
  }, [selectedDemo, demos]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReviewName || !newReviewDemoId || !newReviewScore) {
      setReviewSubmitMsg('Please fill out your name and select a design vibe.');
      setReviewSubmitError(true);
      return;
    }
    try {
      setSubmittingReview(true);
      setReviewSubmitMsg('');
      const res = await api.submitRating({
        demoId: newReviewDemoId,
        score: Number(newReviewScore),
        reviewText: newReviewText,
        customerName: newReviewName
      });
      if (res.success) {
        setReviewSubmitMsg('Thank you! Your review has been submitted successfully.');
        setReviewSubmitError(false);
        setNewReviewText('');
        setNewReviewName('');
        setNewReviewScore(5);
        fetchReviews(category._id);
      } else {
        setReviewSubmitMsg(res.message || 'Failed to submit review.');
        setReviewSubmitError(true);
      }
    } catch (err) {
      console.error(err);
      setReviewSubmitMsg('Network error submitting review.');
      setReviewSubmitError(true);
    } finally {
      setSubmittingReview(false);
    }
  };

  const getSubtotal = () => {
    if (!selectedDemo || !selectedTier) return 0;
    const catTier = category?.tiers?.find(t => t.name === selectedTier);
    return catTier && typeof catTier.price === 'number' ? catTier.price : 0;
  };

  const getDiscount = () => {
    const subtotal = getSubtotal();
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      return appliedCoupon.discountValue;
    }
  };

  const getTotal = () => {
    return Math.max(0, getSubtotal() - getDiscount());
  };

  // Coupon Apply
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;

    try {
      const data = await api.validateCoupon(couponCode);
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponMessage(data.message);
        setCouponError(false);
      } else {
        setAppliedCoupon(null);
        setCouponMessage(data.message);
        setCouponError(true);
      }
    } catch (err) {
      console.error(err);
      setAppliedCoupon(null);
      setCouponMessage('Error validating coupon. Try again.');
      setCouponError(true);
    }
  };

  // Start checkout submit
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customerEmail || !customerName || !customerPhone) {
      alert('Please fill out Name, Email, and Phone number.');
      return;
    }

    // Log checkout submission start
    trackEvent('Checkout started', {
      categorySlug: slug,
      themeSlug: selectedDemo.themeSlug,
      tier: selectedTier,
      price: selectedTier === 'Basic' ? category.tiers[0].price : category.tiers[1].price
    });

    setCheckingOut(true);

    try {
      const orderPayload = {
        demoId: selectedDemo._id,
        categoryId: category._id,
        tierName: selectedTier,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        customerEmail,
        customerName,
        customerPhone
      };

      const data = await api.createPaymentOrder(orderPayload);
      
      if (data.success) {
        // Dynamically load Razorpay SDK
        const loadRazorpayScript = () => {
          return new Promise((resolve) => {
            if (window.Razorpay) {
              resolve(true);
              return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert("Failed to load Razorpay Payment Gateway SDK. Please check your internet connection.");
          setCheckingOut(false);
          return;
        }

        // Razorpay Gateway
        const options = {
          key: data.keyId,
          amount: data.amount * 100,
          currency: data.currency,
          name: "AnKa Surprise Builder",
          description: `Payment for ${category.name} - ${selectedDemo.name}`,
          order_id: data.orderId,
          handler: async (response) => {
            const verifyPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              checkoutDetails: data.checkoutDetails
            };

            try {
              const verifyRes = await api.verifyPaymentSignature(verifyPayload);
              if (verifyRes.success) {
                navigate(`/checkout/success?id=${verifyRes.instanceId}&pwd=${verifyRes.password}&demoId=${selectedDemo._id}&noCredentials=${verifyRes.noCredentials || false}`);
              } else {
                alert('Payment verification failed.');
              }
            } catch (err) {
              console.error(err);
              alert('Verification error.');
            }
          },
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone
          },
          theme: {
            color: "#E11D48"
          }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        alert(data.message || 'Error creating checkout order.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Is the server running?');
    } finally {
      setCheckingOut(false);
    }
  };



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-creamBase/20">
        <div className="w-12 h-12 border-4 border-rosePrimary/20 border-t-rosePrimary rounded-full animate-spin"></div>
        <p className="text-slate-500 font-light text-sm">Loading surprise details...</p>
      </div>
    );
  }

  if (errorMessage || !category) {
    const errorText = errorMessage || "We couldn't find this surprise occasion. Our Cupid team is looking into it! 🌸";
    return (
      <div className="min-h-screen bg-[#FFFDFD] pt-24 pb-16 flex flex-col items-center justify-center text-center p-6">
        <div className="max-w-md w-full p-8 rounded-[36px] bg-white/80 border border-rosePrimary/15 shadow-glass-rose space-y-6 flex flex-col items-center animate-fade-in-up">
          <div className="w-16 h-16 bg-rosePrimary/10 text-rosePrimary rounded-2xl flex items-center justify-center">
            <Heart className="w-8 h-8 fill-rosePrimary/20 text-rosePrimary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading font-black text-2xl text-wineDeep">Occasion Vibe Check</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              {errorText}
            </p>
          </div>
          <div className="flex flex-col w-full space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="py-3.5 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer text-center"
            >
              Retry Connection 🔄
            </button>
            <Link 
              to="/surprises" 
              className="py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-wider rounded-xl transition-all text-center"
            >
              Explore Other Occasions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F6] via-[#FFF5F2] to-white pt-24 pb-20 relative">
      
      {/* Background drifting particles */}
      <FloatingParticles />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ==================================================
            1. Hero Header
            ================================================== */}
        <div className="space-y-4">
          <Link to="/surprises" className="text-sm font-bold text-rosePrimary hover:text-wineDeep tracking-wider uppercase inline-flex items-center space-x-1.5">
            <span>&larr; Back to Occasions</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <span className="bg-rosePrimary/10 text-rosePrimary text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full border border-rosePrimary/15">
              Pyaar Ke Pal Designs
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-wineDeep tracking-tight mt-1">
            {category.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-655 font-light max-w-4xl leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* ==================================================
            2. Dual View Layout: Listings vs. Minimal Checkout
            ================================================== */}
        {!selectedDemo ? (
          /* ==================================================
             VIEW A: Demo Designs Grid Listing
             ================================================== */
          <section className="space-y-6">
            <div className="border-b border-rosePrimary/10 pb-4">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-wineDeep">Available Surprise Themes</h2>
              <p className="text-sm text-slate-500 font-light mt-1">Choose a design vibe that matches their personality before checking out.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {demos.map((demo) => {
                const isPlaying = playingVideoId === demo._id;
                return (
                  <div 
                    key={demo._id} 
                    className="group bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden border border-rosePrimary/15 shadow-md shadow-rosePrimary/5 flex flex-col justify-between"
                  >
                    
                    {/* Media Block (Hover/Tap video autoplay simulation) */}
                    <div className="relative aspect-video bg-slate-950 overflow-hidden shrink-0 border-b border-rosePrimary/5">
                      {isPlaying ? (
                        <video 
                          src={demo.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"} 
                          controls 
                          autoPlay 
                          className="w-full h-full object-cover"
                        />
                      ) : demo.images && demo.images.length > 0 ? (
                        <div className="absolute inset-0 w-full h-full group">
                          <AutoSlideImage images={demo.images} alt={demo.name} />
                          <button
                            onClick={() => {
                              setPlayingVideoId(demo._id);
                              trackEvent('Demo viewed', { categorySlug: slug, themeSlug: demo.themeSlug });
                            }}
                            className="absolute p-3.5 bg-rosePrimary/90 hover:bg-rosePrimary text-white rounded-full shadow-lg transition-transform duration-300 hover:scale-110 flex items-center justify-center cursor-pointer z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          >
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <img 
                            src={demo.imageUrl} 
                            alt={demo.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-wineDeep/10 group-hover:bg-wineDeep/5 transition-colors" />
                          <button
                            onClick={() => {
                              setPlayingVideoId(demo._id);
                              trackEvent('Demo viewed', { categorySlug: slug, themeSlug: demo.themeSlug });
                            }}
                            className="absolute p-3.5 bg-rosePrimary/90 hover:bg-rosePrimary text-white rounded-full shadow-lg transition-transform duration-300 hover:scale-110 flex items-center justify-center cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Content & Action buttons */}
                    <div className="p-5 md:p-6 flex flex-col justify-between flex-grow space-y-3.5">
                      
                      <div className="space-y-1.5">
                        {/* Rating block */}
                        <div className="flex items-center space-x-1.5 text-xs">
                          <div className="flex text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </div>
                          <span className="font-bold text-wineDeep">{demo.ratingAverage || 4.7}★</span>
                          <span className="text-slate-400">({demo.ratingCount || 10} reviews)</span>
                        </div>

                        <h3 className="font-heading font-extrabold text-base sm:text-lg text-wineDeep leading-tight">{demo.name}</h3>
                      </div>

                       <div className="flex justify-end items-center gap-2 pt-3 border-t border-rosePrimary/5 w-full">
                        <a
                          href={demo.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            trackEvent('Demo viewed', { categorySlug: slug, themeSlug: demo.themeSlug });
                          }}
                          className="flex-grow sm:flex-grow-0 text-center px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Demo</span>
                        </a>
                        
                        <button
                          onClick={() => {
                            setSelectedDemo(demo);
                            trackEvent('Checkout started', { categorySlug: slug, themeSlug: demo.themeSlug });
                          }}
                          className="flex-grow sm:flex-grow-0 px-4.5 py-2 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all hover:scale-[1.01] cursor-pointer text-center"
                        >
                          <span>Select</span>
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          /* ==================================================
             VIEW B: Integrated SaaS Product Configurator & Checkout Page
             ================================================== *          /* ==================================================
             VIEW B: Integrated SaaS Product Configurator & Checkout Page
             ================================================== */
          <section className="animate-fade-in-up space-y-12">
            
            {/* Top Section: Split Screen Info & Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column (5 of 12 = 41.6%): Title, Description, Trust Badges */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <button 
                    onClick={() => { setSelectedDemo(null); setSelectedTier(null); }}
                    className="flex items-center space-x-1.5 text-xs font-black text-rosePrimary hover:text-wineDeep uppercase tracking-wider cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Change Design Vibe</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-rosePrimary">
                    <Heart className="w-4.5 h-4.5 fill-rosePrimary" />
                    <span className="text-sm font-black uppercase tracking-wider">{category.name}</span>
                  </div>
                  <h2 className="font-heading font-black text-4xl md:text-5xl text-wineDeep leading-tight">{selectedDemo.name}</h2>
                  
                  <div className="flex items-center space-x-3 text-sm pt-1">
                    <div className="flex items-center">
                      <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400 mr-1" />
                      <span className="font-black text-wineDeep">{selectedDemo.ratingAverage || 4.8}★</span>
                    </div>
                    <span className="text-slate-400">({selectedDemo.ratingCount || 10} reviews)</span>
                    <span className="text-green-600 font-bold ml-1">✓ Configurable</span>
                  </div>

                  <p className="text-base text-slate-600 font-light leading-relaxed">
                    Create a fun, romantic, and interactive virtual date experience with games, music, memories, love notes, countdowns, and personalized surprises—all in one beautiful website.
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 bg-white border border-rosePrimary/10 rounded-2xl flex items-center space-x-3 shadow-sm">
                    <div className="p-2 bg-rosePrimary/10 rounded-xl text-rosePrimary shrink-0">
                      <Zap className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Activation</span>
                      <p className="text-xs font-bold text-wineDeep">Ready in 2 Hours</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white border border-rosePrimary/10 rounded-2xl flex items-center space-x-3 shadow-sm">
                    <div className="p-2 bg-rosePrimary/10 rounded-xl text-rosePrimary shrink-0">
                      <Edit3 className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Customization</span>
                      <p className="text-xs font-bold text-wineDeep">Simple & Friendly</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white border border-rosePrimary/10 rounded-2xl flex items-center space-x-3 shadow-sm">
                    <div className="p-2 bg-rosePrimary/10 rounded-xl text-rosePrimary shrink-0">
                      <MessageCircle className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Support</span>
                      <p className="text-xs font-bold text-wineDeep">24/7 Live Chat</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (7 of 12 = 58.3%): Aspect Video Preview Frame */}
              <div className="lg:col-span-7">
                <div className="bg-white p-4.5 rounded-[32px] border border-rosePrimary/15 shadow-xl space-y-4">
                  <div className="relative aspect-[16/7.5] bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-rosePrimary/5">
                    {playingVideoId === selectedDemo._id ? (
                      <video 
                        src={selectedDemo.videoUrl || "https://res.cloudinary.com/db7iiwwg3/video/upload/v1783067139/Screenrecording_20260703_134249_zwsfis.mp4"} 
                        controls 
                        autoPlay 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={selectedDemo.imageUrl} 
                        alt={selectedDemo.name} 
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <button
                      type="button"
                      onClick={() => setPlayingVideoId(playingVideoId ? null : selectedDemo._id)}
                      className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        playingVideoId === selectedDemo._id 
                          ? 'bg-rosePrimary text-white shadow-sm' 
                          : 'bg-wineDeep hover:bg-rosePrimary text-white shadow-md'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{playingVideoId === selectedDemo._id ? 'Showing Video' : 'Watch Video'}</span>
                    </button>
                    
                    {slug.toLowerCase().includes('proposal') ? (
                      <>
                        <a
                          href={selectedDemo.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-3 bg-white hover:bg-slate-50 border border-rosePrimary/35 text-rosePrimary text-xs font-black uppercase tracking-wider rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Preview</span>
                        </a>
                        <a
                          href={`${selectedDemo.liveDemoUrl}?previewStage=timeline`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-3 bg-white hover:bg-slate-50 border border-rosePrimary/35 text-rosePrimary text-xs font-black uppercase tracking-wider rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Timeline Preview</span>
                        </a>
                        <a
                          href={`${selectedDemo.liveDemoUrl}?previewStage=proposal`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-3 bg-white hover:bg-slate-50 border border-rosePrimary/35 text-rosePrimary text-xs font-black uppercase tracking-wider rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Proposal Preview</span>
                        </a>
                        <a
                          href={`${selectedDemo.liveDemoUrl}?previewStage=celebration`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-3 bg-white hover:bg-slate-50 border border-rosePrimary/35 text-rosePrimary text-xs font-black uppercase tracking-wider rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Celebration Preview</span>
                        </a>
                      </>
                    ) : (
                      <a
                        href={selectedDemo.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-8 py-3 bg-white hover:bg-slate-50 border border-rosePrimary/35 text-rosePrimary text-xs font-black uppercase tracking-wider rounded-full transition-all flex items-center justify-center space-x-2 shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Preview</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Separator / Plan Section Header */}
            <div className="text-center space-y-2 pt-6">
              <div className="flex justify-center items-center space-x-2 text-rosePrimary font-black text-xl uppercase tracking-widest font-heading">
                <Heart className="w-5 h-5 fill-rosePrimary" />
                <span>1. Choose Package Plan</span>
                <Heart className="w-5 h-5 fill-rosePrimary" />
              </div>
              <p className="text-sm text-slate-500 font-light max-w-md mx-auto">
                Select the perfect plan to create your unforgettable virtual date
              </p>
            </div>

            {/* 3-Column Plan Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-7xl mx-auto">
              
              {/* Card 1: Yaadgar Basic */}
              <div 
                onClick={() => {
                  setSelectedTier('Basic');
                  trackEvent('Package selected', {
                    categorySlug: slug,
                    themeSlug: selectedDemo.themeSlug,
                    tier: 'Basic',
                    price: category.tiers[0].price
                  });
                }}
                className={`p-8 rounded-[24px] border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-lg ${
                  selectedTier === 'Basic' 
                    ? 'border-rosePrimary bg-rosePrimary/5 shadow-md' 
                    : 'border-slate-200 bg-white hover:border-rosePrimary/40 shadow-sm'
                }`}
              >
                <div className="space-y-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-rosePrimary/10 rounded-xl text-rosePrimary">
                        <Package className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Standard</span>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-heading font-black text-2xl text-wineDeep leading-tight">Yaadgar Basic</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        Beautiful ready-made virtual surprise setup.
                      </p>
                    </div>

                    <div className="font-heading font-black text-3xl text-wineDeep pt-2 flex items-baseline">
                      ₹{
                        typeof category?.tiers?.find(t => t.name === 'Basic')?.price === 'number'
                          ? category.tiers.find(t => t.name === 'Basic').price
                          : (category?.slug === 'wedding-invitation' ? 1499 : 299)
                      }
                      <span className="text-xs text-slate-400 font-light ml-1">/one-time</span>
                    </div>
                  </div>

                  {/* 2-Column Features Sub-grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-700 font-light pt-4 border-t border-slate-100 flex-grow">
                    {category?.tiers?.find(t => t.name === 'Basic')?.inclusions?.length > 0 ? (
                      <>
                        <ul className="space-y-3.5">
                          {category.tiers.find(t => t.name === 'Basic').inclusions.slice(0, Math.ceil(category.tiers.find(t => t.name === 'Basic').inclusions.length / 2)).map((inc, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-rosePrimary shrink-0" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                        <ul className="space-y-3.5">
                          {category.tiers.find(t => t.name === 'Basic').inclusions.slice(Math.ceil(category.tiers.find(t => t.name === 'Basic').inclusions.length / 2)).map((inc, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-rosePrimary shrink-0" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <>
                        <ul className="space-y-3.5">
                          <li className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Beautiful ready-made theme</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Edit text</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Image className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Replace photos</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Music className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Change music</span>
                          </li>
                        </ul>
                        <ul className="space-y-3.5">
                          <li className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Countdown timer</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Smartphone className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Mobile responsive</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <LucideLink className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Share via private link</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Basic support</span>
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: AnKa Premium */}
              <div 
                onClick={() => {
                  setSelectedTier('Premium');
                  trackEvent('Package selected', {
                    categorySlug: slug,
                    themeSlug: selectedDemo.themeSlug,
                    tier: 'Premium',
                    price: category.tiers[1].price
                  });
                }}
                className={`p-8 rounded-[24px] border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden hover:shadow-lg ${
                  selectedTier === 'Premium' 
                    ? 'border-rosePrimary bg-gradient-to-br from-rosePrimary/5 via-white to-wineDeep/5 shadow-md border-2' 
                    : 'border-rosePrimary/35 bg-gradient-to-br from-rosePrimary/[0.01] via-white to-wineDeep/[0.01] hover:border-rosePrimary shadow-sm'
                }`}
              >
                {/* ⭐ MOST POPULAR Badge */}
                <div className="absolute top-6 right-6 bg-rosePrimary text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm">
                  ★ MOST POPULAR
                </div>

                <div className="space-y-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-rosePrimary/10 rounded-xl text-rosePrimary">
                        <Crown className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-[10px] text-rosePrimary font-black uppercase tracking-widest block">Bespoke</span>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-heading font-black text-2xl text-wineDeep leading-tight">AnKa Premium</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        Complete interactive romance dashboard.
                      </p>
                    </div>

                    <div className="font-heading font-black text-3xl text-wineDeep pt-2 flex items-baseline">
                      ₹{
                        typeof category?.tiers?.find(t => t.name === 'Premium')?.price === 'number'
                          ? category.tiers.find(t => t.name === 'Premium').price
                          : (category?.slug === 'wedding-invitation' ? 4000 : 499)
                      }
                      <span className="text-xs text-slate-400 font-light ml-1">/one-time</span>
                    </div>
                  </div>

                  {/* 2-Column Features Sub-grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-700 font-light pt-4 border-t border-slate-100 flex-grow">
                    {category?.tiers?.find(t => t.name === 'Premium')?.inclusions?.length > 0 ? (
                      <>
                        <ul className="space-y-3.5">
                          {category.tiers.find(t => t.name === 'Premium').inclusions.slice(0, Math.ceil(category.tiers.find(t => t.name === 'Premium').inclusions.length / 2)).map((inc, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <Sparkles className="w-4 h-4 text-rosePrimary shrink-0" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                        <ul className="space-y-3.5">
                          {category.tiers.find(t => t.name === 'Premium').inclusions.slice(Math.ceil(category.tiers.find(t => t.name === 'Premium').inclusions.length / 2)).map((inc, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-rosePrimary shrink-0" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <>
                        <ul className="space-y-3.5">
                          <li className="flex items-center space-x-2 font-semibold text-rosePrimary">
                            <Sparkles className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Everything in Basic</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Gift className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Personalized welcome surprise</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Stars className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Live surprise experience</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Custom love message</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Mic className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Voice note</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Flower2 className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Virtual flower bouquet</span>
                          </li>
                        </ul>
                        <ul className="space-y-3.5">
                          <li className="flex items-center space-x-2">
                            <Lock className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Unlock surprise gift</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Interactive love letter</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <GalleryHorizontal className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Memory gallery</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <PartyPopper className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Premium animations</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Crown className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Personalized nicknames</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Crown className="w-4 h-4 text-rosePrimary shrink-0" />
                            <span>Priority support</span>
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 3: Your Selection Checkout Form / Empty State */}
              <div className="p-8 rounded-[24px] border border-slate-200 bg-white shadow-sm flex flex-col justify-between min-h-[450px]">
                {!selectedTier ? (
                  /* Empty selection state matching mockup envelope style */
                  <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center flex-grow">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block self-start">Your Selection</span>
                    <div className="relative pt-4">
                      <div className="w-20 h-20 bg-rosePrimary/5 rounded-full flex items-center justify-center">
                        <Heart className="w-10 h-10 text-rosePrimary fill-rosePrimary/10 animate-pulse" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-rosePrimary text-white rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
                        ♥
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-heading font-black text-lg text-wineDeep">No plan selected yet</h4>
                      <p className="text-sm text-slate-500 font-light max-w-[200px] mx-auto leading-relaxed">
                        Choose a plan from the left to see details here.
                      </p>
                    </div>

                    <div className="text-slate-300 pt-2 animate-pulse hidden lg:block">
                      <svg className="w-16 h-12 transform -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  /* Checkout Wizard Panel inside selection container */
                  <div className="space-y-4 flex-grow flex flex-col justify-between animate-fade-in-up">
                    <div>
                      <div className="flex justify-between items-center pb-3 border-b border-rosePrimary/10">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Selection</span>
                        <span className="bg-rosePrimary/10 text-rosePrimary text-xs font-bold px-3.5 py-1 rounded-full border border-rosePrimary/20">
                          {selectedTier === 'Basic' ? 'Yaadgar Basic' : 'AnKa Premium'}
                        </span>
                      </div>

                      {/* Step 2 Inputs */}
                      <div className="space-y-3 pt-3">
                        <h4 className="text-[10px] font-black text-wineDeep uppercase tracking-wider">Recipient Details</h4>
                        <div className="space-y-2.5">
                          <div>
                            <label className="text-[9px] font-black text-wineDeep uppercase tracking-wider block mb-1">Aapka Naam</label>
                            <input
                              type="text"
                              required
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="John Doe"
                              className="w-full px-4 py-2 text-xs border border-rosePrimary/15 bg-creamBase/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-wineDeep uppercase tracking-wider block mb-1">Email Address</label>
                            <input
                              type="email"
                              required
                              value={customerEmail}
                              onChange={(e) => setCustomerEmail(e.target.value)}
                              placeholder="john@example.com"
                              className="w-full px-4 py-2 text-xs border border-rosePrimary/15 bg-creamBase/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-wineDeep uppercase tracking-wider block mb-1">WhatsApp Phone</label>
                            <input
                              type="tel"
                              required
                              value={customerPhone}
                              onChange={(e) => setCustomerPhone(e.target.value)}
                              placeholder="+91 99999 99999"
                              className="w-full px-4 py-2 text-xs border border-rosePrimary/15 bg-creamBase/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Coupon Block */}
                      <div className="space-y-2 pt-3 border-t border-rosePrimary/5 mt-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-black text-wineDeep uppercase tracking-wider">Coupon Code</label>
                          {couponMessage && (
                            <span className={`text-[9px] font-semibold ${couponError ? 'text-rose-500' : 'text-green-600'}`}>
                              {couponMessage}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <div className="relative flex-grow">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              placeholder="WELCOME10"
                              className="w-full pl-7 pr-2 py-1.5 text-xs border border-rosePrimary/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary uppercase transition-all"
                            />
                            <Tag className="w-3 h-3 text-slate-400 absolute left-2 top-2.5" />
                          </div>
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            className="px-3 py-1.5 bg-wineDeep hover:bg-rosePrimary text-white text-xs font-black rounded-xl transition-all uppercase tracking-wider cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Summary & Checkout CTA */}
                    <div className="pt-3 border-t border-rosePrimary/10 mt-3 space-y-3">
                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex justify-between font-light">
                          <span>Subtotal</span>
                          <span>₹{getSubtotal()}</span>
                        </div>
                        {appliedCoupon && (
                          <div className="flex justify-between text-green-600 font-semibold">
                            <span>Discount ({appliedCoupon.code})</span>
                            <span>- ₹{getDiscount()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-wineDeep font-bold pt-1 border-t border-rosePrimary/5">
                          <span>Total Amount</span>
                          <span className="text-base font-black text-rosePrimary">₹{getTotal()}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCheckoutSubmit}
                        disabled={checkingOut || !customerName || !customerEmail || !customerPhone}
                        className="w-full py-3 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 focus:outline-none disabled:opacity-50 hover:scale-[1.01] cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5 fill-white" />
                        <span>{checkingOut ? 'Ordering...' : 'Checkout Now 🚀'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        {/* ==================================================
            3. Premium Client Reviews & Feedback Section
            ================================================== */}
        <div className="border-t border-rosePrimary/10 pt-16 mt-16 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="bg-rosePrimary/10 text-rosePrimary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-rosePrimary/15">
              Client Feedback
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-wineDeep">
              Client Love & Heartfelt Stories
            </h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              Read how our premium custom virtual surprises have brought smiles, tears of joy, and unforgettable memories to couples worldwide.
            </p>
          </div>

          <div className="space-y-8">
            {reviewsLoading ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-rosePrimary/10">
                <div className="w-8 h-8 border-3 border-rosePrimary/20 border-t-rosePrimary rounded-full animate-spin mb-3"></div>
                <p className="text-slate-500 text-xs font-light">Loading stories...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center p-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-rosePrimary/10 space-y-4">
                <div className="w-12 h-12 bg-rosePrimary/5 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-rosePrimary/60" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-wineDeep">No stories shared yet</h4>
                  <p className="text-xs text-slate-500 font-light max-w-xs mx-auto">
                    We'll show beautiful verified customer experiences here soon.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Summary stat header */}
                <div className="flex flex-wrap items-center justify-between p-6 bg-gradient-to-r from-white to-[#FFF5F2] backdrop-blur-md rounded-[28px] border border-rosePrimary/15 gap-4 max-w-4xl mx-auto shadow-md shadow-rosePrimary/[0.02]">
                  <div className="flex items-center space-x-5">
                    <div className="text-center bg-gradient-to-br from-rosePrimary to-wineDeep px-5 py-3 rounded-2xl shrink-0 text-white shadow-md shadow-rosePrimary/25">
                      <span className="text-3.5xl font-black block leading-none">
                        {(reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length).toFixed(1)}
                      </span>
                      <span className="text-[10px] opacity-80 font-bold block uppercase tracking-wider mt-1">out of 5</span>
                    </div>
                    <div>
                      <div className="flex items-center text-amber-400 mb-1">
                        {[...Array(5)].map((_, i) => {
                          const avg = reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length;
                          return (
                            <Star 
                              key={i} 
                              className={`w-4.5 h-4.5 ${i < Math.round(avg) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                            />
                          );
                        })}
                      </div>
                      <span className="text-xs font-black text-wineDeep">Based on {reviews.length} client stories</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-rosePrimary bg-rosePrimary/5 px-4 py-2 rounded-full border border-rosePrimary/10 text-xs font-black uppercase tracking-wider">
                    <Heart className="w-3.5 h-3.5 fill-rosePrimary" />
                    <span>100% Verified Romance</span>
                  </div>
                </div>

                {/* Reviews Grid/List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.map((review) => {
                    const matchedDemo = demos.find(d => d._id === review.demoId);
                    return (
                      <div 
                        key={review._id} 
                        className="bg-white/80 backdrop-blur-md p-7 rounded-[28px] border border-rosePrimary/15 shadow-md shadow-rosePrimary/[0.02] hover:shadow-lg hover:shadow-rosePrimary/10 transition-all duration-300 flex flex-col justify-between space-y-5 hover:-translate-y-1 transform"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-heading font-black text-sm text-wineDeep leading-tight flex items-center space-x-1">
                                <span>{review.customerName}</span>
                                <CheckCircle className="w-3.5 h-3.5 text-green-500 fill-green-500/10 shrink-0" />
                              </h4>
                              <span className="text-[9px] text-slate-400 font-light block mt-0.5">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-0.5 text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3.5 h-3.5 ${
                                    i < review.score 
                                      ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_2px_rgba(251,191,36,0.3)]' 
                                      : 'text-slate-100'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed font-light italic text-justify relative">
                            <span className="text-rosePrimary/15 text-4xl font-serif absolute -top-3.5 -left-1">“</span>
                            <span className="pl-4 inline-block">{review.reviewText || 'No review message left.'}</span>
                          </p>
                        </div>
                        {matchedDemo && (
                          <div className="pt-3.5 border-t border-rosePrimary/5 flex items-center justify-between text-[10px] text-slate-400">
                            <span>Design: <span className="font-bold text-rosePrimary">{matchedDemo.name}</span></span>
                            <span className="bg-rosePrimary/5 text-rosePrimary px-2.5 py-0.5 rounded-full border border-rosePrimary/10 font-bold uppercase tracking-wider text-[8px]">
                              Verified Client
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>



    </div>
  );
}

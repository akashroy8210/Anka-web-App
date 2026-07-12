import React, { useState, useEffect } from 'react';
import { api } from '../services/api.service';
import { Send, Check, AlertCircle, Sparkles, MessageCircle, Phone, Heart } from 'lucide-react';
import FloatingParticles from '../components/animations/FloatingParticles';
import { updateSEO } from '../utils/seo';

export default function OnDemand() {
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState('');

  useEffect(() => {
    updateSEO({
      title: "Custom On-Demand Surprises | Pyaar Ke Pal",
      description: "Kya aapke paas koi alag surprise idea hai? Humein bataiye! Humari team aapko custom website design aur real-time elements configure karne me help karegi.",
      keywords: "custom surprise, on-demand surprise website, surprise helper, personalized romance website"
    });
  }, []);

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

  return (
    <div className="min-h-screen bg-creamBase/25 pt-28 pb-20 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-rosePrimary/5 filter blur-3xl -z-10 animate-float-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blushAccent/10 filter blur-3xl -z-10 animate-float-reverse"></div>

      <FloatingParticles />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center">
            <span className="inline-flex items-center space-x-1.5 px-4.5 py-2 rounded-full bg-rosePrimary/10 border border-rosePrimary/15 text-rosePrimary text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-rosePrimary animate-pulse" />
              <span>Tailor-made Surprises ✨</span>
            </span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-wineDeep tracking-tight leading-none">
            On-Demand Services
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 font-light max-w-2xl mx-auto leading-relaxed">
            Have a unique surprise vision that isn't covered in our pre-designed templates? We are here to bring your custom design ideas to life!
          </p>
        </div>

        {/* Form and info split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-stretch">
          {/* Details side */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-white/70 backdrop-blur-md rounded-[32px] p-8 border border-rosePrimary/10 shadow-sm">
            <div className="space-y-6 text-left">
              <span className="text-xs font-black text-rosePrimary uppercase tracking-widest block">How it works</span>
              
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Submit Idea', desc: 'Briefly write down your surprise concepts, occasion types, or preferred animations.' },
                  { step: '2', title: 'Cupid Consultation', desc: 'Our team connects with you on WhatsApp or call to refine the custom layout design details.' },
                  { step: '3', title: 'Live Delivery', desc: 'We compile, verify, and host your private, custom interactive page!' }
                ].map((item) => (
                  <div key={item.step} className="flex space-x-4">
                    <div className="w-7 h-7 rounded-full bg-rosePrimary/10 text-rosePrimary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-heading font-bold text-sm text-wineDeep">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-left space-y-4">
              <span className="text-xs font-black text-rosePrimary uppercase tracking-widest block">Direct Connect</span>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/6206466429"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 py-3 bg-[#25D366] hover:bg-[#22c35e] text-white text-xs font-bold uppercase rounded-xl transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:+916206466429"
                  className="flex items-center justify-center space-x-2 py-3 border border-rosePrimary/20 hover:bg-slate-50 text-rosePrimary text-xs font-bold uppercase rounded-xl transition-all shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="lg:col-span-7">
            <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 md:p-10 border border-rosePrimary/20 shadow-xl h-full flex flex-col justify-center">
              {leadSuccess ? (
                <div className="text-center py-12 flex flex-col items-center space-y-5">
                  <div className="p-5 bg-green-50 border border-green-200 text-green-600 rounded-full animate-bounce">
                    <Check className="w-10 h-10 text-rosePrimary" />
                  </div>
                  <h3 className="font-heading font-black text-2xl text-wineDeep">Request Received!</h3>
                  <p className="text-sm text-slate-650 font-light leading-relaxed max-w-sm">
                    Thank you! Our Cupid consultants will connect with you via WhatsApp or call shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-6 text-left">
                  {leadError && (
                    <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-medium flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5" />
                      <span>{leadError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black text-wineDeep uppercase tracking-wider block mb-1.5">Aapka Naam</label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-rosePrimary/15 bg-creamBase/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-sm text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-wineDeep uppercase tracking-wider block mb-1.5">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="+91 99999 99999"
                        className="w-full px-4 py-3 border border-rosePrimary/15 bg-creamBase/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-sm text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-wineDeep uppercase tracking-wider block mb-1.5">Describe Your surprise Idea</label>
                    <textarea
                      rows="5"
                      required
                      value={leadMessage}
                      onChange={(e) => setLeadMessage(e.target.value)}
                      placeholder="e.g. I want to build a custom invitation card with remote virtual triggers, personal voice records and starlit layout..."
                      className="w-full px-4 py-3 border border-rosePrimary/15 bg-creamBase/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-sm text-slate-800 resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="w-full py-4 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 fill-white" />
                    <span>Humein Idea Bhejein 🚀</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

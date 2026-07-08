import React, { useState } from 'react';
import { Send, MessageCircle, Mail, MapPin, Check, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F6] via-[#FFF5F2] to-white pt-24 pb-16 relative">
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blushAccent/25 filter blur-3xl -z-10 animate-float-slow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="flex justify-center">
            <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-rosePrimary/10 border border-rosePrimary/15 text-rosePrimary text-xs font-extrabold uppercase tracking-widest">
              <span>Customer Care</span>
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-wineDeep tracking-tight">
            Contact AnKa
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 font-light">
            Have questions about setting up your surprise website, count-down loops, or billing? Reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
          
          {/* Contact Details (Left) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Details Box */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-rosePrimary/20 shadow-md shadow-rosePrimary/5 space-y-6">
              <h3 className="font-heading font-bold text-lg text-wineDeep uppercase tracking-wider mb-2">Get in Touch</h3>
              
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-rosePrimary/10 text-rosePrimary rounded-xl mt-1 shrink-0 animate-pulse-glow">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Us</h4>
                  <p className="text-base text-slate-800 font-semibold mt-1"><a href="mailto:akashroy73826@gmail.com" className="hover:text-rosePrimary">akashroy73826@gmail.com</a></p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-rosePrimary/10 text-rosePrimary rounded-xl mt-1 shrink-0 animate-pulse-glow">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Location</h4>
                  <p className="text-base text-slate-800 font-semibold mt-1">Assam Guwahati, India</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/916206466429?text=Hi! I have a question about setting up a surprise website on AnKa."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl shadow-md transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-heading font-bold text-sm tracking-wide">Chat on WhatsApp</h4>
                  <p className="text-[11px] text-white/80 font-light mt-0.5">Quick responses. Connect instantly!</p>
                </div>
              </div>
              <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </a>

          </div>

          {/* Contact Form (Right) */}
          <div className="lg:col-span-7">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-rosePrimary/20 shadow-md shadow-rosePrimary/5">
              
              {submitted ? (
                <div className="text-center py-12 flex flex-col items-center space-y-4">
                  <div className="p-4 bg-greenAccent/15 text-greenAccent rounded-full animate-bounce">
                    <Check className="w-10 h-10 text-rosePrimary" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-wineDeep">Message Sent!</h3>
                  <p className="text-sm text-slate-500 font-light leading-relaxed">
                    Thank you for reaching out, <span className="font-semibold text-slate-800">{formData.name}</span>. We will respond to your query at <span className="font-semibold text-slate-850">{formData.email}</span> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-heading font-bold text-lg text-wineDeep uppercase tracking-wider mb-2">Send Message</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 text-sm border border-rosePrimary/15 bg-creamBase/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 text-sm border border-rosePrimary/15 bg-creamBase/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="e.g. Help customizing my countdown timer"
                      className="w-full px-4 py-3 text-sm border border-rosePrimary/15 bg-creamBase/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Message</label>
                    <textarea
                      name="message"
                      rows="5"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Explain details of your question here..."
                      className="w-full px-4 py-3 text-sm border border-rosePrimary/15 bg-creamBase/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-sm hover:shadow-md transition-colors flex items-center justify-center space-x-1.5 focus:outline-none cursor-pointer"
                  >
                    <Send className="w-4 h-4 fill-white" />
                    <span>Send Query</span>
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

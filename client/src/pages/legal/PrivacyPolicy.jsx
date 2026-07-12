import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[32px] border border-rosePrimary/10 shadow-sm space-y-6 text-slate-700 font-light leading-relaxed">
        <h1 className="font-heading font-extrabold text-3xl text-[#4A0512]">Privacy Policy</h1>
        <p className="text-xs text-rosePrimary/70 font-semibold uppercase tracking-widest">Last Updated: July 2026</p>
        
        <p>
          At <strong>Pyaar Ke Pal (AnKa)</strong>, accessible from our surprise builder platforms, one of our main priorities is the privacy of our visitors and customers. This Privacy Policy document contains types of information that is collected and recorded by Pyaar Ke Pal and how we use it.
        </p>

        <h2 className="font-heading font-bold text-xl text-wineDeep">1. Information We Collect</h2>
        <p>
          We collect personal identification information from our customers during the checkout and customization process. This includes your name, email address, phone number, payment transaction details, recipient names, memory text entries, and personal media files (photos/audio notes) uploaded to render custom surprise mini-sites.
        </p>

        <h2 className="font-heading font-bold text-xl text-wineDeep">2. How We Use Your Information</h2>
        <p>
          We use the information we collect to generate, serve, and display your personalized surprise site pages, process your transactions securely via our payment gateways, send credentials/updates via email/SMS, and analyze interaction telemetry to optimize performance.
        </p>

        <h2 className="font-heading font-bold text-xl text-wineDeep">3. Media Upload Safety</h2>
        <p>
          Any media (images or audio clips) you upload are saved securely via third-party storage integrations (Cloudinary). These files are only served to recipients who visit your custom surprise URL. We do not index or list your pages publicly.
        </p>

        <h2 className="font-heading font-bold text-xl text-wineDeep">4. Contact Us</h2>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:akashroy73826@gmail.com" className="text-rosePrimary font-semibold hover:underline">akashroy73826@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}

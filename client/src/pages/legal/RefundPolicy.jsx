import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[32px] border border-rosePrimary/10 shadow-sm space-y-6 text-slate-700 font-light leading-relaxed">
        <h1 className="font-heading font-extrabold text-3xl text-[#4A0512]">Refund Policy</h1>
        <p className="text-xs text-rosePrimary/70 font-semibold uppercase tracking-widest">Last Updated: July 2026</p>
        
        <p>
          At <strong>Pyaar Ke Pal (AnKa)</strong>, we want to ensure you are 100% satisfied with the digital surprises you build for your loved ones. Please read our refund rules carefully:
        </p>

        <h2 className="font-heading font-bold text-xl text-wineDeep">1. Cancellation Window</h2>
        <p>
          Since our surprises are delivered instantly upon purchase (credentials are generated and sent via email immediately), refunds are generally not issued after credentials have been accessed or custom photos/details have been saved.
        </p>

        <h2 className="font-heading font-bold text-xl text-wineDeep">2. Eligibility for Refund</h2>
        <p>
          If you encounter any severe technical issues or system bugs that prevent the surprise from rendering or being customized, and our support team cannot resolve it within 7 days, we will issue a 100% refund.
        </p>

        <h2 className="font-heading font-bold text-xl text-wineDeep">3. Double Payments</h2>
        <p>
          If you were charged twice for a single surprise checkout order due to a payment gateway timeout, the duplicate transaction will be identified automatically and refunded back to your source account within 5-7 business days.
        </p>

        <h2 className="font-heading font-bold text-xl text-wineDeep">4. Requesting a Refund</h2>
        <p>
          To request a refund, please send an email to <a href="mailto:akashroy73826@gmail.com" className="text-rosePrimary font-semibold hover:underline">akashroy73826@gmail.com</a> with your booking Transaction ID and Surprise ID.
        </p>
      </div>
    </div>
  );
}

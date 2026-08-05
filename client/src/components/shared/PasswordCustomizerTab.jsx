import React from 'react';
import { Lock, ShieldCheck, Key, HelpCircle, Sparkles, Image as ImageIcon, Eye } from 'lucide-react';
import ReusableUploader from './ReusableUploader';

/**
 * Dedicated Customizer Tab for Password Protection Settings
 * Reusable across all surprise mini customizer panels
 */
export default function PasswordCustomizerTab({
  passwordEnabled = false,
  setPasswordEnabled = () => {},
  password = '',
  setPassword = () => {},
  passwordHint = '',
  setPasswordHint = () => {},
  unlockHeading = 'Unlock Your Surprise',
  setUnlockHeading = () => {},
  unlockSubtitle = 'This experience was created only for you.',
  setUnlockSubtitle = () => {},
  wrongPasswordMessage = 'I think your boyfriend remembers a different secret ❤️',
  setWrongPasswordMessage = () => {},
  successMessage = 'Access Granted! Unlocking your magical experience...',
  setSuccessMessage = () => {},
  enableNumericKeypad = true,
  setEnableNumericKeypad = () => {},
  backgroundImage = '',
  setBackgroundImage = () => {},
  tierName = 'Basic'
}) {
  return (
    <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6 text-left animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-rosePrimary/10 pb-4 gap-3">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-wineDeep flex items-center space-x-2">
            <Lock className="w-5 h-5 text-rosePrimary" />
            <span>Password Protection & Gateway Settings 🔒</span>
          </h3>
          <p className="text-xs text-slate-500 font-light mt-1">
            Lock your surprise behind a private PIN or passcode. Visitors must enter the correct code to enter.
          </p>
        </div>

        {/* Master Toggle */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={passwordEnabled}
            onChange={(e) => setPasswordEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rosePrimary" />
          <span className="ml-2.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            {passwordEnabled ? 'Locked 🔒' : 'Open Direct 🔓'}
          </span>
        </label>
      </div>

      {passwordEnabled ? (
        <div className="space-y-6 pt-2">
          
          {/* Secret Code Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                <Key className="w-4 h-4 text-rosePrimary" />
                <span>Secret Passcode / PIN *</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. 1402 or Love2024"
                className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800 font-mono"
              />
              <span className="text-[10px] text-slate-400 block">
                Can be a numeric PIN (e.g. 1234) or text password (e.g. Priye).
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Passcode Hint (Optional)</span>
              </label>
              <input
                type="text"
                value={passwordHint}
                onChange={(e) => setPasswordHint(e.target.value)}
                placeholder="e.g. Our anniversary date..."
                className="w-full px-4 py-3 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
              />
              <span className="text-[10px] text-slate-400 block">
                Shown if the recipient clicks "Need a hint?".
              </span>
            </div>
          </div>

          {/* Keypad Mode Toggle */}
          <div className="bg-rose-50/50 border border-rosePrimary/15 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-xs font-bold text-wineDeep uppercase tracking-wider block">
                Keypad Input Mode
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Choose 3D Luxury Heart Keypad (for numeric PINs) or standard text keyboard.
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEnableNumericKeypad(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  enableNumericKeypad
                    ? 'bg-rosePrimary text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Heart Keypad ❤
              </button>
              <button
                type="button"
                onClick={() => setEnableNumericKeypad(false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !enableNumericKeypad
                    ? 'bg-rosePrimary text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Text Input ⌨️
              </button>
            </div>
          </div>

          {/* Custom Headings & Subtitles */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-black uppercase text-wineDeep tracking-wider border-b pb-2">
              Customize Gateway Text & Messages
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Unlock Page Heading
                </label>
                <input
                  type="text"
                  value={unlockHeading}
                  onChange={(e) => setUnlockHeading(e.target.value)}
                  placeholder="e.g. Unlock Your Surprise"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Unlock Subtitle
                </label>
                <input
                  type="text"
                  value={unlockSubtitle}
                  onChange={(e) => setUnlockSubtitle(e.target.value)}
                  placeholder="e.g. This experience was created only for you."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Wrong Passcode Message
                </label>
                <input
                  type="text"
                  value={wrongPasswordMessage}
                  onChange={(e) => setWrongPasswordMessage(e.target.value)}
                  placeholder="e.g. That doesn't seem right ❤️"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Success Message
                </label>
                <input
                  type="text"
                  value={successMessage}
                  onChange={(e) => setSuccessMessage(e.target.value)}
                  placeholder="e.g. Access Granted! Unlocking..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Hero Cover Image Uploader */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-rosePrimary" />
              <span>Gateway Hero Artwork Image (Desktop Left Panel)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value)}
                placeholder="Paste Image URL or upload below..."
                className="w-full sm:flex-grow px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
              />
              <ReusableUploader
                accept="image/*"
                multiple={false}
                useAdminApi={true}
                label="Upload Cover Image"
                onUploadSuccess={(url) => setBackgroundImage(url)}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
          <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
          <h4 className="font-bold text-sm text-slate-800">Password Protection is Currently Disabled</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Visitors will open the surprise directly when clicking the link or scanning the QR code. Toggle the switch above to lock with a private PIN.
          </p>
        </div>
      )}

    </div>
  );
}

import React, { Component } from 'react';
import { Heart, RefreshCw, Home } from 'lucide-react';
import LivingBackground from '../animations/LivingBackground';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Boundary Caught Error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#08050f] text-rose-100 p-6 relative overflow-hidden select-none">
          <LivingBackground />
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-rose-600/10 filter blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-pink-600/10 filter blur-3xl" />

          <div className="w-full max-w-md p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 text-center animate-slide-up relative z-10">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-rose-400 fill-rose-550/20 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="font-romantic text-4xl text-white">Oops, Sweetheart!</h2>
              <p className="text-xs text-rose-200/50 leading-relaxed">
                Something didn't go quite as planned, but love is all about finding a way. Let's try reloading or going home!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span>Reload Page</span>
              </button>
              
              <a
                href="/"
                className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Home className="w-4 h-4" />
                <span>Go to Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

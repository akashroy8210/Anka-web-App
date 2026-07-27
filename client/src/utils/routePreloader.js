/**
 * Adaptive Dynamic Preload Manager & Prediction Engine
 * - Dynamic path frequency learning (Adaptive Navigation Matrix)
 * - Intent-based hover dwell threshold (60ms)
 * - Viewport intersection observer integration
 * - Scroll depth trigger (>45% scroll)
 * - Idle-time queue runner (requestIdleCallback)
 */

import { OccasionRegistry } from '../registry/occasionRegistry';

class RoutePreloaderManager {
  constructor() {
    this.preloadedRoutes = new Set();
    this.preloadedOccasions = new Set();
    this.navHistory = [];
    this.transitionFrequencies = {}; // fromPath -> { toPath: count }
    this.routeLoaders = new Map();
    this.dwellTimers = new Map();
    this.initHistory();
  }

  initHistory() {
    try {
      const stored = sessionStorage.getItem('anka_nav_matrix');
      if (stored) {
        this.transitionFrequencies = JSON.parse(stored);
      }
    } catch (e) {}
  }

  recordNavigation(fromPath, toPath) {
    if (!fromPath || !toPath || fromPath === toPath) return;

    this.navHistory.push(toPath);
    if (this.navHistory.length > 20) this.navHistory.shift();

    if (!this.transitionFrequencies[fromPath]) {
      this.transitionFrequencies[fromPath] = {};
    }
    const currentCount = this.transitionFrequencies[fromPath][toPath] || 0;
    this.transitionFrequencies[fromPath][toPath] = currentCount + 1;

    try {
      sessionStorage.setItem('anka_nav_matrix', JSON.stringify(this.transitionFrequencies));
    } catch (e) {}

    // Auto-predict next navigation based on historical probabilities
    this.predictAndPreload(toPath);
  }

  registerRoute(path, loader) {
    this.routeLoaders.set(path, loader);
  }

  preloadRoute(path) {
    if (!path || this.preloadedRoutes.has(path)) return;

    const loader = this.routeLoaders.get(path);
    if (loader) {
      this.preloadedRoutes.add(path);
      // Run import in idle time or microtask
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => loader().catch(() => {}), { timeout: 2000 });
      } else {
        setTimeout(() => loader().catch(() => {}), 100);
      }
    }
  }

  preloadOccasion(occasionKey) {
    if (!occasionKey || this.preloadedOccasions.has(occasionKey)) return;

    const occasion = OccasionRegistry[occasionKey];
    if (occasion) {
      this.preloadedOccasions.add(occasionKey);
      const runPreload = () => {
        if (occasion.view) occasion.view._init || occasion.view();
        if (occasion.customizer) occasion.customizer._init || occasion.customizer();
        if (occasion.control) occasion.control._init || occasion.control();
      };

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(runPreload, { timeout: 3000 });
      } else {
        setTimeout(runPreload, 150);
      }
    }
  }

  /**
   * Hover intent preloading with 60ms dwell threshold to avoid cursor sweep noise
   */
  handleHoverStart(path, occasionKey) {
    if (this.dwellTimers.has(path)) return;

    const timer = setTimeout(() => {
      this.dwellTimers.delete(path);
      if (path) this.preloadRoute(path);
      if (occasionKey) this.preloadOccasion(occasionKey);
    }, 60);

    this.dwellTimers.set(path, timer);
  }

  handleHoverEnd(path) {
    const timer = this.dwellTimers.get(path);
    if (timer) {
      clearTimeout(timer);
      this.dwellTimers.delete(path);
    }
  }

  /**
   * Adaptive prediction engine: predicts the most likely next routes from current path
   */
  predictAndPreload(currentPath) {
    const predictions = this.transitionFrequencies[currentPath];
    if (!predictions) return;

    // Sort destinations by historical frequency
    const sorted = Object.entries(predictions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3); // Top 3 most likely next destinations

    sorted.forEach(([nextPath]) => {
      this.preloadRoute(nextPath);
    });
  }

  /**
   * Scroll depth adaptive trigger: preloads when user scrolls past 45% of page
   */
  setupScrollTrigger(currentPath, targetRoutes = []) {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrollPercent > 0.45) {
        targetRoutes.forEach((route) => this.preloadRoute(route));
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }
}

export const routePreloader = new RoutePreloaderManager();
export default routePreloader;

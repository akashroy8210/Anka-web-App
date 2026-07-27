/**
 * Scroll Coordinates & State Persistence Manager
 * Saves and restores scroll positions and view states per path.
 */

class ScrollStateManager {
  constructor() {
    this.positions = new Map();
    this.states = new Map();
    this.initFromStorage();
  }

  initFromStorage() {
    try {
      const storedPos = sessionStorage.getItem('anka_scroll_pos');
      if (storedPos) {
        const parsed = JSON.parse(storedPos);
        Object.entries(parsed).forEach(([key, value]) => this.positions.set(key, value));
      }
    } catch (e) {}
  }

  saveScrollPosition(path = window.location.pathname) {
    if (!path) return;
    const pos = { x: window.scrollX, y: window.scrollY };
    this.positions.set(path, pos);

    try {
      const obj = {};
      this.positions.forEach((v, k) => (obj[k] = v));
      sessionStorage.setItem('anka_scroll_pos', JSON.stringify(obj));
    } catch (e) {}
  }

  restoreScrollPosition(path = window.location.pathname) {
    const pos = this.positions.get(path);
    if (pos) {
      setTimeout(() => {
        window.scrollTo({ left: pos.x, top: pos.y, behavior: 'instant' });
      }, 20);
      return true;
    }
    return false;
  }

  savePageState(path, stateObj) {
    if (!path || !stateObj) return;
    this.states.set(path, { ...this.states.get(path), ...stateObj });
  }

  getPageState(path = window.location.pathname) {
    return this.states.get(path) || {};
  }
}

export const scrollState = new ScrollStateManager();

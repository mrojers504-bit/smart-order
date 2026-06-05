import { create } from 'zustand';

const API = process.env.REACT_APP_API_URL || '';

const SCREENS = {
  WELCOME: 'welcome',
  SCENARIOS: 'scenarios',
  COMBOS: 'combos',
  CONFIRM: 'confirm',
  SUCCESS: 'success',
  CART: 'cart',
  PAYMENT: 'payment',
};

const useStore = create((set, get) => ({
  screen: SCREENS.WELCOME,
  selectedScenario: null,
  scenarios: [],
  combos: [],
  selectedCombo: null,
  cart: [],
  orderPending: false,
  loading: false,
  error: null,

  setScreen: (screen) => set({ screen }),

  setScenario: (scenario) => set({ selectedScenario: scenario, screen: SCREENS.COMBOS }),

  selectCombo: (combo) => set({ selectedCombo: combo, screen: SCREENS.CONFIRM }),

  addToCart: async () => {
    const { selectedCombo, cart, orderPending } = get();
    if (!selectedCombo || orderPending) return;

    set({ orderPending: true });
    const newCart = [...cart, selectedCombo];
    set({ cart: newCart, screen: SCREENS.CART });

    try {
      const items = selectedCombo.items.map((i) => ({
        productId: i.id,
        quantity: 1,
      }));
      await fetch(`${API}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
    } catch (e) {
      console.warn('Order POST failed:', e.message);
    } finally {
      set({ orderPending: false });
    }
  },

  fetchScenarios: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/api/scenarios`);
      if (!res.ok) throw new Error('Failed to load scenarios');
      const data = await res.json();
      set({ scenarios: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchCombos: async (type) => {
    set({ loading: true, error: null, combos: [] });
    try {
      const res = await fetch(`${API}/api/scenarios?type=${type}`);
      if (!res.ok) throw new Error('Failed to load combos');
      const data = await res.json();
      set({ combos: data.combos || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  reset: () =>
    set({
      screen: SCREENS.WELCOME,
      selectedScenario: null,
      selectedCombo: null,
      combos: [],
    }),

  SCREENS,
}));

export default useStore;

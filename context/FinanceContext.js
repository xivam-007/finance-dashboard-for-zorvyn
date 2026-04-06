import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { INITIAL_TRANSACTIONS, ROLES } from '../data/mockData';
import { format } from 'date-fns';

const FinanceContext = createContext(null);

const STORAGE_KEY = 'finance_dashboard_state';

const initialState = {
  transactions: INITIAL_TRANSACTIONS,
  role: 'ADMIN',
  darkMode: false,
  filters: {
    search: '',
    type: 'all',
    category: 'all',
    dateRange: '6months',
    sortBy: 'date',
    sortOrder: 'desc',
  },
  ui: {
    activeTab: 'dashboard',
    chartView: 'area',
    transactionModal: { open: false, transaction: null },
    deleteConfirm: { open: false, id: null },
  },
};

function financeReducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };

    case 'SET_ACTIVE_TAB':
      return { ...state, ui: { ...state.ui, activeTab: action.payload } };

    case 'SET_CHART_VIEW':
      return { ...state, ui: { ...state.ui, chartView: action.payload } };

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, [action.key]: action.value } };

    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };

    case 'ADD_TRANSACTION': {
      const newTx = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        date: action.payload.date || format(new Date(), 'yyyy-MM-dd'),
      };
      return { ...state, transactions: [newTx, ...state.transactions] };
    }

    case 'EDIT_TRANSACTION': {
      const updated = state.transactions.map(tx =>
        tx.id === action.payload.id ? { ...tx, ...action.payload } : tx
      );
      return { ...state, transactions: updated };
    }

    case 'DELETE_TRANSACTION': {
      const filtered = state.transactions.filter(tx => tx.id !== action.payload);
      return { ...state, transactions: filtered };
    }

    case 'OPEN_TRANSACTION_MODAL':
      return { ...state, ui: { ...state.ui, transactionModal: { open: true, transaction: action.payload || null } } };

    case 'CLOSE_TRANSACTION_MODAL':
      return { ...state, ui: { ...state.ui, transactionModal: { open: false, transaction: null } } };

    case 'OPEN_DELETE_CONFIRM':
      return { ...state, ui: { ...state.ui, deleteConfirm: { open: true, id: action.payload } } };

    case 'CLOSE_DELETE_CONFIRM':
      return { ...state, ui: { ...state.ui, deleteConfirm: { open: false, id: null } } };

    case 'LOAD_STATE':
      return { ...action.payload, ui: initialState.ui };

    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsed } });
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      const { ui, ...persistable } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }, [state]);

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
  }, [state.darkMode]);

  const setRole = useCallback((role) => dispatch({ type: 'SET_ROLE', payload: role }), []);
  const toggleDarkMode = useCallback(() => dispatch({ type: 'TOGGLE_DARK_MODE' }), []);
  const setActiveTab = useCallback((tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }), []);
  const setFilter = useCallback((key, value) => dispatch({ type: 'SET_FILTER', key, value }), []);
  const resetFilters = useCallback(() => dispatch({ type: 'RESET_FILTERS' }), []);
  const addTransaction = useCallback((tx) => dispatch({ type: 'ADD_TRANSACTION', payload: tx }), []);
  const editTransaction = useCallback((tx) => dispatch({ type: 'EDIT_TRANSACTION', payload: tx }), []);
  const deleteTransaction = useCallback((id) => dispatch({ type: 'DELETE_TRANSACTION', payload: id }), []);
  const openTransactionModal = useCallback((tx) => dispatch({ type: 'OPEN_TRANSACTION_MODAL', payload: tx }), []);
  const closeTransactionModal = useCallback(() => dispatch({ type: 'CLOSE_TRANSACTION_MODAL' }), []);
  const openDeleteConfirm = useCallback((id) => dispatch({ type: 'OPEN_DELETE_CONFIRM', payload: id }), []);
  const closeDeleteConfirm = useCallback(() => dispatch({ type: 'CLOSE_DELETE_CONFIRM' }), []);
  const setChartView = useCallback((view) => dispatch({ type: 'SET_CHART_VIEW', payload: view }), []);


  const isAdmin = state.role === 'ADMIN';

  return (
    <FinanceContext.Provider value={{
      state,
      dispatch,
      isAdmin,
      setRole,
      toggleDarkMode,
      setActiveTab,
      setFilter,
      resetFilters,
      addTransaction,
      editTransaction,
      deleteTransaction,
      openTransactionModal,
      closeTransactionModal,
      openDeleteConfirm,
      closeDeleteConfirm,
      setChartView,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}

import { subDays, subMonths, format } from 'date-fns';

export const CATEGORIES = {
  FOOD: { label: 'Food & Dining', icon: '🍽️', color: '#FF6B6B' },
  TRANSPORT: { label: 'Transport', icon: '🚗', color: '#4ECDC4' },
  SHOPPING: { label: 'Shopping', icon: '🛍️', color: '#45B7D1' },
  HEALTH: { label: 'Health', icon: '💊', color: '#96CEB4' },
  ENTERTAINMENT: { label: 'Entertainment', icon: '🎬', color: '#FFEAA7' },
  UTILITIES: { label: 'Utilities', icon: '⚡', color: '#DDA0DD' },
  RENT: { label: 'Rent & Housing', icon: '🏠', color: '#F0A500' },
  INCOME: { label: 'Income', icon: '💰', color: '#6BCB77' },
  FREELANCE: { label: 'Freelance', icon: '💻', color: '#4D96FF' },
  INVESTMENT: { label: 'Investment', icon: '📈', color: '#C77DFF' },
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const INITIAL_TRANSACTIONS = [
  // Current month income
  { id: generateId(), date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 85000, category: 'INCOME', type: 'income', note: 'Q2 salary credit' },
  { id: generateId(), date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), description: 'Freelance Project - UI Design', amount: 18500, category: 'FREELANCE', type: 'income', note: 'E-commerce redesign' },
  { id: generateId(), date: format(subDays(new Date(), 10), 'yyyy-MM-dd'), description: 'Dividend Income', amount: 4200, category: 'INVESTMENT', type: 'income', note: 'Q1 dividends' },

  // Current month expenses
  { id: generateId(), date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), description: 'House Rent', amount: 22000, category: 'RENT', type: 'expense', note: 'April rent' },
  { id: generateId(), date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), description: 'Grocery Shopping', amount: 3800, category: 'FOOD', type: 'expense', note: 'Big Basket order' },
  { id: generateId(), date: format(subDays(new Date(), 4), 'yyyy-MM-dd'), description: 'Uber / Ola Rides', amount: 1200, category: 'TRANSPORT', type: 'expense', note: 'Weekly commute' },
  { id: generateId(), date: format(subDays(new Date(), 6), 'yyyy-MM-dd'), description: 'Zomato Orders', amount: 2400, category: 'FOOD', type: 'expense', note: 'Dinner deliveries' },
  { id: generateId(), date: format(subDays(new Date(), 7), 'yyyy-MM-dd'), description: 'Amazon Shopping', amount: 5600, category: 'SHOPPING', type: 'expense', note: 'Electronics & misc' },
  { id: generateId(), date: format(subDays(new Date(), 8), 'yyyy-MM-dd'), description: 'Netflix + Spotify', amount: 899, category: 'ENTERTAINMENT', type: 'expense', note: 'Subscriptions' },
  { id: generateId(), date: format(subDays(new Date(), 9), 'yyyy-MM-dd'), description: 'Electricity Bill', amount: 2100, category: 'UTILITIES', type: 'expense', note: 'BSES April' },
  { id: generateId(), date: format(subDays(new Date(), 11), 'yyyy-MM-dd'), description: 'Gym Membership', amount: 2500, category: 'HEALTH', type: 'expense', note: 'Monthly fee' },
  { id: generateId(), date: format(subDays(new Date(), 12), 'yyyy-MM-dd'), description: 'Doctor Consultation', amount: 800, category: 'HEALTH', type: 'expense', note: 'Dermatologist' },
  { id: generateId(), date: format(subDays(new Date(), 14), 'yyyy-MM-dd'), description: 'Movie + Dinner', amount: 1800, category: 'ENTERTAINMENT', type: 'expense', note: 'Weekend outing' },
  { id: generateId(), date: format(subDays(new Date(), 16), 'yyyy-MM-dd'), description: 'Petrol', amount: 1500, category: 'TRANSPORT', type: 'expense', note: 'Full tank' },
  { id: generateId(), date: format(subDays(new Date(), 18), 'yyyy-MM-dd'), description: 'Internet Bill', amount: 999, category: 'UTILITIES', type: 'expense', note: 'Airtel broadband' },

  // Last month
  { id: generateId(), date: format(subMonths(new Date(), 1), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 85000, category: 'INCOME', type: 'income', note: 'March salary' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 1), 5), 'yyyy-MM-dd'), description: 'Freelance - App Dev', amount: 24000, category: 'FREELANCE', type: 'income', note: 'Mobile app project' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 1), 3), 'yyyy-MM-dd'), description: 'House Rent', amount: 22000, category: 'RENT', type: 'expense', note: 'March rent' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 1), 7), 'yyyy-MM-dd'), description: 'Grocery Shopping', amount: 4200, category: 'FOOD', type: 'expense', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 1), 10), 'yyyy-MM-dd'), description: 'Flight Tickets', amount: 12000, category: 'TRANSPORT', type: 'expense', note: 'Mumbai trip' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 1), 12), 'yyyy-MM-dd'), description: 'Hotel Stay', amount: 8500, category: 'ENTERTAINMENT', type: 'expense', note: 'Mumbai hotel' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 1), 15), 'yyyy-MM-dd'), description: 'Shopping - Clothes', amount: 7200, category: 'SHOPPING', type: 'expense', note: 'Season sale' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 1), 18), 'yyyy-MM-dd'), description: 'Electricity Bill', amount: 1800, category: 'UTILITIES', type: 'expense', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 1), 20), 'yyyy-MM-dd'), description: 'Medical Tests', amount: 2200, category: 'HEALTH', type: 'expense', note: 'Annual checkup' },

  // 2 months ago
  { id: generateId(), date: format(subMonths(new Date(), 2), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 85000, category: 'INCOME', type: 'income', note: 'February salary' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 2), 5), 'yyyy-MM-dd'), description: 'Freelance - Branding', amount: 15000, category: 'FREELANCE', type: 'income', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 2), 3), 'yyyy-MM-dd'), description: 'House Rent', amount: 22000, category: 'RENT', type: 'expense', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 2), 8), 'yyyy-MM-dd'), description: 'Valentine Dinner', amount: 3500, category: 'FOOD', type: 'expense', note: 'Special occasion' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 2), 12), 'yyyy-MM-dd'), description: 'Grocery Shopping', amount: 3600, category: 'FOOD', type: 'expense', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 2), 15), 'yyyy-MM-dd'), description: 'Gadget Purchase', amount: 14500, category: 'SHOPPING', type: 'expense', note: 'Wireless earbuds' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 2), 18), 'yyyy-MM-dd'), description: 'Electricity Bill', amount: 1650, category: 'UTILITIES', type: 'expense', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 2), 22), 'yyyy-MM-dd'), description: 'SIP Investment', amount: 10000, category: 'INVESTMENT', type: 'expense', note: 'Mutual fund SIP' },

  // 3 months ago
  { id: generateId(), date: format(subMonths(new Date(), 3), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 85000, category: 'INCOME', type: 'income', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 3), 7), 'yyyy-MM-dd'), description: 'Year End Bonus', amount: 40000, category: 'INCOME', type: 'income', note: 'Performance bonus' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 3), 4), 'yyyy-MM-dd'), description: 'House Rent', amount: 22000, category: 'RENT', type: 'expense', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 3), 9), 'yyyy-MM-dd'), description: 'New Year Party', amount: 5500, category: 'ENTERTAINMENT', type: 'expense', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 3), 14), 'yyyy-MM-dd'), description: 'Grocery Shopping', amount: 5100, category: 'FOOD', type: 'expense', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 3), 20), 'yyyy-MM-dd'), description: 'Laptop Accessories', amount: 8900, category: 'SHOPPING', type: 'expense', note: '' },

  // 4 months ago
  { id: generateId(), date: format(subMonths(new Date(), 4), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 80000, category: 'INCOME', type: 'income', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 4), 5), 'yyyy-MM-dd'), description: 'Freelance Project', amount: 20000, category: 'FREELANCE', type: 'income', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 4), 3), 'yyyy-MM-dd'), description: 'House Rent', amount: 22000, category: 'RENT', type: 'expense', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 4), 10), 'yyyy-MM-dd'), description: 'Festival Shopping', amount: 9800, category: 'SHOPPING', type: 'expense', note: 'Diwali gifts' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 4), 15), 'yyyy-MM-dd'), description: 'Restaurant Bills', amount: 4200, category: 'FOOD', type: 'expense', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 4), 18), 'yyyy-MM-dd'), description: 'Electricity Bill', amount: 2300, category: 'UTILITIES', type: 'expense', note: '' },

  // 5 months ago
  { id: generateId(), date: format(subMonths(new Date(), 5), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 80000, category: 'INCOME', type: 'income', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 5), 5), 'yyyy-MM-dd'), description: 'House Rent', amount: 22000, category: 'RENT', type: 'expense', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 5), 10), 'yyyy-MM-dd'), description: 'Grocery Shopping', amount: 3900, category: 'FOOD', type: 'expense', note: '' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 5), 14), 'yyyy-MM-dd'), description: 'Health Insurance', amount: 8000, category: 'HEALTH', type: 'expense', note: 'Annual premium' },
  { id: generateId(), date: format(subDays(subMonths(new Date(), 5), 20), 'yyyy-MM-dd'), description: 'Weekend Trip', amount: 6500, category: 'ENTERTAINMENT', type: 'expense', note: 'Goa weekend' },
];

export const ROLES = {
  ADMIN: { label: 'Admin', icon: '👑', description: 'Full access - can add, edit & delete transactions' },
  VIEWER: { label: 'Viewer', icon: '👁️', description: 'Read-only access - can view data only' },
};

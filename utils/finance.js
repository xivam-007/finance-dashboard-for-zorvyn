import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO, subDays } from 'date-fns';
import { CATEGORIES } from '../data/mockData';

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyShort(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

export function getFilteredTransactions(transactions, filters) {
  let result = [...transactions];

  // Date range filter
  const now = new Date();
  if (filters.dateRange !== 'all') {
    const months = parseInt(filters.dateRange);
    const cutoff = subMonths(now, months);
    result = result.filter(tx => parseISO(tx.date) >= cutoff);
  }

  // Type filter
  if (filters.type !== 'all') {
    result = result.filter(tx => tx.type === filters.type);
  }

  // Category filter
  if (filters.category !== 'all') {
    result = result.filter(tx => tx.category === filters.category);
  }

  // Search filter
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(tx =>
      tx.description.toLowerCase().includes(q) ||
      tx.category.toLowerCase().includes(q) ||
      (tx.note && tx.note.toLowerCase().includes(q))
    );
  }

  // Sorting
  result.sort((a, b) => {
    let valA, valB;
    switch (filters.sortBy) {
      case 'date':
        valA = new Date(a.date);
        valB = new Date(b.date);
        break;
      case 'amount':
        valA = a.amount;
        valB = b.amount;
        break;
      case 'description':
        valA = a.description.toLowerCase();
        valB = b.description.toLowerCase();
        break;
      default:
        valA = new Date(a.date);
        valB = new Date(b.date);
    }
    if (filters.sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  return result;
}

export function getSummaryStats(transactions) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  return { totalIncome, totalExpenses, balance };
}

export function getMonthlyData(transactions, months = 6) {
  const now = new Date();
  const data = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const monthTxs = transactions.filter(tx => {
      const d = parseISO(tx.date);
      return isWithinInterval(d, { start, end });
    });

    const income = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    data.push({
      month: format(date, 'MMM'),
      fullMonth: format(date, 'MMMM yyyy'),
      income,
      expenses,
      savings: income - expenses,
    });
  }

  return data;
}

export function getCategoryBreakdown(transactions) {
  const expensesByCategory = {};

  transactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
    });

  return Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category,
      label: CATEGORIES[category]?.label || category,
      icon: CATEGORIES[category]?.icon || '💳',
      color: CATEGORIES[category]?.color || '#888',
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getInsights(transactions, allTransactions) {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const currentMonthTxs = allTransactions.filter(tx =>
    isWithinInterval(parseISO(tx.date), { start: currentMonthStart, end: currentMonthEnd })
  );
  const lastMonthTxs = allTransactions.filter(tx =>
    isWithinInterval(parseISO(tx.date), { start: lastMonthStart, end: lastMonthEnd })
  );

  const currentExpenses = currentMonthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const lastExpenses = lastMonthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const currentIncome = currentMonthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const lastIncome = lastMonthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  const categoryBreakdown = getCategoryBreakdown(transactions);
  const highestCategory = categoryBreakdown[0];
  const savingsRate = currentIncome > 0 ? ((currentIncome - currentExpenses) / currentIncome) * 100 : 0;

  const expenseChange = lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0;
  const incomeChange = lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0;

  return {
    highestCategory,
    categoryBreakdown,
    savingsRate,
    expenseChange,
    incomeChange,
    currentExpenses,
    lastExpenses,
    currentIncome,
    lastIncome,
  };
}

export function exportToCSV(transactions) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (₹)', 'Note'];
  const rows = transactions.map(tx => [
    tx.date,
    `"${tx.description}"`,
    CATEGORIES[tx.category]?.label || tx.category,
    tx.type,
    tx.amount,
    `"${tx.note || ''}"`,
  ]);

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(transactions) {
  const data = JSON.stringify(transactions, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

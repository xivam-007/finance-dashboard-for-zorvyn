import { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { getSummaryStats } from '../../utils/finance';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

function StatCard({ label, amount, icon, type, change, changeLabel }) {
  const isPositive = change >= 0;

  return (
    <div className={`summary-card ${type}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-label">{label}</div>
      <div className="card-amount" style={{ fontFamily: 'var(--font-mono)' }}>
        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)}
      </div>
      {change !== undefined && (
        <div className={`card-change ${isPositive ? 'text-positive' : 'text-negative'}`}>
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(change).toFixed(1)}% {changeLabel}</span>
        </div>
      )}
    </div>
  );
}

export default function SummaryCards() {
  const { state } = useFinance();

  const { current, previous } = useMemo(() => {
    const now = new Date();
    const currStart = startOfMonth(now);
    const currEnd = endOfMonth(now);
    const prevStart = startOfMonth(subMonths(now, 1));
    const prevEnd = endOfMonth(subMonths(now, 1));

    const currTxs = state.transactions.filter(tx =>
      isWithinInterval(parseISO(tx.date), { start: currStart, end: currEnd })
    );
    const prevTxs = state.transactions.filter(tx =>
      isWithinInterval(parseISO(tx.date), { start: prevStart, end: prevEnd })
    );

    return { current: getSummaryStats(currTxs), previous: getSummaryStats(prevTxs) };
  }, [state.transactions]);

  const allStats = useMemo(() => getSummaryStats(state.transactions), [state.transactions]);

  const incomeChange = previous.totalIncome > 0
    ? ((current.totalIncome - previous.totalIncome) / previous.totalIncome) * 100 : 0;
  const expenseChange = previous.totalExpenses > 0
    ? ((current.totalExpenses - previous.totalExpenses) / previous.totalExpenses) * 100 : 0;

  return (
    <div className="summary-grid">
      <StatCard
        label="Total Balance"
        amount={allStats.balance}
        icon="💳"
        type="balance"
      />
      <StatCard
        label={`Income · ${format(new Date(), 'MMM yyyy')}`}
        amount={current.totalIncome}
        icon="💰"
        type="income"
        change={incomeChange}
        changeLabel="vs last month"
      />
      <StatCard
        label={`Expenses · ${format(new Date(), 'MMM yyyy')}`}
        amount={current.totalExpenses}
        icon="📤"
        type="expense"
        change={expenseChange}
        changeLabel="vs last month"
      />
    </div>
  );
}

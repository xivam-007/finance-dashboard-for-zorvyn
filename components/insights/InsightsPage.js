import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { getInsights, getCategoryBreakdown, getMonthlyData, formatCurrency } from '../../utils/finance';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

function InsightCard({ emoji, title, value, subtitle, accent }) {
  return (
    <div className="insight-card">
      <div style={{ fontSize: 28, marginBottom: 12 }}>{emoji}</div>
      <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 8 }}>
        {title}
      </div>
      <div className="insight-value" style={{ color: accent || 'var(--text-primary)' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-lg)', fontSize: 13,
    }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, color: p.color }}>
          <span style={{ textTransform: 'capitalize' }}>{p.dataKey}</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function InsightsPage() {
  const { state } = useFinance();

  const now = new Date();
  const monthTxs = useMemo(() => state.transactions.filter(tx =>
    isWithinInterval(parseISO(tx.date), { start: startOfMonth(now), end: endOfMonth(now) })
  ), [state.transactions]);

  const insights = useMemo(() => getInsights(monthTxs, state.transactions), [monthTxs, state.transactions]);
  const monthlyData = useMemo(() => getMonthlyData(state.transactions, 6), [state.transactions]);
  const catBreakdown = useMemo(() => getCategoryBreakdown(state.transactions).slice(0, 8), [state.transactions]);

  const savingsRateColor = insights.savingsRate >= 30 ? 'var(--accent-green)' : insights.savingsRate >= 10 ? 'var(--accent-gold)' : 'var(--accent-red)';

  return (
    <div>
      {/* KPI cards */}
      <div className="insights-grid" style={{ marginBottom: 16 }}>
        <InsightCard
          emoji={insights.highestCategory?.icon || '📊'}
          title="Highest Spending Category"
          value={insights.highestCategory?.label || 'N/A'}
          subtitle={insights.highestCategory ? formatCurrency(insights.highestCategory.amount) + ' this period' : ''}
          accent="var(--text-primary)"
        />
        <InsightCard
          emoji="💰"
          title="Savings Rate This Month"
          value={`${insights.savingsRate.toFixed(1)}%`}
          subtitle={insights.savingsRate >= 20 ? '✅ On track — great job!' : '⚠️ Try to save at least 20%'}
          accent={savingsRateColor}
        />
        <InsightCard
          emoji={insights.expenseChange >= 0 ? '📈' : '📉'}
          title="Expense Change vs Last Month"
          value={`${insights.expenseChange >= 0 ? '+' : ''}${insights.expenseChange.toFixed(1)}%`}
          subtitle={insights.expenseChange < 0 ? '↓ Good — spending decreased!' : '↑ Spending increased this month'}
          accent={insights.expenseChange < 0 ? 'var(--accent-green)' : 'var(--accent-red)'}
        />
        <InsightCard
          emoji={insights.incomeChange >= 0 ? '🚀' : '⚡'}
          title="Income Change vs Last Month"
          value={`${insights.incomeChange >= 0 ? '+' : ''}${insights.incomeChange.toFixed(1)}%`}
          subtitle={`This month: ${formatCurrency(insights.currentIncome)}`}
          accent={insights.incomeChange >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}
        />
      </div>

      {/* Monthly Comparison Bar Chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div className="card-title">Monthly Income vs Expenses</div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>6-month comparison</span>
        </div>
        <div className="card-body">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="income" fill="#4a9b6f" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expenses" fill="#d4635a" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category spending breakdown */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Spending by Category</div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>All time · top 8</span>
        </div>
        <div className="card-body">
          {catBreakdown.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-icon">📊</div>
              <div className="empty-title">No expense data</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {catBreakdown.map((item) => {
                const max = catBreakdown[0].amount;
                const pct = (item.amount / max) * 100;
                return (
                  <div key={item.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          width: 30, height: 30, borderRadius: 'var(--radius-sm)',
                          background: `${item.color}22`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 15,
                        }}>
                          {item.icon}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${pct}%`, background: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useFinance } from '../../context/FinanceContext';
import SummaryCards from './SummaryCards';
import BalanceTrendChart from './BalanceTrendChart';
import SpendingBreakdown from './SpendingBreakdown';
import RecentTransactions from './RecentTransactions';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { state, isAdmin, openTransactionModal } = useFinance();

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">
            {format(new Date(), 'EEEE, MMMM do yyyy')} · {state.role === 'ADMIN' ? 'Admin' : 'Viewer'}
          </div>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => openTransactionModal()}>
            + Add Transaction
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts */}
      <div className="charts-grid">
        <BalanceTrendChart />
        <SpendingBreakdown />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}

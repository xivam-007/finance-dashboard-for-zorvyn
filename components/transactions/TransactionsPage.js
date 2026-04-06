import { useFinance } from '../../context/FinanceContext';
import FilterBar from './FilterBar';
import TransactionTable from './TransactionTable';
import TransactionModal from './TransactionModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function TransactionsPage() {
  const { isAdmin, openTransactionModal } = useFinance();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">Transactions</div>
          <div className="page-subtitle">Search, filter and manage your transactions</div>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => openTransactionModal()}>
            + Add Transaction
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FilterBar />
        <TransactionTable />
      </div>

      <TransactionModal />
      <DeleteConfirmModal />
    </div>
  );
}

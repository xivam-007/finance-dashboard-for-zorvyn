import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../data/mockData';
import { exportToCSV, exportToJSON, getFilteredTransactions } from '../../utils/finance';

export default function FilterBar() {
  const { state, setFilter, resetFilters, isAdmin, openTransactionModal } = useFinance();
  const { filters } = state;

  const allCategories = Object.entries(CATEGORIES);
  const activeFilterCount = [
    filters.search, filters.type !== 'all', filters.category !== 'all', filters.dateRange !== '6months'
  ].filter(Boolean).length;

  const filtered = getFilteredTransactions(state.transactions, filters);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="filter-bar">
        {/* Search */}
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="form-input"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
          />
        </div>

        {/* Type */}
        <div style={{ position: 'relative' }}>
          <select
            className="form-select"
            style={{ paddingRight: 28, minWidth: 130 }}
            value={filters.type}
            onChange={e => setFilter('type', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">↑ Income</option>
            <option value="expense">↓ Expense</option>
          </select>
        </div>

        {/* Category */}
        <div style={{ position: 'relative' }}>
          <select
            className="form-select"
            style={{ paddingRight: 28, minWidth: 160 }}
            value={filters.category}
            onChange={e => setFilter('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {allCategories.map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div style={{ position: 'relative' }}>
          <select
            className="form-select"
            style={{ paddingRight: 28, minWidth: 140 }}
            value={filters.dateRange}
            onChange={e => setFilter('dateRange', e.target.value)}
          >
            <option value="1">Last 1 Month</option>
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Sort */}
        <div style={{ position: 'relative' }}>
          <select
            className="form-select"
            style={{ paddingRight: 28, minWidth: 140 }}
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={e => {
              const [by, order] = e.target.value.split('-');
              setFilter('sortBy', by);
              setFilter('sortOrder', order);
            }}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="description-asc">A → Z</option>
            <option value="description-desc">Z → A</option>
          </select>
        </div>

        {activeFilterCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={resetFilters}>
            ✕ Reset ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Action Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => exportToCSV(filtered)}
            title="Export as CSV"
          >
            ↓ CSV
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => exportToJSON(filtered)}
            title="Export as JSON"
          >
            ↓ JSON
          </button>
          {isAdmin && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => openTransactionModal()}
            >
              + Add Transaction
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

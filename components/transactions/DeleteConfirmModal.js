import { useFinance } from '../../context/FinanceContext';

export default function DeleteConfirmModal() {
  const { state, closeDeleteConfirm, deleteTransaction } = useFinance();
  const { open, id } = state.ui.deleteConfirm;

  if (!open) return null;

  const handleConfirm = () => {
    deleteTransaction(id);
    closeDeleteConfirm();
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeDeleteConfirm(); }}>
      <div className="modal" style={{ maxWidth: 380 }}>
        <div className="modal-body" style={{ padding: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            Delete Transaction?
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
            This action cannot be undone. The transaction will be permanently removed.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary w-full" onClick={closeDeleteConfirm}>Cancel</button>
            <button className="btn btn-danger w-full" onClick={handleConfirm}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

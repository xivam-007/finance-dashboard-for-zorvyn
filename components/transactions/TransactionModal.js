import { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../data/mockData';
import { format } from 'date-fns';

const EXPENSE_CATEGORIES = Object.entries(CATEGORIES)
  .filter(([k]) => !['INCOME', 'FREELANCE', 'INVESTMENT'].includes(k));

const INCOME_CATEGORIES = Object.entries(CATEGORIES)
  .filter(([k]) => ['INCOME', 'FREELANCE', 'INVESTMENT'].includes(k));

export default function TransactionModal() {
  const { state, closeTransactionModal, addTransaction, editTransaction } = useFinance();
  const { open, transaction } = state.ui.transactionModal;
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'FOOD',
    date: format(new Date(), 'yyyy-MM-dd'),
    note: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setForm({ ...transaction, amount: String(transaction.amount) });
    } else {
      setForm({
        description: '',
        amount: '',
        type: 'expense',
        category: 'FOOD',
        date: format(new Date(), 'yyyy-MM-dd'),
        note: '',
      });
    }
    setErrors({});
  }, [transaction, open]);

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleChange = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));

    // Auto set sensible default category on type change
    if (key === 'type') {
      setForm(f => ({
        ...f,
        type: val,
        category: val === 'income' ? 'INCOME' : 'FOOD',
      }));
    }
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const data = { ...form, amount: Number(form.amount) };
    if (isEdit) {
      editTransaction(data);
    } else {
      addTransaction(data);
    }
    closeTransactionModal();
  };

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeTransactionModal(); }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</div>
          <button className="btn btn-icon" onClick={closeTransactionModal}>✕</button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Type toggle */}
          <div style={{ display: 'flex', gap: 8, background: 'var(--bg-tertiary)', padding: 4, borderRadius: 'var(--radius-md)' }}>
            {['expense', 'income'].map(t => (
              <button
                key={t}
                onClick={() => handleChange('type', t)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  fontSize: 14, fontWeight: 500, transition: 'var(--transition)',
                  background: form.type === t ? (t === 'income' ? 'var(--accent-green)' : 'var(--accent-red)') : 'transparent',
                  color: form.type === t ? 'white' : 'var(--text-secondary)',
                  textTransform: 'capitalize',
                }}
              >
                {t === 'income' ? '↑ ' : '↓ '}{t}
              </button>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <input
              className="form-input"
              placeholder="e.g. Grocery Shopping"
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
            />
            {errors.description && <div style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.description}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                className="form-input"
                type="number"
                placeholder="0"
                min="1"
                value={form.amount}
                onChange={e => handleChange('amount', e.target.value)}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
              {errors.amount && <div style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.amount}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={e => handleChange('date', e.target.value)}
              />
              {errors.date && <div style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.date}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
            >
              {categories.map(([key, val]) => (
                <option key={key} value={key}>{val.icon} {val.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Note (optional)</label>
            <input
              className="form-input"
              placeholder="Add a note..."
              value={form.note}
              onChange={e => handleChange('note', e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn btn-secondary w-full" onClick={closeTransactionModal}>Cancel</button>
            <button className="btn btn-primary w-full" onClick={handleSubmit}>
              {isEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useCategories } from '../hooks/useCategories';
import { useCreateTransaction } from '../hooks/useTransactions';
import type { TransactionType } from '../types/api.types';

const InputTransaction = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useCategories(type);
  const createMutation = useCreateTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!transactionDate) {
      setError('Please select a date');
      return;
    }

    try {
      await createMutation.mutateAsync({
        type,
        amount: parseFloat(amount).toFixed(2),
        transactionDate,
        categoryId: categoryId || undefined,
        description: description || undefined,
        status: 'approved',
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
    }
  };

  // Format number input with thousands separator
  const formatAmount = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) return amount;
    return cleaned;
  };

  return (
    <DashboardLayout>
      <div className="flex-1 h-full overflow-y-auto relative flex flex-col items-center">
        {/* Content Container */}
        <div className="w-full max-w-3xl px-6 py-8 md:py-12 flex flex-col gap-8 pb-32">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">New Transaction</h2>
            <p className="text-white/50 text-base font-normal">Fill in the details below to record your cash flow.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Transaction Type Toggle (Segmented Control) */}
          <div className="bg-surface-dark p-1.5 rounded-full flex relative border border-white/5 shadow-sm max-w-md self-center w-full">
            <label className="flex-1 relative cursor-pointer z-10">
              <input 
                type="radio" 
                name="type" 
                className="peer sr-only" 
                value="income" 
                checked={type === 'income'}
                onChange={() => { setType('income'); setCategoryId(''); }}
              />
              <div className="w-full h-10 md:h-12 flex items-center justify-center rounded-full text-white/60 font-medium text-sm md:text-base transition-all duration-300 peer-checked:text-background-dark peer-checked:bg-primary peer-checked:font-bold hover:text-white">
                Income
              </div>
            </label>
            <label className="flex-1 relative cursor-pointer z-10">
              <input 
                type="radio" 
                name="type" 
                className="peer sr-only" 
                value="expense" 
                checked={type === 'expense'}
                onChange={() => { setType('expense'); setCategoryId(''); }}
              />
              <div className="w-full h-10 md:h-12 flex items-center justify-center rounded-full text-white/60 font-medium text-sm md:text-base transition-all duration-300 peer-checked:text-background-dark peer-checked:bg-primary peer-checked:font-bold hover:text-white">
                Expense
              </div>
            </label>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Date & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Input */}
              <div className="flex flex-col gap-2">
                <label className="text-white font-semibold text-sm ml-2">Date</label>
                <div className="relative group">
                  <input 
                    type="date" 
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="w-full bg-surface-input text-white border border-white/10 rounded-full py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-white/30 hover:border-white/20" 
                  />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">calendar_month</span>
                </div>
              </div>
              {/* Category Input */}
              <div className="flex flex-col gap-2">
                <label className="text-white font-semibold text-sm ml-2">Category</label>
                <div className="relative group">
                  <select 
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={categoriesLoading}
                    className="w-full bg-surface-input text-white border border-white/10 rounded-full py-3.5 pl-12 pr-10 appearance-none focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none cursor-pointer hover:border-white/20 disabled:opacity-50"
                  >
                    <option value="">Select Category...</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">category</span>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-xl">expand_more</span>
                </div>
              </div>
            </div>

            {/* Amount (Big) */}
            <div className="flex flex-col gap-2">
              <label className="text-white font-semibold text-sm ml-2">Amount</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-medium text-lg pointer-events-none">$</span>
                <input 
                  type="text" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(formatAmount(e.target.value))}
                  className="w-full bg-surface-input text-white text-3xl font-bold tracking-tight border border-white/10 rounded-full py-5 pl-14 pr-6 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-white/20 hover:border-white/20" 
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-white font-semibold text-sm ml-2">Description</label>
              <textarea 
                rows={3} 
                placeholder="Write transaction details here..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface-input text-white border border-white/10 rounded-3xl py-4 px-5 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-white/30 resize-none hover:border-white/20"
              ></textarea>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-primary hover:bg-green-400 text-background-dark font-bold text-lg py-4 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                    SAVE TRANSACTION
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InputTransaction;

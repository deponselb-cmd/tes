import clsx from 'clsx';

interface KpiCardProps {
  title: string;
  amount: string;
  trend: string;
  trendType: 'up' | 'down';
  trendValue: string;
  icon: string;
  type: 'income' | 'expense' | 'balance';
}

export default function KpiCard({ title, amount, trend, trendType, trendValue, icon, type }: KpiCardProps) {
  const isBalance = type === 'balance';
  const isIncome = type === 'income';
  
  // Base classes for standard cards
  const cardClasses = clsx(
    "p-6 rounded-xl border shadow-sm relative overflow-hidden group flex flex-col gap-1 z-10",
    {
      // Standard cards (Income/Expense)
      "bg-white dark:bg-surface-dark border-slate-100 dark:border-[#2a3f33]": !isBalance,
      // Net Balance Card
      "bg-slate-900 dark:bg-[#15201b] border-slate-800 dark:border-[#2a3f33] shadow-lg ring-1 ring-primary/20": isBalance
    }
  );

  const iconBgClass = isBalance ? "bg-white/10 backdrop-blur-sm" : (isIncome ? "bg-primary/20" : "bg-secondary/20");
  const iconColorClass = isBalance ? "text-primary" : (isIncome ? "text-primary" : "text-secondary");
  
  const trendBgClass = isBalance ? "bg-primary text-slate-900" : (isIncome ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary");
  const trendArrow = trendType === 'up' ? 'arrow_upward' : 'arrow_downward';

  return (
    <div className={cardClasses}>
      {/* Background decorations */}
      {!isBalance && (
        <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
           <span className={`material-symbols-outlined text-6xl ${isIncome ? 'text-primary' : 'text-secondary'}`}>
             {trendType === 'up' ? 'trending_up' : 'trending_down'}
           </span>
        </div>
      )}
      {isBalance && (
        <>
            {/* Background gradient glow for Balance */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10"></div>
        </>
      )}

      <div className="flex flex-col gap-1 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className={`${iconBgClass} p-1.5 rounded-lg`}>
            <span className={`material-symbols-outlined text-xl ${iconColorClass}`}>{icon}</span>
          </div>
          <p className={`${isBalance ? 'text-gray-400' : 'text-slate-500 dark:text-gray-400'} font-medium text-sm`}>{title}</p>
        </div>
        <h3 className={`text-3xl font-bold tracking-tight ${isBalance ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{amount}</h3>
        <div className="flex items-center gap-1 mt-2">
          <span className={`${trendBgClass} text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1`}>
            <span className="material-symbols-outlined text-[10px] font-bold">{trendArrow}</span> {trendValue}
          </span>
          <span className={`text-xs ml-1 ${isBalance ? 'text-gray-400' : 'text-slate-400 dark:text-gray-500'}`}>{trend}</span>
        </div>
      </div>
    </div>
  );
}

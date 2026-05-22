import { useCashFlow } from '../hooks/useReports';

// Get date range for last 6 months
const getLast6MonthsRange = () => {
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().split('T')[0];
  return { startDate, endDate };
};

// Format month label from YYYY-MM to short month name
const formatMonthLabel = (yearMonth: string) => {
  const [year, month] = yearMonth.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('en-US', { month: 'short' });
};

// Format currency for tooltip
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ChartSection() {
  const { startDate, endDate } = getLast6MonthsRange();
  const { data: cashFlowData, isLoading } = useCashFlow({ startDate, endDate });

  // Calculate chart dimensions and scaling
  const chartWidth = 800;
  const chartHeight = 300;
  const padding = { top: 20, right: 20, bottom: 50, left: 20 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Calculate max value for scaling
  const maxValue = cashFlowData && cashFlowData.length > 0
    ? Math.max(...cashFlowData.flatMap(d => [d.income, d.expense])) * 1.1
    : 1000;

  // Calculate positions for each data point
  const getX = (index: number, total: number) => {
    return padding.left + (graphWidth / (total - 1 || 1)) * index;
  };

  const getY = (value: number) => {
    return padding.top + graphHeight - (value / maxValue) * graphHeight;
  };

  // Generate SVG path from data points
  const generatePath = (data: { x: number; y: number }[]) => {
    if (data.length === 0) return '';
    if (data.length === 1) return `M ${data[0].x} ${data[0].y}`;

    return data.reduce((path, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      
      const prevPoint = data[index - 1];
      const cpx1 = prevPoint.x + (point.x - prevPoint.x) / 3;
      const cpx2 = prevPoint.x + (2 * (point.x - prevPoint.x)) / 3;
      
      return `${path} C ${cpx1} ${prevPoint.y}, ${cpx2} ${point.y}, ${point.x} ${point.y}`;
    }, '');
  };

  // Generate filled area path for income gradient
  const generateAreaPath = (data: { x: number; y: number }[]) => {
    if (data.length === 0) return '';
    const linePath = generatePath(data);
    const firstX = data[0]?.x ?? 0;
    const lastX = data[data.length - 1]?.x ?? chartWidth;
    return `${linePath} L ${lastX} ${chartHeight - padding.bottom} L ${firstX} ${chartHeight - padding.bottom} Z`;
  };

  // Calculate data points
  const incomePoints = cashFlowData?.map((d, i) => ({
    x: getX(i, cashFlowData.length),
    y: getY(d.income),
    value: d.income,
  })) ?? [];

  const expensePoints = cashFlowData?.map((d, i) => ({
    x: getX(i, cashFlowData.length),
    y: getY(d.expense),
    value: d.expense,
  })) ?? [];

  // Find max income point for tooltip
  const maxIncomePoint = incomePoints.length > 0 
    ? incomePoints.reduce((max, p) => p.value > max.value ? p : max, incomePoints[0])
    : null;

  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-100 dark:border-[#2a3f33] shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-56 bg-slate-200 dark:bg-slate-700 rounded mt-2 animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex-1 w-full min-h-[250px] flex items-center justify-center">
          <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Handle empty data state
  if (!cashFlowData || cashFlowData.length === 0) {
    return (
      <div className="lg:col-span-2 bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-100 dark:border-[#2a3f33] shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cash Flow Trend</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">Income vs Expense (Last 6 months)</p>
          </div>
        </div>
        <div className="flex-1 w-full min-h-[250px] flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3 block">show_chart</span>
            <p className="text-slate-500 dark:text-gray-400 text-sm">No transaction data available</p>
            <p className="text-slate-400 dark:text-gray-500 text-xs mt-1">Add some transactions to see your cash flow trend</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-100 dark:border-[#2a3f33] shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cash Flow Trend</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">Income vs Expense (Last 6 months)</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <span className="text-xs text-slate-600 dark:text-gray-400">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-gray-600"></span>
            <span className="text-xs text-slate-600 dark:text-gray-400">Expense</span>
          </div>
        </div>
      </div>
      
      {/* Dynamic Chart Visualization using SVG */}
      <div className="flex-1 w-full h-full min-h-[250px] relative">
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
          {/* Grid Lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line 
              key={i}
              x1={padding.left} 
              y1={padding.top + graphHeight * (1 - ratio)} 
              x2={chartWidth - padding.right} 
              y2={padding.top + graphHeight * (1 - ratio)} 
              stroke="#2a3f33" 
              strokeWidth="1" 
              strokeDasharray="4 4" 
              strokeOpacity="0.3"
            />
          ))}

          {/* Expense Line (Gray/Secondary) */}
          <path 
            d={generatePath(expensePoints)} 
            fill="none" 
            stroke="#64748b" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="dark:stroke-slate-600"
          />

          {/* Income Area Fill + Line (Primary) */}
          <defs>
            <linearGradient id="incomeGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#36e27b" stopOpacity="0.2"></stop>
              <stop offset="100%" stopColor="#36e27b" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          <path d={generateAreaPath(incomePoints)} fill="url(#incomeGradient)" />
          <path d={generatePath(incomePoints)} fill="none" stroke="#36e27b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Dots on Income Line */}
          {incomePoints.map((point, i) => (
            <circle 
              key={i} 
              cx={point.x} 
              cy={point.y} 
              r="5" 
              fill="#112117" 
              stroke="#36e27b" 
              strokeWidth="2"
            />
          ))}

          {/* Tooltip Indicator for max income point */}
          {maxIncomePoint && (
            <g transform={`translate(${maxIncomePoint.x}, ${maxIncomePoint.y - 10})`}>
              <rect x="-40" y="-30" width="80" height="24" rx="4" fill="#36e27b"></rect>
              <text x="0" y="-14" textAnchor="middle" fill="#111714" fontSize="11" fontWeight="bold">
                {formatCurrency(maxIncomePoint.value)}
              </text>
              <line x1="0" y1="10" x2="0" y2={chartHeight - padding.bottom - maxIncomePoint.y + 10} stroke="#36e27b" strokeWidth="1" strokeDasharray="2 2"></line>
            </g>
          )}
        </svg>
        
        {/* X-Axis Labels */}
        <div className="flex justify-between text-xs text-slate-400 dark:text-gray-500 mt-2 px-2 font-medium uppercase tracking-wide">
          {cashFlowData.map((d, i) => (
            <span key={i}>{formatMonthLabel(d.month)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

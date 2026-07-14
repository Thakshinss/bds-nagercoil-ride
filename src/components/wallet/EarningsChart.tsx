import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { WalletTransaction } from '@/services/walletService';

interface Props {
  transactions: WalletTransaction[];
  mode: 'earnings' | 'withdrawals';
  title: string;
}

const monthKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const EarningsChart = ({ transactions, mode, title }: Props) => {
  const filter = (t: WalletTransaction) => {
    if (mode === 'earnings') return t.type === 'ride_credit' || t.type === 'bonus';
    return t.type === 'withdrawal';
  };

  const map = new Map<string, number>();
  transactions.filter(filter).forEach((t) => {
    const k = monthKey(t.created_at);
    map.set(k, (map.get(k) ?? 0) + Math.abs(Number(t.amount)));
  });

  const data = Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([month, value]) => ({ month, value: Math.round(value) }));

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-medium mb-3">{title}</h3>
      <div className="h-56">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
              <Bar dataKey="value" fill={mode === 'earnings' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default EarningsChart;

import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  walletService,
  DriverWallet as Wallet,
  WalletTransaction,
  WithdrawalRequest,
  WalletConfig,
  formatINR,
} from '@/services/walletService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Wallet as WalletIcon, TrendingUp, ArrowDownToLine, Clock, ArrowLeft } from 'lucide-react';
import WithdrawalDialog from '@/components/wallet/WithdrawalDialog';
import EarningsChart from '@/components/wallet/EarningsChart';
import { useToast } from '@/hooks/use-toast';

const statusColor = (s: string): 'default' | 'secondary' | 'destructive' => {
  if (s === 'approved' || s === 'completed') return 'default';
  if (s === 'rejected') return 'destructive';
  return 'secondary';
};

const txnLabel: Record<string, string> = {
  ride_credit: 'Ride Credit',
  commission_deduction: 'Commission',
  bonus: 'Bonus',
  penalty: 'Penalty',
  refund: 'Refund',
  withdrawal: 'Withdrawal',
  adjustment: 'Adjustment',
};

const DriverWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [txns, setTxns] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [config, setConfig] = useState<WalletConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      await walletService.ensureWallet(user.id);
      const [w, t, wd, cfg] = await Promise.all([
        walletService.getWallet(user.id),
        walletService.getTransactions(user.id),
        walletService.getWithdrawals(user.id),
        walletService.getConfig(),
      ]);
      setWallet(w);
      setTxns(t);
      setWithdrawals(wd);
      setConfig(cfg);
    } catch (e: any) {
      toast({ title: 'Failed to load wallet', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || !wallet) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Driver Wallet | BDS Cabs</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <Link to="/driver" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to dashboard
            </Link>
            <h1 className="text-3xl font-bold text-blue-950">My Wallet</h1>
            <p className="text-muted-foreground">Track your earnings and withdrawals</p>
          </div>
          <Button size="lg" onClick={() => setDialogOpen(true)}>
            <ArrowDownToLine className="w-4 h-4 mr-2" /> Request Withdrawal
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <SummaryCard icon={<WalletIcon className="w-5 h-5" />} label="Available" value={wallet.available_balance} accent="text-primary" />
          <SummaryCard icon={<Clock className="w-5 h-5" />} label="Pending" value={wallet.pending_balance} accent="text-orange-500" />
          <SummaryCard icon={<TrendingUp className="w-5 h-5" />} label="Total Earnings" value={wallet.total_earnings} accent="text-green-600" />
          <SummaryCard icon={<ArrowDownToLine className="w-5 h-5" />} label="Total Withdrawn" value={wallet.total_withdrawn} accent="text-blue-600" />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2 mb-8">
          <EarningsChart transactions={txns} mode="earnings" title="Monthly Earnings" />
          <EarningsChart transactions={txns} mode="withdrawals" title="Monthly Withdrawals" />
        </div>

        {/* Transactions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {txns.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground">No transactions yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {txns.slice(0, 20).map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {new Date(t.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{txnLabel[t.type] ?? t.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{t.description}</TableCell>
                      <TableCell className={`text-right font-medium ${Number(t.amount) < 0 ? 'text-destructive' : 'text-green-600'}`}>
                        {Number(t.amount) < 0 ? '-' : '+'}{formatINR(Math.abs(Number(t.amount)))}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatINR(t.balance_after)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Withdrawals */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {withdrawals.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground">No withdrawals yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requested</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {new Date(w.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">{formatINR(w.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={statusColor(w.status)} className="capitalize">
                          {w.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{w.admin_notes ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <WithdrawalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        available={Number(wallet.available_balance)}
        config={config}
        onSuccess={load}
      />
    </>
  );
};

const SummaryCard = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) => (
  <Card>
    <CardContent className="pt-6">
      <div className={`flex items-center gap-2 ${accent} mb-2`}>{icon}<span className="text-sm font-medium">{label}</span></div>
      <div className="text-2xl font-bold">{formatINR(value)}</div>
    </CardContent>
  </Card>
);

export default DriverWallet;

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  walletService,
  DriverWallet,
  WalletTransaction,
  WithdrawalRequest,
  formatINR,
} from '@/services/walletService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Gift, AlertTriangle, Eye } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
}

type Row = DriverWallet & { profile?: Profile };

const WalletManagementTab = () => {
  const { toast } = useToast();
  const [wallets, setWallets] = useState<Row[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Row | null>(null);
  const [selectedTxns, setSelectedTxns] = useState<WalletTransaction[]>([]);
  const [adjustOpen, setAdjustOpen] = useState<{ driver: Row; type: 'bonus' | 'penalty' } | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustDesc, setAdjustDesc] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [w, wd] = await Promise.all([walletService.getAllWallets(), walletService.getAllWithdrawals()]);
      const ids = Array.from(new Set([...w.map((x) => x.driver_id), ...wd.map((x) => x.driver_id)]));
      const map: Record<string, Profile> = {};
      if (ids.length) {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, phone, email')
          .in('id', ids);
        (data ?? []).forEach((p: any) => (map[p.id] = p));
      }
      setProfiles(map);
      setWallets(w.map((x) => ({ ...x, profile: map[x.driver_id] })));
      setWithdrawals(wd);
    } catch (e: any) {
      toast({ title: 'Load failed', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return wallets;
    return wallets.filter((w) => {
      const p = w.profile;
      return (
        p?.full_name?.toLowerCase().includes(q) ||
        p?.phone?.toLowerCase().includes(q) ||
        p?.email?.toLowerCase().includes(q) ||
        w.driver_id.toLowerCase().includes(q)
      );
    });
  }, [search, wallets]);

  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending' || w.status === 'processing');

  const openDetails = async (row: Row) => {
    setSelected(row);
    setSelectedTxns([]);
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('driver_id', row.driver_id)
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      setSelectedTxns((data ?? []) as WalletTransaction[]);
    } catch (e: any) {
      toast({ title: 'Failed to load transactions', description: e.message, variant: 'destructive' });
    }
  };

  const processWithdrawal = async (id: string, status: 'approved' | 'rejected') => {
    setProcessing(id);
    try {
      await walletService.processWithdrawal(id, status);
      toast({ title: `Withdrawal ${status}` });
      await load();
    } catch (e: any) {
      toast({ title: 'Action failed', description: e.message, variant: 'destructive' });
    } finally {
      setProcessing(null);
    }
  };

  const submitAdjustment = async () => {
    if (!adjustOpen) return;
    const n = Number(adjustAmount);
    if (!n || n <= 0 || !adjustDesc.trim()) {
      toast({ title: 'Enter amount and description', variant: 'destructive' });
      return;
    }
    try {
      await walletService.applyAdjustment(adjustOpen.driver.driver_id, adjustOpen.type, n, adjustDesc.trim());
      toast({ title: `${adjustOpen.type === 'bonus' ? 'Bonus' : 'Penalty'} applied` });
      setAdjustOpen(null);
      setAdjustAmount('');
      setAdjustDesc('');
      await load();
    } catch (e: any) {
      toast({ title: 'Failed', description: e.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending withdrawals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Withdrawal Requests ({pendingWithdrawals.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {pendingWithdrawals.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground">No pending requests</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingWithdrawals.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell>
                      <div className="font-medium">{profiles[w.driver_id]?.full_name ?? 'Driver'}</div>
                      <div className="text-xs text-muted-foreground">{profiles[w.driver_id]?.phone}</div>
                    </TableCell>
                    <TableCell className="font-medium">{formatINR(w.amount)}</TableCell>
                    <TableCell className="text-xs">{new Date(w.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">{w.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Button
                        size="sm"
                        disabled={processing === w.id}
                        onClick={() => processWithdrawal(w.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={processing === w.id}
                        onClick={() => processWithdrawal(w.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Wallets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Driver Wallets</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {filtered.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground">No wallets found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Lifetime</TableHead>
                  <TableHead>Withdrawn</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell>
                      <div className="font-medium">{w.profile?.full_name ?? 'Driver'}</div>
                      <div className="text-xs text-muted-foreground">{w.profile?.phone}</div>
                    </TableCell>
                    <TableCell className="font-medium text-primary">{formatINR(w.available_balance)}</TableCell>
                    <TableCell>{formatINR(w.pending_balance)}</TableCell>
                    <TableCell>{formatINR(w.lifetime_earnings)}</TableCell>
                    <TableCell>{formatINR(w.total_withdrawn)}</TableCell>
                    <TableCell className="text-right space-x-1 whitespace-nowrap">
                      <Button size="sm" variant="outline" onClick={() => openDetails(w)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setAdjustOpen({ driver: w, type: 'bonus' })}>
                        <Gift className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setAdjustOpen({ driver: w, type: 'penalty' })}>
                        <AlertTriangle className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details dialog */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.profile?.full_name ?? 'Driver'} — Wallet Details</DialogTitle>
            <DialogDescription>{selected?.profile?.phone} · {selected?.profile?.email}</DialogDescription>
          </DialogHeader>
          {selected && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <Metric label="Available" value={selected.available_balance} />
                <Metric label="Pending" value={selected.pending_balance} />
                <Metric label="Earnings" value={selected.total_earnings} />
                <Metric label="Withdrawn" value={selected.total_withdrawn} />
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Transactions</h4>
                {selectedTxns.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No transactions</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTxns.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="text-xs">{new Date(t.created_at).toLocaleString()}</TableCell>
                          <TableCell><Badge variant="outline">{t.type}</Badge></TableCell>
                          <TableCell className="text-xs">{t.description}</TableCell>
                          <TableCell className={`text-right ${Number(t.amount) < 0 ? 'text-destructive' : 'text-green-600'}`}>
                            {formatINR(t.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Adjustment dialog */}
      <Dialog open={!!adjustOpen} onOpenChange={(v) => !v && setAdjustOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apply {adjustOpen?.type === 'bonus' ? 'Bonus' : 'Penalty'} — {adjustOpen?.driver.profile?.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Amount (₹)</Label>
              <Input type="number" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} />
            </div>
            <div>
              <Label>Reason</Label>
              <Input value={adjustDesc} onChange={(e) => setAdjustDesc(e.target.value)} placeholder="e.g. Weekly performance bonus" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(null)}>Cancel</Button>
            <Button onClick={submitAdjustment}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-md border p-3">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="font-semibold">{formatINR(value)}</div>
  </div>
);

export default WalletManagementTab;

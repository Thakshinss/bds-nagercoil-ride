import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { walletService, WalletConfig, formatINR } from '@/services/walletService';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  available: number;
  config: WalletConfig | null;
  onSuccess: () => void;
}

const WithdrawalDialog = ({ open, onOpenChange, available, config, onSuccess }: Props) => {
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const submit = async () => {
    const n = Number(amount);
    if (!n || n <= 0) {
      toast({ title: 'Enter a valid amount', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await walletService.requestWithdrawal(n);
      toast({ title: 'Withdrawal request submitted' });
      setAmount('');
      onOpenChange(false);
      onSuccess();
    } catch (e: any) {
      toast({ title: 'Request failed', description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
          <DialogDescription>
            Available balance: <b>{formatINR(available)}</b>
            {config && (
              <>
                <br />
                Min: {formatINR(config.min_withdrawal)} · Max: {formatINR(config.max_withdrawal)}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="amt">Amount (₹)</Label>
          <Input
            id="amt"
            type="number"
            min={config?.min_withdrawal ?? 0}
            max={Math.min(available, config?.max_withdrawal ?? available)}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDialog;

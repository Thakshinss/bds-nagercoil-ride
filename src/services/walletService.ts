import { supabase } from '@/integrations/supabase/client';

export interface DriverWallet {
  id: string;
  driver_id: string;
  available_balance: number;
  pending_balance: number;
  total_earnings: number;
  total_withdrawn: number;
  lifetime_earnings: number;
  created_at: string;
  updated_at: string;
}

export type WalletTxnType =
  | 'ride_credit'
  | 'commission_deduction'
  | 'bonus'
  | 'penalty'
  | 'refund'
  | 'withdrawal'
  | 'adjustment';

export interface WalletTransaction {
  id: string;
  driver_id: string;
  ride_id: string | null;
  type: WalletTxnType;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string | null;
  created_at: string;
}

export type WithdrawalStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';

export interface WithdrawalRequest {
  id: string;
  driver_id: string;
  amount: number;
  status: WithdrawalStatus;
  admin_notes: string | null;
  processed_by: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WalletConfig {
  commission_percent: number;
  min_withdrawal: number;
  max_withdrawal: number;
}

export const walletService = {
  async ensureWallet(driverId: string) {
    const { data, error } = await supabase.rpc('ensure_driver_wallet', { _driver_id: driverId });
    if (error) throw error;
    return data as unknown as DriverWallet;
  },

  async getWallet(driverId: string): Promise<DriverWallet | null> {
    const { data } = await supabase
      .from('driver_wallets')
      .select('*')
      .eq('driver_id', driverId)
      .maybeSingle();
    return (data as DriverWallet) ?? null;
  },

  async getTransactions(driverId: string, limit = 100) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as WalletTransaction[];
  },

  async getAllTransactions(limit = 500) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as WalletTransaction[];
  },

  async getWithdrawals(driverId: string) {
    const { data, error } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as WithdrawalRequest[];
  },

  async getAllWithdrawals() {
    const { data, error } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as WithdrawalRequest[];
  },

  async getConfig(): Promise<WalletConfig> {
    const { data, error } = await supabase
      .from('wallet_config')
      .select('commission_percent, min_withdrawal, max_withdrawal')
      .eq('id', true)
      .maybeSingle();
    if (error) throw error;
    return (data as WalletConfig) ?? { commission_percent: 20, min_withdrawal: 100, max_withdrawal: 50000 };
  },

  async requestWithdrawal(amount: number) {
    const { data, error } = await supabase.rpc('request_withdrawal', { _amount: amount });
    if (error) throw error;
    return data as string;
  },

  async processWithdrawal(id: string, status: WithdrawalStatus, notes?: string) {
    const { error } = await supabase.rpc('process_withdrawal', {
      _request_id: id,
      _new_status: status,
      _notes: notes ?? null,
    });
    if (error) throw error;
  },

  async applyAdjustment(driverId: string, type: WalletTxnType, amount: number, description: string) {
    const { error } = await supabase.rpc('apply_wallet_adjustment', {
      _driver_id: driverId,
      _type: type,
      _amount: amount,
      _description: description,
      _ride_id: null,
    });
    if (error) throw error;
  },

  async getAllWallets() {
    const { data, error } = await supabase
      .from('driver_wallets')
      .select('*')
      .order('lifetime_earnings', { ascending: false });
    if (error) throw error;
    return (data ?? []) as DriverWallet[];
  },
};

export const formatINR = (n: number | null | undefined) =>
  '₹' + (Number(n ?? 0)).toLocaleString('en-IN', { maximumFractionDigits: 2 });

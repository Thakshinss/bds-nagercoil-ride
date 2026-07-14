
# Driver Wallet System

A full Uber/Ola-style wallet: automatic earnings on completed rides, immutable transaction ledger, withdrawal flow, driver dashboard, and admin management.

## 1. Database (single migration)

New tables in `public`:

- **`wallet_config`** (singleton row): `commission_percent` (default 20), `min_withdrawal` (default 100), `max_withdrawal` (default 50000).
- **`driver_wallets`**: `driver_id UNIQUE`, `available_balance`, `pending_balance`, `total_earnings`, `total_withdrawn`, `lifetime_earnings`.
- **`wallet_transactions`** (immutable ledger): `driver_id`, `ride_id` (nullable → `customer_bookings.id`), `type` enum (`ride_credit`, `commission_deduction`, `bonus`, `penalty`, `refund`, `withdrawal`, `adjustment`), `amount` (signed), `balance_before`, `balance_after`, `description`. No UPDATE/DELETE policy.
- **`withdrawal_requests`**: `driver_id`, `amount`, `status` enum (`pending`, `processing`, `approved`, `rejected`, `completed`), `admin_notes`, `processed_by`, `processed_at`.

Add `commission_amount` and `driver_earnings` columns to `customer_bookings` (nullable).

**Database functions (SECURITY DEFINER, atomic):**

- `ensure_driver_wallet(driver_id)` — creates wallet row if missing.
- `credit_ride_earnings(booking_id)` — reads fare + config, computes commission/earnings, writes two ledger rows (`ride_credit`, `commission_deduction`), updates wallet.
- `apply_wallet_adjustment(driver_id, type, amount, description, ride_id)` — for bonus/penalty/refund/adjustment by admin.
- `request_withdrawal(amount)` — validates against config + available balance, moves amount from `available` → tracked in request row.
- `process_withdrawal(request_id, new_status, notes)` — admin-only; on `approved`/`completed` writes `withdrawal` ledger row and decrements `total_withdrawn`; on `rejected` returns funds.

**Trigger:** on `customer_bookings` AFTER UPDATE, when `status` transitions to `completed`, call `credit_ride_earnings`.

**RLS:**
- Drivers read own wallet + transactions + withdrawal requests; can INSERT withdrawal requests only via `request_withdrawal` RPC.
- Admins read all + call admin RPCs.
- Ledger has no UPDATE/DELETE policy.

## 2. Ride completion flow

`DriverDashboard` already updates `customer_bookings.status`. The trigger handles crediting automatically — no UI change needed beyond a toast confirming earnings.

## 3. Driver Wallet page — `/wallet`

New page (driver-only, protected by `DriverRoute`), linked from `DriverDashboard`.

Sections:
- 4 summary cards: Available / Pending / Total Earnings / Total Withdrawn.
- **Request Withdrawal** button → dialog with amount input, min/max hint, calls `request_withdrawal` RPC.
- Recent Transactions table (last 20, expandable).
- Withdrawal History table with status badges.
- Two charts (recharts, already installed): Monthly Earnings bar, Monthly Withdrawals bar — aggregated client-side from transactions.

## 4. Admin Wallet tab

New tab in `Admin.tsx` → `WalletManagementTab`:
- Driver wallet list with search by name/phone (joins `profiles`).
- Row click → drawer with wallet details, full transactions, withdrawal requests.
- Pending withdrawal requests panel with Approve / Reject buttons (calls `process_withdrawal`).
- Manual Bonus / Penalty dialog per driver (calls `apply_wallet_adjustment`).

## 5. Files

**New**
- `supabase/migrations/<ts>_driver_wallet.sql`
- `src/pages/DriverWallet.tsx`
- `src/components/wallet/WithdrawalDialog.tsx`
- `src/components/wallet/EarningsChart.tsx`
- `src/components/admin/WalletManagementTab.tsx`
- `src/services/walletService.ts` (typed RPC wrappers + queries)

**Edited**
- `src/App.tsx` — add `/wallet` route under `DriverRoute`.
- `src/pages/DriverDashboard.tsx` — link to `/wallet`.
- `src/pages/Admin.tsx` — add Wallets tab.

## 6. Technical notes

- All balance mutations go through SECURITY DEFINER functions — the client never writes to `driver_wallets` or `wallet_transactions` directly.
- `wallet_transactions` is append-only (RLS grants SELECT + INSERT only via definer functions; no UPDATE/DELETE policy).
- Amounts stored as `numeric(12,2)`.
- `pending_balance` is reserved for future async payout holds; currently unused but exposed in the schema/UI.
- Migration includes GRANTs for `authenticated` (SELECT on wallet/tx/withdrawals for own rows via RLS) and `service_role` (ALL).

Shall I proceed?

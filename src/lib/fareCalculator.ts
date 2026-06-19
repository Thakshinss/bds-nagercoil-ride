// Simple per-km fare estimator. Real distance/maps integration comes later.
export type VehicleType = 'auto' | 'sedan' | 'suv' | 'premium';

export const VEHICLE_RATES: Record<VehicleType, { base: number; perKm: number; label: string }> = {
  auto: { base: 30, perKm: 14, label: 'Auto' },
  sedan: { base: 60, perKm: 15, label: 'Sedan (Etios / Dzire)' },
  suv: { base: 100, perKm: 18, label: 'SUV (Innova / Ertiga)' },
  premium: { base: 150, perKm: 22, label: 'Premium (Innova Crysta)' },
};

export const estimateFare = (vehicle: VehicleType, distanceKm: number) => {
  const cfg = VEHICLE_RATES[vehicle];
  if (!cfg || !distanceKm || distanceKm <= 0) return 0;
  return Math.round(cfg.base + cfg.perKm * distanceKm);
};

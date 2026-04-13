export const LOCKUPS = [
  {
    person: 'Richard Brännemark',
    role: 'CEO & Founder',
    shares: 4_200_000,
    expiryDate: '2026-06-30',
    pctOfCapital: 13.69,
    type: 'IPO lock-up extension',
  },
  {
    person: 'Erik Lundström',
    role: 'Board Member',
    shares: 80_000,
    expiryDate: '2026-12-15',
    pctOfCapital: 0.26,
    type: 'Restricted stock award',
  },
  {
    person: 'Anna Karin Hellström',
    role: 'CFO',
    shares: 60_000,
    expiryDate: '2027-03-31',
    pctOfCapital: 0.20,
    type: 'Restricted stock award',
  },
];

export const LOCKUP_SUMMARY = {
  totalShares: 4_340_000,
  pctOfCapital: 14.15,
  activeAgreements: 3,
  nextExpiryDate: '2026-06-30',
  nextExpiryShares: 4_200_000,
  nextExpiryPct: 13.69,
};

export const LOCKUP_RELEASES = [
  {
    date: '2024-11-20',
    person: 'Erik Lundström',
    shares: 240_000,
    pctOfCapital: 0.78,
    note: 'Board package vesting tranche',
  },
  {
    date: '2024-03-14',
    person: 'Original IPO syndicate',
    shares: 1_200_000,
    pctOfCapital: 3.91,
    note: '180-day post-IPO lock-up',
  },
];

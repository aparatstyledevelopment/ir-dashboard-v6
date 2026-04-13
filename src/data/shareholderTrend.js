// 12-month history of the shareholder base.
export const OWNER_TREND_12M = {
  months: [
    'May 25',
    'Jun 25',
    'Jul 25',
    'Aug 25',
    'Sep 25',
    'Oct 25',
    'Nov 25',
    'Dec 25',
    'Jan 26',
    'Feb 26',
    'Mar 26',
    'Apr 26',
  ],
  ownerCount: [
    3374, 3389, 3401, 3412, 3424, 3438, 3451, 3460, 3470, 3478, 3489, 3498,
  ],
  freeFloat: [
    72.04, 71.80, 71.55, 71.30, 71.05, 70.85, 70.65, 70.45, 70.25, 70.10,
    69.99, 69.94,
  ],
  foreign: [
    21.38, 21.21, 21.02, 20.85, 20.71, 20.55, 20.41, 20.30, 20.22, 20.15,
    20.10, 20.08,
  ],
  top25Concentration: [
    55.50, 55.42, 55.30, 55.18, 55.05, 54.92, 54.78, 54.65, 54.50, 54.40,
    54.28, 54.20,
  ],
};

export const COUNTRY_BREAKDOWN = [
  { country: 'SE', label: 'Sweden', capitalPct: 68.40, ownerCount: 3201 },
  { country: 'NO', label: 'Norway', capitalPct: 21.71, ownerCount: 18 },
  { country: 'US', label: 'United States', capitalPct: 3.16, ownerCount: 42 },
  { country: 'SA', label: 'Saudi Arabia', capitalPct: 1.98, ownerCount: 3 },
  { country: 'DK', label: 'Denmark', capitalPct: 1.52, ownerCount: 8 },
  { country: 'GB', label: 'United Kingdom', capitalPct: 1.21, ownerCount: 14 },
  { country: 'DE', label: 'Germany', capitalPct: 0.46, ownerCount: 4 },
  { country: 'OTHER', label: 'Other / Undisclosed', capitalPct: 1.56, ownerCount: 208 },
];

export const TYPE_BREAKDOWN = [
  {
    type: 'Individual',
    capitalPct: 32.4,
    ownerCount: 2891,
    note: 'Founder + retail individuals',
  },
  {
    type: 'Fund',
    capitalPct: 25.8,
    ownerCount: 218,
    note: 'Mutual + ETF + active long-only',
  },
  {
    type: 'Strategic / Other',
    capitalPct: 24.1,
    ownerCount: 12,
    note: 'Concentrated strategic blocks',
  },
  {
    type: 'Pension & Insurance',
    capitalPct: 11.6,
    ownerCount: 84,
    note: 'AP funds, insurance, pensions',
  },
  {
    type: 'Bank / Brokerage',
    capitalPct: 6.1,
    ownerCount: 293,
    note: 'Custody-aggregated retail',
  },
];

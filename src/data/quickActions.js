import { Users, ArrowDownUp, Lock, Target, Mail, ArrowUpDown, GitCompare } from 'lucide-react';

// Quick actions for each module. The `screen` field maps to the
// artifact screen key used by openArtifact().
export const QUICK_ACTIONS = {
  dashboard: {
    title: 'Dashboard quick actions',
    subtitle: 'Jump to a key view',
    items: [
      { id: 'qa.dash.owners', icon: Users, label: 'All shareholders', sub: '3,498 identified holders', screen: 'shareholders-owners' },
      { id: 'qa.dash.contacts', icon: Mail, label: 'All contacts', sub: 'IR CRM database', screen: 'crm-people' },
      { id: 'qa.dash.transactions', icon: ArrowDownUp, label: 'Daily transactions', sub: 'Register flow (T+2)', screen: 'shareholders-daily-transactions' },
      { id: 'qa.dash.lockups', icon: Lock, label: 'Lock-up agreements', sub: 'Active lock-ups & expiry', screen: 'shareholders-lockups' },
      { id: 'qa.dash.targets', icon: Target, label: 'Targeting screener', sub: 'AI-prioritized prospects', screen: 'targeting-screener' },
    ],
  },
  shareholders: {
    title: 'Shareholders quick actions',
    subtitle: 'Jump to a key view',
    items: [
      { id: 'qa.sh.owners', icon: Users, label: 'Full shareholder register', sub: '3,498 identified holders', screen: 'shareholders-owners' },
      { id: 'qa.sh.daily', icon: ArrowDownUp, label: 'Daily transactions (T+2)', sub: 'Last 14 days of register flow', screen: 'shareholders-daily-transactions' },
      { id: 'qa.sh.changes', icon: ArrowUpDown, label: 'Owner changes (30d)', sub: 'Net moves over the last month', screen: 'shareholders-owner-changes' },
      { id: 'qa.sh.lockup', icon: Lock, label: 'Lock-up agreements', sub: 'Active agreements & expiry', screen: 'shareholders-lockups' },
    ],
  },
  targeting: {
    title: 'Targeting quick actions',
    subtitle: 'Jump to a key view',
    items: [
      { id: 'qa.tgt.screener', icon: Target, label: 'Target screener', sub: 'All AI-prioritized candidates', screen: 'targeting-screener' },
      { id: 'qa.tgt.compare', icon: GitCompare, label: 'Compare owners', sub: 'Peer holder overlap matrix', screen: 'targeting-compare-owners' },
    ],
  },
};

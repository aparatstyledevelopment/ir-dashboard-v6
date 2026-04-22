// Report registry — one entry per module. The metadata is used by the
// conversation response cards (document tile + generating message) and
// by the ReportView to resolve which article to render.
export const REPORTS = {
  dashboard: {
    id: 'dashboard',
    module: 'dashboard',
    title: 'INTEG B — Weekly IR Briefing',
    subject: 'the dashboard briefing',
    fileName: 'integ-b-weekly-briefing.pdf',
    sections: 6,
    charts: 5,
    readTime: '4 min read',
  },
  shareholders: {
    id: 'shareholders',
    module: 'shareholders',
    title: 'INTEG B — Shareholder Register Deep Dive',
    subject: 'the shareholder register',
    fileName: 'integ-b-shareholder-register.pdf',
    sections: 6,
    charts: 5,
    readTime: '5 min read',
  },
  targeting: {
    id: 'targeting',
    module: 'targeting',
    title: 'INTEG B — Targeting Pipeline Report',
    subject: 'the targeting pipeline',
    fileName: 'integ-b-targeting-pipeline.pdf',
    sections: 6,
    charts: 4,
    readTime: '4 min read',
  },
};

export function getReport(id) {
  return REPORTS[id] || null;
}

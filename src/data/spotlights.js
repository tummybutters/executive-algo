export const spotlightCategories = [
  'Model Strategy',
  'Infrastructure',
  'Markets',
  'Policy',
  'Product'
];

export const spotlights = [
  {
    slug: 'model-moats-2025',
    title: 'Model Moats Are Shifting',
    summary: 'Why distribution, data access, and product loops are becoming the real moat, not model size alone.',
    category: 'Model Strategy',
    date: 'Jan 20, 2026',
    readTime: '7 min'
  },
  {
    slug: 'compute-bottleneck',
    title: 'The Compute Bottleneck',
    summary: 'How power, supply chain, and inference efficiency are quietly setting the pace of progress.',
    category: 'Infrastructure',
    date: 'Jan 16, 2026',
    readTime: '6 min'
  },
  {
    slug: 'agentic-workflows',
    title: 'Agentic Workflows Are The New UI',
    summary: 'Teams that ship repeatable agent loops are compounding faster than teams shipping features.',
    category: 'Product',
    date: 'Jan 12, 2026',
    readTime: '8 min'
  },
  {
    slug: 'ai-spend-cycle',
    title: 'The AI Spend Cycle',
    summary: 'Where budgets are actually moving in 2026 and why it is not just headcount replacement.',
    category: 'Markets',
    date: 'Jan 6, 2026',
    readTime: '5 min'
  },
  {
    slug: 'policy-friction',
    title: 'Policy Is The New Product Constraint',
    summary: 'Regulatory timelines are now shipping features and shaping how models get deployed.',
    category: 'Policy',
    date: 'Dec 28, 2025',
    readTime: '6 min'
  }
];

export const getSpotlightBySlug = (slug) => spotlights.find((item) => item.slug === slug);

/**
 * Mock data for development — will be replaced by real API responses
 */

export const mockEmployee = {
  id: '882910',
  name: 'MAHAMMADJONOV RAVSHANJON',
  position: 'Sales Manager',
  grade: 'Senior Associate',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAXlylhs_18Y6Hp-4yffh79-a91WEgynoYn3hyuTCTg0q8Fq7S5qYdKXu-OqwxmePqYAJi-DxyoBiM0q44boCmgQ52neZwtTosTNy40cVdBoNfB2pIwW8k3809XDAyh7wOdMukMeEH-73smQFWqN07V0KoybyqS2LSj81LYI0NPe1uEBfokG75nIGGbpKeKuJc6dW-Znd_CFujKCbIfmSVhHM0lNwnAHNcKZtSayrVEotkvmTBpkql0-vmRyA9wpnjaXbUtCoTlWzJz',
  settingsAvatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCDlN2BxYnuBjPRbWlwOiEGxhDiTWJi2LGtUw_FuI2d6jjlaFbuneWJzz5oGZs-kagiOecQNBuvOCTgrLLe3Wegu80SQ7vUF6DVsMXGgXQHEXbwk0dEWL8lI239Fcm-ZsJT7fu5BwXEnPxBd43GXVPyrRB_HYfWkd3qpq33aY7764i5aupMd98Zns8LwNpSI6j_BkoI8mN3scNCeBg1VMgjsOpx7REzbygl31zPm1uezpKGOfbmmfDbqkeZhFdFSLCHTPN4_EvAx4Se',
  reportingPeriod: 'February 2026',
}

export const mockSalary = {
  currency: 'UZS',
  period: 'February 2026',
  trend: '+12% vs Jan',
  workingDays: { completed: 24, total: 24 },
  components: [
    {
      id: 'base',
      label: 'Base Salary',
      sublabel: 'Guaranteed Monthly',
      amount: 3_500_000,
      icon: 'payments',
    },
    {
      id: 'transport',
      label: 'Transport Comp',
      sublabel: 'Standard Allowance',
      amount: 500_000,
      icon: 'commute',
    },
    {
      id: 'qualification',
      label: 'Qual. Bonus',
      sublabel: 'Certification Grade',
      amount: 212_500,
      icon: 'workspace_premium',
    },
    {
      id: 'kpi',
      label: 'KPI Bonus',
      sublabel: 'Target Achievement',
      amount: 4_750_000,
      icon: 'query_stats',
    },
    {
      id: 'overachievement',
      label: 'Overachievement Bonus',
      sublabel: null,
      amount: 3_660_000,
      icon: 'rocket_launch',
      highlight: true, // special green row
    },
  ],
  total: 12_622_500,
  disclaimer:
    'This is estimation of salary and does not include any penalties! Contact your supervisor on miscalculations',
}

export const mockKPI = {
  period: 'February 2026',
  workingDays: { completed: 24, total: 24 },
  planAchievement: 131.98,
  salesPlan: 78_000_000,
  actualRevenue: 102_945_795,
  ordersTotal: 123_710_835,
  returnsTotal: 20_765_040,
  overplan: 24_945_795,
  acb: {
    plan: 120,
    actual: 296,
    achievement: 246.67,
  },
  overachievementSteps: {
    completed: 3,
    total: 4,
    nextGoalBonus: 1_220_000,
    salesGap: 6_254_205,
  },
}

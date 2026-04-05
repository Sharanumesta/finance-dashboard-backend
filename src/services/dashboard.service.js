import { prisma } from "../config/db.js";

/**
 * Returns overall income, expense, and net balance totals.
 */
const getSummary = async () => {
  const [incomeResult, expenseResult] = await Promise.all([
    prisma.transaction.aggregate({
      where: { type: "INCOME", isDeleted: false },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: { type: "EXPENSE", isDeleted: false },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const totalIncome = parseFloat(incomeResult._sum.amount || 0);
  const totalExpenses = parseFloat(expenseResult._sum.amount || 0);

  return {
    totalIncome,
    totalExpenses,
    netBalance: parseFloat((totalIncome - totalExpenses).toFixed(2)),
    transactionCount: {
      income: incomeResult._count,
      expense: expenseResult._count,
      total: incomeResult._count + expenseResult._count,
    },
  };
};

/**
 * Returns totals grouped by category, split by type.
 */
const getCategoryBreakdown = async () => {
  const rows = await prisma.transaction.groupBy({
    by: ["category", "type"],
    where: { isDeleted: false },
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: "desc" } },
  });

  // Reshape into { category, income, expense, net }
  const map = {};
  for (const row of rows) {
    if (!map[row.category])
      map[row.category] = {
        category: row.category,
        income: 0,
        expense: 0,
        transactionCount: 0,
      };
    const amount = parseFloat(row._sum.amount || 0);
    if (row.type === "INCOME") map[row.category].income = amount;
    else map[row.category].expense = amount;
    map[row.category].transactionCount += row._count;
  }

  return Object.values(map).map((c) => ({
    ...c,
    net: parseFloat((c.income - c.expense).toFixed(2)),
  }));
};

/**
 * Returns income and expense totals grouped by calendar month for the last N months.
 */
const getMonthlyTrends = async (months = 6) => {
  const since = new Date();
  since.setMonth(since.getMonth() - months);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const transactions = await prisma.transaction.findMany({
    where: { date: { gte: since }, isDeleted: false },
    select: { amount: true, type: true, date: true },
  });

  const monthMap = {};
  for (const t of transactions) {
    const key = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, "0")}`;
    if (!monthMap[key]) monthMap[key] = { month: key, income: 0, expense: 0 };
    const amount = parseFloat(t.amount);
    if (t.type === "INCOME") monthMap[key].income += amount;
    else monthMap[key].expense += amount;
  }

  return Object.values(monthMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((m) => ({ ...m, net: parseFloat((m.income - m.expense).toFixed(2)) }));
};

/**
 * Returns income and expense totals grouped by week (ISO week number).
 */
const getWeeklyTrends = async (weeks = 8) => {
  const since = new Date();
  since.setDate(since.getDate() - weeks * 7);

  const transactions = await prisma.transaction.findMany({
    where: { date: { gte: since }, isDeleted: false },
    select: { amount: true, type: true, date: true },
  });

  const getISOWeek = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    const weekNum =
      1 +
      Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
  };

  const weekMap = {};
  for (const t of transactions) {
    const key = getISOWeek(t.date);
    if (!weekMap[key]) weekMap[key] = { week: key, income: 0, expense: 0 };
    const amount = parseFloat(t.amount);
    if (t.type === "INCOME") weekMap[key].income += amount;
    else weekMap[key].expense += amount;
  }

  return Object.values(weekMap)
    .sort((a, b) => a.week.localeCompare(b.week))
    .map((w) => ({ ...w, net: parseFloat((w.income - w.expense).toFixed(2)) }));
};

/**
 * Returns the N most recent transactions.
 */
const getRecentActivity = async (limit = 10) => {
  return prisma.transaction.findMany({
    where: { isDeleted: false },
    orderBy: { date: "desc" },
    take: limit,
    include: { user: { select: { id: true, name: true } } },
  });
};

export {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getWeeklyTrends,
  getRecentActivity,
};

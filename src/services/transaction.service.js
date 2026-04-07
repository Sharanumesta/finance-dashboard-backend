import { prisma } from "../config/db.js";

/**
 * Build a Prisma where clause from query filters.
 */
const buildWhere = ({ type, category, startDate, endDate } = {}) => {
  const where = { isDeleted: false };

  if (type) where.type = type;

  if (category) {
    where.category = {
      contains: category,
      mode: "insensitive",
    };
  }

  // if (userId) where.userId = userId;

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  return where;
};

export const listTransactions = async (params = {}) => {
  const {
    page = 1,
    limit = 20,
    type,
    category,
    startDate,
    endDate,
    sortBy = "date",
    sortOrder = "desc",
    userId,
  } = params;

  const skip = (page - 1) * limit;

  const where = buildWhere({
    type,
    category,
    startDate,
    endDate,
    userId,
  });

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getTransactionById = async (id) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, isDeleted: false },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!transaction) {
    const err = new Error("Transaction not found");
    err.statusCode = 404;
    throw err;
  }

  return transaction;
};

export const createTransaction = async (data, userId) => {
  return prisma.transaction.create({
    data: {
      amount: parseFloat(data.amount),
      type: data.type,
      category: data.category.trim(),
      date: new Date(data.date),
      notes: data.notes?.trim() || null,
      userId,
    },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

export const updateTransaction = async (id, data) => {
  await getTransactionById(id);

  const updateData = {};

  if (data.amount !== undefined)
    updateData.amount = parseFloat(data.amount);

  if (data.type !== undefined)
    updateData.type = data.type;

  if (data.category !== undefined)
    updateData.category = data.category.trim();

  if (data.date !== undefined)
    updateData.date = new Date(data.date);

  if (data.notes !== undefined)
    updateData.notes = data.notes?.trim() || null;

  return prisma.transaction.update({
    where: { id },
    data: updateData,
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

export const deleteTransaction = async (id) => {
  await getTransactionById(id);

  return prisma.transaction.update({
    where: { id },
    data: { isDeleted: true },
    select: { id: true },
  });
};
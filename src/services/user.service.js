import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";

const SAFE_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

const listUsers = async ({ page = 1, limit = 20, status, role } = {}) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (status) where.status = status;
  if (role) where.role = role;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: SAFE_SELECT,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: SAFE_SELECT,
  });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

const updateUser = async (id, { name, role, status }) => {
  await getUserById(id); // ensure exists

  return prisma.user.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(role !== undefined && { role }),
      ...(status !== undefined && { status }),
    },
    select: SAFE_SELECT,
  });
};

const deleteUser = async (id) => {
  await getUserById(id);
  // Soft-delete by deactivating
  return prisma.user.update({
    where: { id },
    data: { status: "INACTIVE" },
    select: SAFE_SELECT,
  });
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    const err = new Error("Current password is incorrect");
    err.statusCode = 400;
    throw err;
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
  return { message: "Password updated" };
};

export default { listUsers, getUserById, updateUser, deleteUser, changePassword };

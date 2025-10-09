import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/apperror";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

// Create user
const createUser = async (payload: any) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing user data");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(payload.password, envVars.BCRYPT_SALT_ROUND);

  const user = await prisma.user.create({
    data: {
      email: payload.email,
      password: hashedPassword,
      name: payload.name,
      picture: payload.picture,
      phone: payload.phone,
      role: payload.role || "USER",
      status: payload.status || "ACTIVE",
    },
  });

  return user;
};

// Get all users
const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
  return users;
};

const getUserById = async (id: string) => {
  // Convert string to number safely
  const numericId = Number(id);

  if (isNaN(numericId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID format");
  }

  const user = await prisma.user.findUnique({
    where: { id: numericId },
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};


// Get my profile (for logged-in user)
const getMe = async (userId: number) => {
  if (typeof userId !== "number" || isNaN(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID format");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};





// Update own profile
const updateMyProfile = async (userId: string, payload: any) => {
  const existingUser = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Hash password if provided
  if (payload.password) {
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      name: payload.name ?? existingUser.name,
      email: payload.email ?? existingUser.email,
      phone: payload.phone ?? existingUser.phone,
      picture: payload.picture ?? existingUser.picture,
      password: payload.password ?? existingUser.password,
    },
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return updatedUser;
};

// Update any user (admin only)
const updateUser = async (userId: string, payload: any) => {
  const existingUser = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Hash password if provided
  if (payload.password) {
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      name: payload.name ?? existingUser.name,
      email: payload.email ?? existingUser.email,
      phone: payload.phone ?? existingUser.phone,
      picture: payload.picture ?? existingUser.picture,
      password: payload.password ?? existingUser.password,
      role: payload.role ?? existingUser.role,
      status: payload.status ?? existingUser.status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return updatedUser;
};

// Export all
export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  getMe,
  updateMyProfile,
  updateUser,
};

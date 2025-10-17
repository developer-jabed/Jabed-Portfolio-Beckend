import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/apperror";
import httpStatus from "http-status-codes";
import { IProject } from "./project.interface";

const createProject = async (payload: IProject, ownerId: number) => {
  if (!payload.title || !payload.slug || !payload.description) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing required project fields");
  }

  const existingSlug = await prisma.project.findUnique({
    where: { slug: payload.slug },
  });
  if (existingSlug) {
    throw new AppError(httpStatus.BAD_REQUEST, "Project slug already exists");
  }

  const project = await prisma.project.create({
    data: {
      title: payload.title,
      slug: payload.slug,
      description: payload.description,
      thumbnail: payload.thumbnail,
      liveUrl: payload.liveUrl,
      repoUrl: payload.repoUrl,
      features: payload.features || [],
      ownerId,
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return project;
};

const getAllProjects = async () => {
  return await prisma.project.findMany({
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getProjectById = async (id: number) => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!project) throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  return project;
};

const updateProject = async (id: number, payload: Partial<IProject>) => {
  const existingProject = await prisma.project.findUnique({ where: { id } });
  if (!existingProject) throw new AppError(httpStatus.NOT_FOUND, "Project not found");

  return await prisma.project.update({
    where: { id },
    data: {
      title: payload.title ?? existingProject.title,
      slug: payload.slug ?? existingProject.slug,
      description: payload.description ?? existingProject.description,
      thumbnail: payload.thumbnail ?? existingProject.thumbnail,
      liveUrl: payload.liveUrl ?? existingProject.liveUrl,
      repoUrl: payload.repoUrl ?? existingProject.repoUrl,
      features: payload.features ?? existingProject.features,
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

const deleteProject = async (id: number) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new AppError(httpStatus.NOT_FOUND, "Project not found");

  await prisma.project.delete({ where: { id } });
  return { message: "Project deleted successfully" };
};

export const ProjectService = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};

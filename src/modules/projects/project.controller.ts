import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { ProjectService } from "./project.service";
import { sendResponse } from "../../utility/sendResponse";
import { JwtPayload } from "jsonwebtoken";

export const ProjectController = {
  createProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = Number((req.user as JwtPayload).userId);
      const project = await ProjectService.createProject(req.body, ownerId);

      sendResponse(res, {
        success: true,
        statuscode: httpStatus.CREATED,
        message: "Project created successfully",
        data: project,
      });
    } catch (err) {
      next(err);
    }
  },

  getAllProjects: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await ProjectService.getAllProjects();
      sendResponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Projects retrieved successfully",
        data: projects,
      });
    } catch (err) {
      next(err);
    }
  },

  getProjectById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const project = await ProjectService.getProjectById(id);
      sendResponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Project retrieved successfully",
        data: project,
      });
    } catch (err) {
      next(err);
    }
  },

  updateProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const updated = await ProjectService.updateProject(id, req.body);
      sendResponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Project updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await ProjectService.deleteProject(id);
      sendResponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: result.message,
        data: null,
      });
    } catch (err) {
      next(err);
    }
  },
};

import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { responseStatus } from "../helper/response";

let adminService = new AdminService();

export const addGroceryItem = (req: Request, res: Response) => {
    try {
        return adminService.addGroceryItem(req, res);
    } catch (error: any) {
        return responseStatus(res, 500, error.message, error);
    }
}

export const getGroceryItems = (req: Request, res: Response) => {
    try {
        return adminService.getGroceryItems(req, res);
    } catch (error: any) {
        return responseStatus(res, 500, error.message, error);
    }
}

export const getGroceryItemById = (req: Request, res: Response) => {
    try {
        return adminService.getGroceryItembyId(req, res);
    } catch (error: any) {
        return responseStatus(res, 500, error.message, error);
    }
}

export const updateGroceryItemById = (req: Request, res: Response) => {
    try {
        return adminService.updateGroceryItembyId(req, res);
    } catch (error: any) {
        return responseStatus(res, 500, error.message, error);
    }
}

export const deleteGroceryItemById = (req: Request, res: Response) => {
    try {
        return adminService.deleteGroceryItembyId(req, res);
    } catch (error: any) {
        return responseStatus(res, 500, error.message, error);
    }
}

export const manageGroceryItemById = (req: Request, res: Response) => {
    try {
        return adminService.manageInventory(req, res);
    } catch (error: any) {
        return responseStatus(res, 500, error.message, error);
    }
}
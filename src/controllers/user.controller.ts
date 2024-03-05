import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { responseStatus } from "../helper/response";

let userService = new UserService();

export const adduser = (req: Request, res: Response) => {
    try {
        console.log(1)
        return userService.addUser(req, res);
    } catch (error: any) {
        return responseStatus(res, 500, error.message, error);
    }
}

export const getusers = (req: Request, res: Response) => {
    try {
        return userService.getallUser(req, res);
    } catch (error: any) {
        return responseStatus(res, 500, error.message, error);
    }
}

export const bookOrder = (req: Request, res: Response) => {
    try {
        return userService.bookOrder(req, res);
    } catch (error: any) {
        return responseStatus(res, 500, error.message, error);
    }
}

export const viewGroceryItems = (req: Request, res: Response) => {
    try {
        return userService.viewGroceryItems(req, res);
    } catch (error: any) {
        return responseStatus(res, 500, error.message, error);
    }
}

